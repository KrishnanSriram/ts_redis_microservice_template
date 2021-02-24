import {IMQPublishClient, IMQSubscribeClient} from "../../services/reddismq";
import {IMessageInputCommand, IMessageOutputCommand} from "../../command";

export interface IMQController {
    publisher: IMQPublishClient | null;
    subscriber: IMQSubscribeClient | null;
    listen() : void;
    publish(message: IMessageOutputCommand) : void;
}


export interface ISubscribeMessageHandler {
    messageHandler(command: IMessageInputCommand): void;
}