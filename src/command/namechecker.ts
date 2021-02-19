import {IMessageInputCommand, IMessageOutputCommand} from "./index";

export interface IScorecardInputCommand extends IMessageInputCommand{
    studentname: string;
    policynumber: string;
    filename: string;
    ocrtext: string;
}

export interface INameCheckVerficationResult {
    status: boolean,
    extractedName: string | null;
    // toScorecardOutputCommand(): IScorecardOutputCommand
}

export interface IScorecardOutputCommand extends IMessageOutputCommand{
    studentname: string;
    policynumber: string;
    filename: string;
    isvalid: boolean;
    extractedName: string | null;
    startTime?: string;
    endTime?: string;
}