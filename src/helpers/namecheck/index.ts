import {INameCheckVerficationResult} from "../../command/namechecker";

export interface INameChecker{
    checkNameInText(name: string, text: string): INameCheckVerficationResult;
}