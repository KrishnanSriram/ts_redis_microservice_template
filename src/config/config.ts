import dotenv from 'dotenv';
import path from 'path';
const env_path: string = path.resolve(__dirname, `.env`);

export interface RedisBaseConfig {
  subscriber: RedisConfig;
  publisher: RedisConfig;
}
export interface RedisConfig{
  port: number;
  host: string;
  password?:string;
  channel: string;
}
export interface ServerConfig{
  port: number;
}
export interface IConfig {
  server: ServerConfig;
  redis: RedisBaseConfig;
}

dotenv.config({
  path: env_path,
});

export class Configuration {
  private Server: ServerConfig = {
    port: parseInt(process.env.PORT!)
  };

  private RedisSubscription: RedisConfig = {
    port: parseInt(process.env.SUBSCRIBER_PORT!),
    host: process.env.SUBSCRIBER_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || '',
    channel: process.env.SUBSCRIBE_COLLECTION || 'default'
  }
  private RedisPublisher: RedisConfig = {
    port: parseInt(process.env.PUBLISHER_PORT!),
    host: process.env.PUBLISHER_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || '',
    channel: process.env.PUBLISH_COLLECTION || 'default'
  }

  private static instance: Configuration;
  public static getInstance(): Configuration {
    if(!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }

  public LoadConfig(): IConfig {
    const config : IConfig = {
      server: this.Server,
      redis: {
        subscriber: this.RedisSubscription,
        publisher: this.RedisPublisher
      }
    };
    return config;
  }
}
