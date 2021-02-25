import {IMQPublishClient, IMQSubscribeClient} from "./index";
import redis from 'redis';
import Logger from "../../middleware/logger";
import {RedisConfig} from "../../config/config";

export class ReddisMQPublishClient implements IMQPublishClient {
    private redisClient: redis.RedisClient;
    private channel : string;

    constructor(config: RedisConfig) {
        if(config.password)
            this.redisClient = redis.createClient({
                port:config.port, host:config.host, password : config.password
            });
        else
            this.redisClient = redis.createClient({
                port: config.port, host:config.host
            });
        this.channel = config.channel;
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