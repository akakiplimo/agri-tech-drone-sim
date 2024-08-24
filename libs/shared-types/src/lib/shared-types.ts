export interface DroneData {
  id: string;
  position: {
    latitude: number;
    longitude: number;
  };
  battery: number;
  status: 'idle' | 'scanning' | 'returning' | 'charging';
}

export interface PlantData {
  id: string;
  position: {
    latitude: number;
    longitude: number;
  };
  health: number;
  moisture: number;
  temperature: number;
}

export interface MqttMessage {
  droneId: string;
  timestamp: number;
  data: {
    position: {
      latitude: number;
      longitude: number;
    };
    battery: number;
    status: 'idle' | 'scanning' | 'returning' | 'charging';
    scannedPlants: PlantData[];
  };
}
