import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DroneData, PlantData } from '@agri-tech-drone-project/shared-types';

export function App() {
  const [simulationData, setSimulationData] = useState<{ drones: DroneData[], plants: PlantData[] }>({ drones: [], plants: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios({ url: '/api/simulation-data', baseURL: 'http://localhost:3333/' });
      setSimulationData(result.data);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Agri-Tech Drone Simulation</h1>
      <h2>Drones</h2>
      <ul>
        {
          simulationData.drones ? simulationData.drones.map(drone => (
            <li key={drone.id}>
              Drone {drone.id.substring(0, 4)}: Battery {drone.battery.toFixed(2)}%, Status: {drone.status}
            </li>
          )) : null
        }
      </ul>
      <h2>Plants</h2>
      <ul>
        {
          simulationData.plants ? simulationData.plants.map(plant => (
            <li key={plant.id}>
              Plant {plant.id.substring(0, 4)}: Health {plant.health.toFixed(2)}%, Moisture: {plant.moisture.toFixed(2)}%, Temperature: {plant.temperature.toFixed(2)}°C
            </li>
          )) : null
        }
      </ul>
    </div>
  );
}

export default App;
