import {IMQSubscribeClient} from "./index";
import redis from 'redis';
import {IMQController, ISubscribeMessageHandler} from "../../controllers/basecontroller";
import Logger from "../../middleware/logger";

export class ReddisMQSubscribeClient implements IMQSubscribeClient {
    private redisClient: redis.RedisClient;
    private channel : string;
    public delegate: ISubscribeMessageHandler | null = null;

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