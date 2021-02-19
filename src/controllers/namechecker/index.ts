import {IMQController, ISubscribeMessageHandler} from "../basecontroller";
import {INameCheckVerficationResult, IScorecardInputCommand, IScorecardOutputCommand} from "../../command/namechecker";
import {IMQPublishClient, IMQSubscribeClient} from "../../listener/reddismq";
import {IMessageInputCommand} from "../../command";
import {INameChecker} from "../../helpers/namecheck";
import {FullNameChecker} from "../../helpers/namecheck/fullname";
import {PartialNameChecker} from "../../helpers/namecheck/partialname";

export class ScorecardNameCheckerMQController implements IMQController, ISubscribeMessageHandler{
    publisher: IMQPublishClient | null = null;
    subscriber: IMQSubscribeClient | null = null;
    nameVerifiers: INameChecker[];

    constructor() {
        this.nameVerifiers = [
            new FullNameChecker(),
            new PartialNameChecker()
        ]
    }
    //TODO: should this be async?
    messageHandler(command: IScorecardInputCommand) {
        const result = this.checkAndExtractNameFromText(command.studentname, command.ocrtext);
        if(result) {
            this.publish(this.toScorecardOutputCommand(command, result));
        }
    }

    private toScorecardOutputCommand(inputCommand: IScorecardInputCommand, result: INameCheckVerficationResult) : IScorecardOutputCommand {
        return {
            policynumber: inputCommand.policynumber,
            filename: inputCommand.filename,
            studentname: inputCommand.studentname,
            isvalid: result.status,
            extractedName: result.extractedName
        }
    }
    // IMQController implementation
    listen() {
        if(this.subscriber) {
            this.subscriber.delegate = this;
        }
    }

    private checkAndExtractNameFromText(name: string, text: string) : INameCheckVerficationResult {
        this.nameVerifiers.forEach((verifier) => {
            const result : INameCheckVerficationResult = verifier.checkNameInText(name, text);
            if(result.status) {
                return result;
            }
        })
        return { status: false, extractedName: null}
    }

    publish(message: IScorecardOutputCommand): void {
        this.publisher?.publish(message.toString());
    }
}