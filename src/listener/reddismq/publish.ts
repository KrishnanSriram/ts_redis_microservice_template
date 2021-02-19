import {IMQPublishClient, IMQSubscribeClient} from "./index";
import redis from 'redis';

export class ReddisMQPublishClient implements IMQPublishClient {
    private redisClient: redis.RedisClient;
    private channel : string;

    constructor(port: number, host: string, password: string | null, channel: string) {
        this.redisClient = redis.createClient({
            port, host, password : password ?? ''
        });
        this.channel = channel;
    }

    publish(message: string) {
        this.redisClient.publish(this.channel, message, (err, response) => {
            if(err === null) {
                console.log('POSTED successfully', response);
            } else {
                console.log('ERROR: Something went wrong. Cannot publish to PERSIST channel');
            }
        })
    }

}