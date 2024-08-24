# Agri-Tech Drone Simulation Project

## Overview

This project simulates an agri-tech drone system for monitoring plant health. It uses a microservices architecture implemented in a Nx monorepo, featuring drone simulation, real-time data processing, and a web client for visualization.

## Features

- Drone simulation with realistic movement and battery depletion
- Plant health monitoring
- Real-time data transmission using MQTT
- RESTful API for data retrieval
- Web client for data visualization

## Tech Stack

- Nx: Monorepo management
- TypeScript: Primary language
- Node.js: Runtime environment
- Express: API server
- React: Web client
- MQTT: Message broker for real-time communication

## Project Structure

<pre> ```plaintext 
agri-tech-drone-project/
├── apps/
│   ├── api/              # Express API server
│   ├── simulation/       # Drone simulation service
│   └── web-client/       # React web application
├── libs/
│   ├── shared-types/     # Shared TypeScript interfaces
│   ├── mqtt-client/      # MQTT client library
│   └── data-processing/  # Data processing utilities
├── tools/
├── nx.json
├── package.json
└── tsconfig.base.json
``` </pre>

## Prerequisites

- Node.js (v14+)
- npm (v6+)
- MQTT broker (e.g., Mosquitto)

## Setup

1. Clone the repository:
git clone https://github.com/akakiplimo/agri-tech-drone-project.git
cd agri-tech-drone-project

2. Install dependencies:
npm install

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
MQTT_BROKER_URL=mqtt://localhost:1883
API_PORT=3333

## Running the Project

1. Start the MQTT broker (e.g., Mosquitto)

2. Run the API server:
nx serve api

3. Run the simulation service:
nx serve simulation

4. Run the web client:
nx serve web-client

5. Access the web client at `http://localhost:4200`

## Development

- To generate a new library:
nx g @nrwl/node:library my-new-lib

- To generate a new application:
nx g @nrwl/node:application my-new-app

- To run tests:
nx test

- To run linting:
nx lint

## Deployment

For deployment instructions, please refer to the `DEPLOYMENT.md` file.

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Acknowledgments

- Nx team for the excellent monorepo tools
- MQTT.js contributors for the robust MQTT client library
- All contributors and maintainers of this project