import express from 'express';
import cors from 'cors';
import { MqttClient } from '@agri-tech-drone-project/mqtt-client';
import { processIncomingData } from '@agri-tech-drone-project/data-processing';
import { DroneData, PlantData, MqttMessage } from '@agri-tech-drone-project/shared-types';

const app = express();
const port = process.env.PORT || 3333;
const mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

app.use(cors());

const mqttClient = new MqttClient(mqttBrokerUrl);

let simulationData: { drones: DroneData[], plants: PlantData[] } = { drones: [], plants: [] };

async function startServer() {
  let isReady = false;

  await mqttClient.subscribe('drones/data', (message: MqttMessage) => {
    console.log(`Received message for drone ${message.droneId} with ${message.data.scannedPlants.length} scanned plants`);
    simulationData = processIncomingData(message, simulationData);
    console.log(`Updated simulation data. Drones: ${simulationData.drones.length}, Plants: ${simulationData.plants.length}`);
    if (!isReady && simulationData.drones.length > 0) {
      isReady = true;
      console.log('API is ready to serve data');
    }
  });

  app.get('/api/simulation-data', (req, res) => {
    console.log(`Serving simulation data. Drones: ${simulationData.drones.length}, Plants: ${simulationData.plants.length}`);
    if (isReady) {
      res.json(simulationData);
    } else {
      res.status(503).json({ message: 'Data not yet available. Please try again later.' });
    }
  });

  app.listen(port, () => {
    console.log(`API is running on port ${port}`);
  });
}

startServer().then(() => console.log('successful'));
