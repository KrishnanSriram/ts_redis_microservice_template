import dotenv from 'dotenv';
import path from 'path';
const env_path: string = path.resolve(__dirname, `.env`);

dotenv.config({
  path: env_path,
});

const SERVER = {
  port: process.env.PORT
};

const REDIS_SUBSCRIPTION = {
  port: process.env.SUBSCRIBER_PORT,
  host: process.env.SUBSCRIBER_HOST,
  password: process.env.REDIS_PASSWORD || '',
  channel: process.env.SUBSCRIBE_COLLECTION
}
const REDIS_PUBLISHER = {
  port: process.env.PUBLISHER_PORT,
  host: process.env.PUBLISHER_HOST,
  password: process.env.REDIS_PASSWORD || '',
  channel: process.env.PUBLISH_COLLECTION
}

const config = {
  server: SERVER,
  reddis: {
    subscriber: REDIS_SUBSCRIPTION,
    publisher: REDIS_PUBLISHER
  }
};

export default config;
