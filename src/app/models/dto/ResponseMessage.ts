export class ResponseMessage{

  statusCode: number;
  timestamp: Date;
  message: string;
  description: string;

  constructor(statusCode: number, timestamp: Date, message: string, description: string) {
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.message = message;
    this.description = description;
  }
}
