import express from "express"
import Simulation from "./simulation";
import MqttClient from "./mqtt-client";
import { MqttMessage, SimulationData } from "./types";

const app = express();
const port = 3000;
const mqttBrokerUrl = 'mqtt://localhost:1883'; // Replace with your MQTT broker URL

const simulation = new Simulation(20, 100, mqttBrokerUrl);
const mqttClient = new MqttClient(mqttBrokerUrl);

let latestSimulationData: SimulationData = { drones: [], plants: [] };

async function startSimulation() {
    await mqttClient.subscribe('drones/data', (message: MqttMessage) => {
        // Update the simulation data when receiving MQTT messages
        const droneIndex = latestSimulationData.drones.findIndex(d => d.id === message.droneId);

        if (droneIndex !== -1) {
            latestSimulationData.drones[droneIndex] = {
                ...latestSimulationData.drones[droneIndex],
                ...message.data,
            };
        }

        // Updddate plant data
        message.data.scannedPlants.forEach(scannedPlant => {
            const plantIndex = latestSimulationData.plants.findIndex(p => p.id === scannedPlant.id);
            if (plantIndex !== -1) {
                latestSimulationData.plants[plantIndex] = scannedPlant;
            }
        });
    });
}

setInterval(async() => {
    await simulation.updateSimulation();
}, 5000);

startSimulation();

app.get('/api/simulation-data', (req, res) => {
    res.json(latestSimulationData);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    await simulation.close();
    await mqttClient.close();
    process.exit();
});