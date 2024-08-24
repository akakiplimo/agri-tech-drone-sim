export interface DroneData {
    id: number;
    position: {
      latitude: number;
      longitude: number;
    };
    battery: number;
    status: 'idle' | 'scanning' | 'returning';
  }
  
  export interface PlantData {
    id: number;
    position: {
      latitude: number;
      longitude: number;
    };
    health: number;
    moisture: number;
    temperature: number;
  }
  
  export interface SimulationData {
    drones: DroneData[];
    plants: PlantData[];
  }

  export interface MqttMessage {
    droneId: number;
    timestamp: number;
    data: {
      position: {
        latitude: number;
        longitude: number;
      };
      battery: number;
      status: 'idle' | 'scanning' | 'returning';
      scannedPlants: PlantData[];
    }
  }