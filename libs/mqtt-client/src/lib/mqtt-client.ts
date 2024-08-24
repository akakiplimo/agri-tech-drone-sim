import * as asyncMqtt from 'async-mqtt';
import { MqttMessage } from '@agri-tech-drone-project/shared-types';

export class MqttClient {
  private client: asyncMqtt.AsyncMqttClient;

  constructor(brokerUrl: string) {
    this.client = asyncMqtt.connect(brokerUrl);
  }

  async subscribe(topic: string, callback: (message: MqttMessage) => void) {
    await this.client.subscribe(topic);
    this.client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        const parsedMessage: MqttMessage = JSON.parse(message.toString());
        callback(parsedMessage);
      }
    });
  }

  async publish(topic: string, message: MqttMessage) {
    await this.client.publish(topic, JSON.stringify(message));
  }

  async close() {
    await this.client.end();
  }
}