const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");

const { $, sleep } = require("zx");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { log } = require("console");

// Configure zx to be quiet (no command echoing)
$.verbose = false;

const app = express();
const fileApp = express();

// Add JSON middleware for parsing request bodies
app.use('/api', express.json({ limit: '10mb' })); // Only parse for /api routes
app.use(express.text({ limit: '10mb' }));

const PORT = 8200;
const FILEPORT = 8201;

const PROFILES_DIR = path.join(__dirname, "profiles");
const STATIC_DIR = path.join(__dirname, "static");

const registeredProfiles = new Map();
const usedPorts = new Set();
const portRange = { start: 14300, end: 14399 };
// =======================================================

app.use(express.static(STATIC_DIR));
app.use(express.static(PROFILES_DIR));

fileApp.use(express.static(path.join(__dirname, "profiles")));
fileApp.get("/", (req, res) => res.send("profiles"));

function getAllFiles(dir, baseDir = dir, result = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(baseDir, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllFiles(fullPath, baseDir, result);
    } else {
      result.push({
        id: path.basename(fullPath, path.extname(fullPath)),
        name: path.basename(fullPath),
        path: fullPath,
      });
    }
  }
  return result;
}
function findAvailablePort(start = 14300, end = 14399, usedPorts = new Set()) {
  for (let port = start; port <= end; port++) {
    if (!usedPorts.has(port)) return port;
  }
  return null;
}

