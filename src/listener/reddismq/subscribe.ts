import {IMQSubscribeClient} from "./index";
import redis from 'redis';
import {IMQController, ISubscribeMessageHandler} from "../../controllers/basecontroller";

export class ReddisMQSubscribeClient implements IMQSubscribeClient {
    private redisClient: redis.RedisClient;
    private channel : string;
    public delegate: ISubscribeMessageHandler | null = null;

    constructor(port: number, host: string, password: string | null, channel: string) {
        this.redisClient = redis.createClient({
            port, host, password : password ?? ''
        });
        this.channel = channel;
    }

    subscribe() {
        this.redisClient.subscribe(this.channel);
        this.redisClient.on('message', async(channel, message) => {
            const jsonObject: any = JSON.parse(message);
            if(jsonObject["project"] === "scorecard") {
                this.delegate?.messageHandler(jsonObject);
            }

        });
    }

}