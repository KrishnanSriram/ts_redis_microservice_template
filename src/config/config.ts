import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const REDIS_SUBSCRIPTION = {
  port: process.env.PORT,
  host: process.env.REDDIS_HOST,
  password: process.env.REDDIS_PASSWORD,
  channel: process.env.REDDIS_SUBSCRIBE_CHANNEL
}
const REDIS_PUBLISHER = {
  port: process.env.PORT,
  host: process.env.REDDIS_HOST,
  password: process.env.REDDIS_PASSWORD,
  channel: process.env.REDDIS_PUBLISH_CHANNEL
}

const config = {
  server: SERVER,
  reddis: {
    subscriber: REDIS_SUBSCRIPTION,
    publisher: REDIS_PUBLISHER
  }
};

export default config;
