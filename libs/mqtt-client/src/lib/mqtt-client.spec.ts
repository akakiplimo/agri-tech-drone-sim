import { mqttClient } from './mqtt-client';

describe('mqttClient', () => {
  it('should work', () => {
    expect(mqttClient()).toEqual('mqtt-client');
  });
});
