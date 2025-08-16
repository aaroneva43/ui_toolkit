# Mockoon Profiles WebUI

A React.js implementation of the Mockoon Profiles sharing platform. This provides a modern, component-based frontend for managing Mockoon API mock profiles.

## Features

- **Profile Management**: View, start, and stop Mockoon profiles
- **Copy Commands**: One-click copy of CLI commands for local setup
- **Whistle Rules**: Generate and copy Whistle proxy rules for routing
- **Endpoint Visualization**: View available endpoints when profiles are running
- **Responsive Design**: Modern React components with clean UI

## Components

- `App.js`: Main application component with profile loading logic
- `ProfileTable.js`: Table container for displaying profiles
- `ProfileRow.js`: Individual profile row with actions
- `ActionButton.js`: Reusable action button with loading states
- `EndpointsList.js`: Display available endpoints for running profiles

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the webui directory:
   ```bash
   cd webui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at http://localhost:3000 and proxy API requests to the backend server at https://localhost:8200.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## API Integration

The React app communicates with the same backend APIs as the original HTML version:

- `GET /api/profiles` - Fetch all profiles
- `PUT /api/profiles/:id/start` - Start a profile
- `PUT /api/profiles/:id/stop1` - Stop a profile

## Features Implemented

✅ Profile listing with status indicators
✅ Start/Stop profile functionality  
✅ Copy CLI commands to clipboard
✅ Generate and copy Whistle rules
✅ Display endpoints for running profiles
✅ Loading states and error handling
✅ Responsive design

## Technology Stack

- **React 18**: Modern React with hooks
- **CSS3**: Styled to match original design
- **Fetch API**: For backend communication
- **Clipboard API**: For copy functionality

## Development Notes

The proxy configuration in `package.json` routes API calls to the HTTPS backend server. In production, you would typically serve the built React app from the same server or configure proper CORS headers.
