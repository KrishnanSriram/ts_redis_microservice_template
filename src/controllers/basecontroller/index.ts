import {IMQPublishClient, IMQSubscribeClient} from "../../services/reddismq";
import {IMessageInputCommand, IMessageOutputCommand} from "../../command";
import {IApp} from "../../app";

export interface IController {
    readonly app: IApp;
}

export interface IMQController extends IController {
    publisher: IMQPublishClient | null;
    subscriber: IMQSubscribeClient | null;
    listen() : void;
    publish(message: IMessageOutputCommand) : void;
}


export interface ISubscribeMessageHandler {
    messageHandler(command: IMessageInputCommand): void;
}