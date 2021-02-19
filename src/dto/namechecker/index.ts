import {IScorecardOutputCommand} from "../../command/namechecker";
import {IMQPublishClient} from "../../listener/reddismq";

export interface INameCheckPublishDTO {

}

export class NameCheckPublishDTO implements INameCheckPublishDTO {
    private mqClient: IMQPublishClient;

    constructor(mqClient: IMQPublishClient) {
        this.mqClient = mqClient;
    }
    publish(results: IScorecardOutputCommand) {
        const stringResults = results.toString();
        this.mqClient.publish(stringResults);
    }
}