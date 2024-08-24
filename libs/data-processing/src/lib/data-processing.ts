import { DroneData, PlantData, MqttMessage } from '@agri-tech-drone-project/shared-types';

export function processIncomingData(
  message: MqttMessage,
  currentData: { drones: DroneData[], plants: PlantData[] }
) {
  const { drones, plants } = currentData;

  // Update drone data
  const droneIndex = drones.findIndex(d => d.id === message.droneId);
  if (droneIndex !== -1) {
    drones[droneIndex] = {
      ...drones[droneIndex],
      ...message.data,
    };
  } else if (message.droneId !== "0") { // Ignore the special case for all plants data
    drones.push({
      id: message.droneId,
      ...message.data,
    });
  }

  // Update plant data
  message.data.scannedPlants.forEach(scannedPlant => {
    const plantIndex = plants.findIndex(p => p.id === scannedPlant.id);
    if (plantIndex !== -1) {
      plants[plantIndex] = {
        ...plants[plantIndex],
        ...scannedPlant,
      };
    } else {
      plants.push(scannedPlant);
    }
  });

  console.log(`Processed data. Drones: ${drones.length}, Plants: ${plants.length}`);
  return { drones, plants };
}
