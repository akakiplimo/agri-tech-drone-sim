import MqttClient from "./mqtt-client";
import { DroneData, MqttMessage, PlantData, SimulationData } from "./types";

class Simulation {
    private drones: DroneData[] = [];
    private plants: PlantData[] = [];
    private mqttClient: MqttClient;

    constructor(numDrones: number, numPlants: number, mqttBrokerUrl: string) {
        this.initializeDrones(numDrones);
        this.initializePlants(numPlants);
        this.mqttClient = new MqttClient(mqttBrokerUrl)
    }

    private initializeDrones(numDrones: number): void {
        for (let i = 0; i < numDrones; i++) {
            this.drones.push({
                id: i + 1,
                position: {
                    latitude: this.randomCoordinate(),
                    longitude: this.randomCoordinate(),
                },
                battery: 100,
                status: "idle"
            });
        }
    }

    private initializePlants(numPlants: number): void {
        for (let i = 0; i < numPlants; i++) {
            this.plants.push({
                id: i + 1,
                position: {
                    latitude: this.randomCoordinate(),
                    longitude: this.randomCoordinate(),
                },
                health: Math.random() * 100,
                moisture: Math.random() * 100,
                temperature: 20 + Math.random() * 15,
            });
        }
    }

    private randomCoordinate(): number {
        return Math.random() * 180 - 90;
    }

    /**
     * updateSimulation
     */
    public async updateSimulation(): Promise<void> {
        this.updateDrones();
        this.updatePlants();
        await this.sendDroneData();
    }

    private async sendDroneData(): Promise <void> {
        for (const drone of this.drones) {
            const message: MqttMessage = {
                droneId: drone.id,
                timestamp: Date.now(),
                data: {
                position: drone.position,
                battery: drone.battery,
                status: drone.status,
                scannedPlants: this.getScannedPlants(drone),
                },
            };

            await this.mqttClient.publish('drones/data', message);
        }
    }

    public async updateDronePositions(): Promise<void> {
        this.drones.forEach(drone => {
          drone.position.latitude += (Math.random() - 0.5) * 0.01;
          drone.position.longitude += (Math.random() - 0.5) * 0.01;
          drone.battery -= Math.random() * 2;
          if (drone.battery < 0) drone.battery = 0;
          drone.status = drone.battery < 20 ? 'returning' : (Math.random() > 0.7 ? 'scanning' : 'idle');
        });
        await this.sendDroneData();
      }
    
      public async updatePlantData(): Promise<void> {
        this.plants.forEach(plant => {
          plant.health += (Math.random() - 0.5) * 5;
          plant.moisture += (Math.random() - 0.5) * 5;
          plant.temperature += (Math.random() - 0.5);
    
          plant.health = Math.max(0, Math.min(100, plant.health));
          plant.moisture = Math.max(0, Math.min(100, plant.moisture));
          plant.temperature = Math.max(0, Math.min(50, plant.temperature));
        });
      }

    private getScannedPlants(drone: DroneData): PlantData[] {
        // Simulate scanning plants within a certain radius
        const radius = 0.1; // Degrees
        return this.plants.filter(plant => 
        Math.abs(plant.position.latitude - drone.position.latitude) < radius &&
        Math.abs(plant.position.longitude - drone.position.longitude) < radius
        );
    }

    public async close(): Promise <void> {
        await this.mqttClient.close();
    }        

    private updateDrones() {
        this.drones.forEach(drone => {
            drone.battery -= Math.random() * 5;
            if (drone.battery < 0) drone.battery = 0

            drone.status = drone.battery < 20 ? 'returning' : (Math.random() > 0.7 ? 'scanning' : 'idle');

            drone.position.latitude += (Math.random() - 0.5) * 0.1;
            drone.position.longitude += (Math.random() - 0.5) * 0.1;
        })
    }

    private updatePlants() {
        this.plants.forEach(plant => {
            plant.health += (Math.random() - 0.5) * 5;
            plant.moisture += (Math.random() - 0.5) * 5;
            plant.temperature += (Math.random() - 0.5);
      
            plant.health = Math.max(0, Math.min(100, plant.health));
            plant.moisture = Math.max(0, Math.min(100, plant.moisture));
            plant.temperature = Math.max(0, Math.min(50, plant.temperature));
          });
    }

    /**
     * getSimulationData
     */
    public getSimulationData(): SimulationData {
        return {
            drones: this.drones,
            plants: this.plants
        };
    }

}

export default Simulation;