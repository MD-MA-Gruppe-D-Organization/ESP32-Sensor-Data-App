export class Measurement {
    time: string;
    data: any;
    host: string;
    topic: string;

  constructor(time: string, data: any, host: string, topic: string) {
    this.time = time;
    this.data = data;
    this.host = host;
    this.topic = topic;
  }
}