app.get("/api/profiles", (req, res) => {
  try {
    const files = getAllFiles(PROFILES_DIR);
    res.json(
      files
        .filter((itm) => itm.path?.includes(".json"))
        .map((itm) => {
          const profileInfo = registeredProfiles.get(itm.id);
          return {
            running: profileInfo ? profileInfo.running : false,
            content: fs.readFileSync(itm.path, "utf-8"),
            ...itm,
          };
        })
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/profiles/:id/start", async (req, res) => {
  const id = req.params.id;
  const profilePath = path.join(PROFILES_DIR, `${id}.json`);

  if (!fs.existsSync(profilePath)) {
    return res.status(404).json({ error: `Profile '${id}.json' not found` });
  }

  if (registeredProfiles.has(id)) {
    const profileInfo = registeredProfiles.get(id);
    if (profileInfo.running) {
      return res.status(200).json({
        message: `Mockoon service for '${id}' is already running`,
        profilePath: profilePath,
        port: profileInfo.port,
        apiRoot: `/mockoonshare/${id}`,
        content: fs.readFileSync(profilePath, "utf-8"),
      });
    }

  }

  let port;
  if (registeredProfiles.has(id)) {
    // Reuse existing port for stopped profile
    port = registeredProfiles.get(id).port;
    console.log(`Reusing port ${port} for profile '${id}'`);
  } else {
    // Find new port for new profile
    port = findAvailablePort(portRange.start, portRange.end, usedPorts);
    if (!port) {
      return res
        .status(500)
        .json({ error: "No available port in range 14300-14399" });
    }
  }

  try {
    // Use zx for clean command execution
    console.log(`Starting Mockoon service for '${id}' on port ${port}`);
    const p = $`npx mockoon-cli start --data ${profilePath} --port ${port} --watch`.nothrow();

    p.stdout.on("data", (chunk) => {
      console.log(`stdout: ${chunk}`);
    });

    let outputText = "";
    let outputObj = undefined;
    p.stdout.on("data", (chunk) => {
      outputText += chunk.toString();
    });

    // polling for output to ensure service is started
    for (let i = 0; i < 20; i++) { 
      console.log(`Waiting for Mockoon service to start... Attempt ${i + 1}`, outputText === '' ? 'No output yet' : '\n' + outputText);
    
      if (i === 20) {
        throw new Error(`Failed to start Mockoon service: Process not found, possibly failed to start`);
      }

      if (outputText && outputText !== '') {
        try { 
          outputObj = JSON.parse(outputText.match(/{.+(?=\n)/g)?.[0])
        } catch(e) {
          console.warn(`Failed to parse output from Mockoon service:`, e.message);
        }; 

        if (outputObj?.constructor === Object && Object.keys(outputObj).length > 0) {
          if (outputObj.level === "error") { 
            throw new Error(`${outputObj.message}`);
          }
        }

        break; // Exit loop if we have valid output
      }

      await sleep(200); // Wait for the process to start
    }

    // If we reach here, the command succeeded
    registeredProfiles.set(id, { pid: p.pid, port, running: true });
    usedPorts.add(port);

    // Generate OpenAPI schema in background
    const schemaPath = path.join(PROFILES_DIR, `${id}-schema.json`);
    try {
      console.log(`Generating OpenAPI schema for profile '${id}'`);
      const schemaResult = await $`npx mockoon-cli export -i ${profilePath} -o ${schemaPath}`.nothrow();
      if (schemaResult.exitCode === 0) {
        console.log(`OpenAPI schema generated successfully for '${id}' at ${schemaPath}`);
      } else {
        console.warn(`Failed to generate schema for ${id}:`, schemaResult.stderr);
      }
    } catch (schemaError) {
      console.warn(`Error generating schema for ${id}:`, schemaError.message);
    }

    // Register proxy middleware
    const proxyPath = `/mockoonshare/${id}`;

    // removeMiddleware(app, proxyPath);
    app.use(
      proxyPath,
      createProxyMiddleware({
        target: `http://localhost:${port}`,
        pathRewrite: (path, req) => path.replace(`/mockoonshare/${id}`, ""),
        changeOrigin: true,
        logLevel: "warn",
      })
    );

    console.log(`Mockoon service for '${id}' started on port ${port}`);
    res.json({
      message: `Mockoon service for '${id}' started on port ${port}`,
      profilePath: profilePath,
      port: port,
      apiRoot: `/mockoonshare/${id}`,
      content: fs.readFileSync(profilePath, "utf-8"),
    });
  } catch (err) {
    console.error(`Failed to start mockoon for ${id}:`, err.message);
    usedPorts.delete(port);
    return res
      .status(500)
      .json({ error: `Failed to start mockoon for '${id}': ${err.message}` });
  }
});

app.put("/api/profiles/:id/stop", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!registeredProfiles.has(id)) {
      return res.status(404).json({ error: `Profile '${id}' is not running` });
    }

    const profileInfo = registeredProfiles.get(id);
    
    if (!profileInfo.running) {
      return res.status(200).json({
        message: `Profile '${id}' is already stopped`,
        port: profileInfo.port
      });
    }

    const { pid, port } = profileInfo;
    
    // Kill the process directly
    try {
      process.kill(pid, 'SIGTERM');
      console.log(`Mockoon service for '${id}' stopped via process kill (PID: ${pid})`);
    } catch (killError) {
      console.warn(`Failed to kill process ${pid}:`, killError.message);
      return res.status(500).json({ 
        error: `Failed to stop Mockoon service for '${id}'`,
        details: killError.message 
      });
    }

    // Mark as stopped but keep the registry entry
    registeredProfiles.set(id, { pid, port, running: false });
    // Don't remove from usedPorts to reserve the port

    res.json({
      message: `Mockoon service for '${id}' stopped successfully`,
      port: port
    });

  } catch (err) {
    console.error(`Error stopping profile ${req.params?.id || 'unknown'}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/profiles/:id", (req, res) => {
  try {
    const id = req.params.id;
    const profilePath = path.join(PROFILES_DIR, `${id}.json`);
    
    // Validate JSON content
    let jsonContent;
    try {
      jsonContent = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      JSON.parse(jsonContent); // Validate JSON
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON content' });
    }

    // Check if file already exists
    const fileExists = fs.existsSync(profilePath);
    
    // Write the file
    fs.writeFileSync(profilePath, jsonContent, 'utf-8');
    
    const message = fileExists 
      ? `Profile '${id}.json' updated successfully`
      : `Profile '${id}.json' created successfully`;
    
    console.log(message);
    
    res.json({
      message,
      id,
      path: profilePath,
      overwritten: fileExists
    });
    
  } catch (err) {
    console.error('Error uploading profile:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/schema/export/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const profilePath = path.join(PROFILES_DIR, `${id}.json`);
    const schemaPath = path.join(PROFILES_DIR, `${id}-schema.json`);

    if (!fs.existsSync(profilePath)) {
      return res.status(404).json({ error: `Profile '${id}.json' not found` });
    }

    if (!fs.existsSync(schemaPath)) {
      return res.status(404).json({ 
        error: `OpenAPI schema not found for '${id}'. Please start the profile first to generate the schema.` 
      });
    }

    console.log(`Returning existing OpenAPI schema for profile '${id}'`);
    
    // Read the existing schema file
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    
    res.json({
      message: `OpenAPI schema retrieved successfully for '${id}'`,
      schemaPath: schemaPath,
      content: schemaContent
    });

  } catch (err) {
    console.error(`Error retrieving schema for ${req.params?.id || 'unknown'}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Load SSL cert and key
const sslOptions = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
};

// Create HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://0.0.0.0:${PORT}`);
});
fileApp.listen(FILEPORT, () => {
  console.log(`File server running at http://0.0.0.0:${FILEPORT}`);
});
