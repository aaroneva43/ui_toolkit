(function main() {
  // if (!window.fetchOverride) {
  //   window.fetchOverride = window.fetch = new Proxy(window.fetch, {
  //     apply: function (target, that, args) {
  //       let temp = target.apply(that, args);
  //       temp
  //         .then((res) => {
  //           // After completion of request
  //           console.log("that: ", that, "args: ", args, "res:", res);
  //           return res;
  //         })
  //         .then((r) => r.json())
  //         .then((r) => console.log(r));
  //       return temp;
  //     },
  //   });
  // }

  if (!window.updatingSession) {
    window.updatingSession = setInterval(() => {
      updateSession();
    }, 600000);
  }

  if (!window.tryingStopCharging) {
    window.tryingStopCharging = setInterval(() => {
      stopCharging();
    }, 240000);
  }

  updateSession();
})();

const events = []; // store all charging events
window.EVENTS = events;

const zombie = null;
window.ZOMBIE = zombie;

const STOP_BY_MS = 3200000; // 53.3333 minutes

function doFetch(url, body = {}, method = "POST") {
  return fetch(url, {
    headers: {
      accept: "*/*",
      "accept-language": "en-US",
      "content-type": "application/json",
    },
    referrer: "https://driver.chargepoint.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: typeof body === "string" ? body : JSON.stringify(body),
    method: method,
    mode: "cors",
    credentials: "include",
  });
}

function stopCharging(params = {}) {
  console.log("trying to stop charging at: ", new Date());
  const stopStates = ["in_use", "fully_charged"];
  doFetch(
    "https://mc.chargepoint.com/map-prod/v2",
    '{"user_status":{"mfhs":{}}}'
  )
    .then((r) => r.json())
    .then((r) => {
      var { sessionId, state } = r?.user_status?.charging || {};

      if (sessionId === undefined) {
        console.warn("no session found, waiting for plugin...");

        clearTimeout(zombie?.timeout);
        clearInterval(zombie?.interval);
        events.length = 0;

        return;
      }

      doFetch(
        "https://mc.chargepoint.com/map-prod/v2",
        `{"charging_status":{"mfhs":{},"session_id":${sessionId}}}`
      )
        .then((r) => r.json())
        .then((r) => {
          var {
            charging_time,
            session_time,
            device_id,
            port_level,
            power_kw_display,
          } = r?.charging_status || {};

          const event = {
            time: new Date().getTime(),
            charging_time,
            session_time,
            device_id,
            session_id: sessionId,
            port_level,
            power: power_kw_display + " kw",
            state,
          };

          events.push(event);

          // check if this is the 14th trial for the same session_id (5min*14=70min)
          // garrentee to stop charging in case of zombie session
          const is14th =
            events.length >= 13 &&
            events
              .slice(-13)
              .every(
                (e) =>
                  e.session_id === sessionId && stopStates.includes(e.state)
              );

          var shouldStop =
            is14th ||
            ((session_time > STOP_BY_MS || charging_time >= STOP_BY_MS) &&
              stopStates.includes(state));

          if (shouldStop) {
            doFetch(
              "https://account.chargepoint.com/account/v1/driver/station/stopSession",
              `{"deviceId":${device_id},"portNumber":${port_level},"sessionId":${sessionId}}`
            );
          }

          console.table({
            ...event,
            charging_time: `${Math.floor(event.charging_time / 1000 / 60)}m${
              (event.charging_time / 1000) % 60
            }s`,
            session_time: ` ${Math.floor(event.session_time / 1000 / 60)}m${
              (event.session_time / 1000) % 60
            }s`,
            should_stop: shouldStop + " " + (is14th ? "zombie" : ""),
          });
        });
    });
}

function stopChargingGUI(params) {
  try {
    var closeBtn = document.querySelector('button[data-testid="modal-close"]');

    if (closeBtn) {
      closeBtn.click();
    }

    setTimeout(() => {
      document
        .querySelector('div[data-qa-id="driver_charging_status_bar"]')
        ?.click();
    }, 500);

    setTimeout(() => {
      var chargingEl = document.querySelector(
        'div[data-id="modal-body"] div[data-qa-id^="charging_status_"]'
      );
      var time =
        parseInt(chargingEl?.nextSibling.textContent.replace(/m\s.*/, "")) || 0;
      var status = chargingEl?.textContent;

      var stopBtn = Array.from(
        document.querySelectorAll('button[data-qa-id="stop_session_btn"]')
      ).at(0);

      if (time >= 55 && status === "Charging") {
        stopBtn?.click();
        // confirm stop
        setTimeout(() => {
          Array.from(document.querySelectorAll('button[data-qa-id="stop_btn"]'))
            .at(0)
            ?.click();
        }, 1000);
      }

      console.log(
        new Date(),
        "time: ",
        time,
        "status: ",
        status,
        "charge stopping: ",
        time >= 55 && status === "Charging"
      );
    }, 2000);
  } catch (error) {
    console.warn("stopping session failed: ", error);
  }
}

// ajax login
function updateSession() {
  fetch("https://na.chargepoint.com/index.php/nghelper/getSession", {
    headers: {
      accept: "*/*",
      "accept-language":
        "en-US,en;q=0.9,zh-US;q=0.8,zh;q=0.7,zh-CN;q=0.6,pt;q=0.5,zh-TW;q=0.4",
      "content-type": "application/json",
    },
    referrer: "https://driver.chargepoint.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((r) => r.json())
    .then((r) => {
      if (!r.user) {
        fetch("https://sso.chargepoint.com/api/v1/user/login", {
          headers: {
            accept: "*/*",
            "accept-language": "en-US",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            "sec-ch-device-memory": "8",
            "sec-ch-ua":
              '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            "sec-ch-ua-arch": '"arm"',
            "sec-ch-ua-full-version-list":
              '"Chromium";v="122.0.6261.94", "Not(A:Brand";v="24.0.0.0", "Google Chrome";v="122.0.6261.94"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": '""',
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-transaction-id": "3477m7g0r",
          },
          referrer:
            "https://sso.chargepoint.com/?redirect=https%3A%2F%2Fdriver.chargepoint.com%2FmapCenter%2F37.488739553662704%2F-118.99898983846884%2F6%3Fview%3Dlist&locale=en-US",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: '{"username":"xiepeng.cn@gmail.com","password":"!QAZ2wsx","timezone_offset":420,"timezone":"America/Los_Angeles","redirect":"https://driver.chargepoint.com/mapCenter?view=list"}',
          method: "POST",
          mode: "cors",
          credentials: "include",
        });
        console.log("session updated at: ", new Date());
      }
    });
}
