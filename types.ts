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