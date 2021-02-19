import {ISubscribeMessageHandler} from "../../controllers/basecontroller";

export interface IMQSubscribeClient {
  subscribe() : void;
  delegate: ISubscribeMessageHandler | null;
}

export interface IMQPublishClient {
  publish(message: string) : void;
}

