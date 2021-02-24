import {IMQPublishClient, IMQSubscribeClient} from "./index";
import redis from 'redis';
import Logger from "../../middleware/logger";

export class ReddisMQPublishClient implements IMQPublishClient {
    private redisClient: redis.RedisClient;
    private channel : string;

    constructor(port: number, host: string, password: string | null, channel: string) {
        if(password)
            this.redisClient = redis.createClient({
                port, host, password : password
            });
        else
            this.redisClient = redis.createClient({
                port, host
            });
        this.channel = channel;
    }

    publish(message: string) {
        Logger.info('Publish', message);
        this.redisClient.publish(this.channel, message, (err, response) => {
            if(err === null) {
                Logger.info('Publish', `Posted successfully. Response is ${response}`);
            } else {
                Logger.error('Publish','ERROR: Something went wrong. Could not publish to PERSIST channel');
            }
        })
    }

}