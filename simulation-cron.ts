import cron from 'node-cron';
import Simulation from './simulation';
import MqttClient from './mqtt-client';

const mqttBrokerUrl = 'mqtt://localhost:1883'; // Replace with your MQTT broker URL

const simulation = new Simulation(20, 100, mqttBrokerUrl);

// Run the simulation every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log('Running simulation update...');
    await simulation.updateSimulation();
  });
  
  // Optionally, you can add more granular cron jobs for different aspects of the simulation
  // For example, updating drone positions more frequently
  cron.schedule('*/1 * * * *', async () => {
    console.log('Updating drone positions...');
    await simulation.updateDronePositions();
  });
  
  // And updating plant data less frequently
  cron.schedule('0 */2 * * *', async () => {
    console.log('Updating plant data...');
    await simulation.updatePlantData();
  });
  
  process.on('SIGINT', async () => {
    await simulation.close();
    process.exit();
  });