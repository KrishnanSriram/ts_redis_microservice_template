import {IMQSubscribeClient} from "./index";
import redis from 'redis';
import {IMQController, ISubscribeMessageHandler} from "../../controllers/basecontroller";
import Logger from "../../middleware/logger";
import {RedisConfig} from "../../config/config";

export class ReddisMQSubscribeClient implements IMQSubscribeClient {
    private redisClient: redis.RedisClient;
    private channel : string;
    public delegate: ISubscribeMessageHandler | null = null;

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

    subscribe() {
        this.redisClient.subscribe(this.channel);
        Logger.info('Subscribe', `Subscribed and litening to channel ${this.channel}`);
        this.redisClient.on('message', async(channel, message) => {
            Logger.info('Subscribe', message);
            const jsonObject: any = JSON.parse(message);
            if(jsonObject["project"] === "scorecard") {
                this.delegate?.messageHandler(jsonObject);
            }

        });
    }

}