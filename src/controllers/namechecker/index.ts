import {IMQController, ISubscribeMessageHandler} from "../basecontroller";
import {INameCheckVerficationResult, IScorecardInputCommand, IScorecardOutputCommand} from "../../command/namechecker";
import {IMQPublishClient, IMQSubscribeClient} from "../../listener/reddismq";
import {INameChecker} from "../../services/namecheck";
import {FullNameChecker} from "../../services/namecheck/fullname";
import {PartialNameChecker} from "../../services/namecheck/partialname";
import Logger from "../../middleware/logger";

export class ScorecardNameCheckerMQController implements IMQController, ISubscribeMessageHandler{
    readonly NAMESPACE = "ScorecardNameCheckerMQController";

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
        Logger.info(this.NAMESPACE, 'convert to scorecard output command', result);
        this.publish(this.toScorecardOutputCommand(command, result));
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
            this.subscriber.subscribe();
        }
    }

    private checkAndExtractNameFromText(name: string, text: string) : INameCheckVerficationResult {
        let status_result: INameCheckVerficationResult = { status: false, extractedName: null}
        this.nameVerifiers.some((verifier) => {
            const result : INameCheckVerficationResult = verifier.checkNameInText(name, text);
            Logger.info(this.NAMESPACE, 'Result from processing OCRTEXT', result);
            if(result.status === true) {
                Logger.info(this.NAMESPACE, 'Name check success. No more processing needed', result);
                status_result.status = true;
                status_result.extractedName = result.extractedName;
                return;
            }
            Logger.info(this.NAMESPACE, 'Continue with more verifiers');
        })
        return status_result;
    }

    publish(message: IScorecardOutputCommand): void {
        Logger.info(this.NAMESPACE, 'Message to be published is', message);
        const strContent: string = JSON.stringify(message)
        this.publisher?.publish(strContent);
    }
}