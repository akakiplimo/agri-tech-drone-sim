import { MqttClient } from '@agri-tech-drone-project/mqtt-client';
import { DroneData, PlantData, MqttMessage } from '@agri-tech-drone-project/shared-types';
import * as cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';

const mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const mqttClient = new MqttClient(mqttBrokerUrl);

const drones: DroneData[] = Array.from({ length: 5 }, (_, i) => ({
  id: uuidv4(),
  position: { latitude: Math.random() * 180 - 90, longitude: Math.random() * 360 - 180 },
  battery: 100,
  status: 'idle'
}));

const plants: PlantData[] = [];

function populatePlants() {
  for (let i = 0; i < 20; i++) {
    plants.push({
      id: uuidv4(),
      position: { latitude: Math.random() * 180 - 90, longitude: Math.random() * 360 - 180 },
      health: Math.random() * 100,
      moisture: Math.random() * 100,
      temperature: 20 + Math.random() * 15
    });
  }
}

async function sendInitialPlantData() {
  const message: MqttMessage = {
    droneId: '0', // Use a special ID for initial data
    timestamp: Date.now(),
    data: {
      position: { latitude: 0, longitude: 0 },
      battery: 100,
      status: 'idle',
      scannedPlants: plants,
    },
  };
  await mqttClient.publish('drones/data', message);
  console.log(`Published initial plant data: ${plants.length} plants`);
}

// Call this function when your simulation starts
populatePlants();
sendInitialPlantData();

function simulateDroneMovement() {
  drones.forEach(drone => {
    if (drone.status !== 'charging') {
      drone.position.latitude += (Math.random() - 0.5) * 0.01;
      drone.position.longitude += (Math.random() - 0.5) * 0.01;
      drone.battery -= Math.random() * 5;
      if (drone.battery < 0) drone.battery = 0;

      // Logic to determine drone status
      if (drone.battery < 15) {
        drone.status = 'returning';
        drone.battery -= Math.random() * 5;
      } else {
        drone.status = Math.random() > 0.7 ? 'scanning' : 'idle';
      }

      if (drone.battery < 10) {
        drone.status = 'charging';
      }
    } else {
      drone.battery += 5; // Charging logic
      if (drone.battery >= 100) {
        drone.battery = 100;
        drone.status = 'idle';
      }
    }
  });
}

function getScannedPlants(drone: DroneData): PlantData[] {
  const radius = 0.1;
  if (drone.status === 'scanning') {
    return plants.filter(plant =>
      Math.abs(plant.position.latitude - drone.position.latitude) < radius &&
      Math.abs(plant.position.longitude - drone.position.longitude) < radius
    );
  }
  return [];
}

async function sendDroneData() {
  for (const drone of drones) {
    const scannedPlants = getScannedPlants(drone);
    const message: MqttMessage = {
      droneId: drone.id,
      timestamp: Date.now(),
      data: {
        position: drone.position,
        battery: drone.battery,
        status: drone.status,
        scannedPlants: scannedPlants,
      },
    };
    await mqttClient.publish('drones/data', message);
    console.log(`Published data for drone ${drone.id} with ${scannedPlants.length} scanned plants`);
  }
}

function startCronJobs() {
  cron.schedule('*/1 * * * *', async () => {
    console.log('Simulating drone movement...');
    simulateDroneMovement();
    await sendDroneData();
  });
}

async function init() {
  await sendDroneData();
  startCronJobs();
}

init();

console.log('Simulation service started');
