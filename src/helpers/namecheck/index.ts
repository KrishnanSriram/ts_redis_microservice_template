import {INameCheckVerficationResult} from "../../command/namechecker";

export interface INameChecker{
    checkNameInText(name: string, text: string): INameCheckVerficationResult;
}

export abstract class NameChecker implements INameChecker{
    abstract checkNameInText(name: string, text: string): INameCheckVerficationResult;

    protected removeCommaFromText(text: string) {
        return text.replace(',', ' ');
    }

    protected numberOfWords(text: string){
        return text.split(' ').length;
    }
}