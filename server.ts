import express from 'express';
import MqttClient from './mqtt-client';
import { SimulationData, MqttMessage } from './types';

const app = express();
const port = 3000;
const mqttBrokerUrl = 'mqtt://localhost:1883'; // Replace with your MQTT broker URL

const mqttClient = new MqttClient(mqttBrokerUrl);

let latestSimulationData: SimulationData = { drones: [], plants: [] };

async function startServer() {
    await mqttClient.subscribe('drones/data', (message: MqttMessage) => {
        // Update the simulation data when receiving MQTT messages
        const droneIndex = latestSimulationData.drones.findIndex(d => d.id === message.droneId);

        if (droneIndex !== -1) {
            latestSimulationData.drones[droneIndex] = {
                ...latestSimulationData.drones[droneIndex],
                ...message.data,
            };
        }

        // Update plant data
        message.data.scannedPlants.forEach(scannedPlant => {
            const plantIndex = latestSimulationData.plants.findIndex(plant => plant.id === scannedPlant.id);
            if (plantIndex !== -1) {
                latestSimulationData.plants[plantIndex] = scannedPlant
            }
        });
    });

    app.get('/api/simulation-data', (req, res) => {
        res.json(latestSimulationData);
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();

process.on('SIGINT', async () => {
    await mqttClient.close();
    process.exit();
});