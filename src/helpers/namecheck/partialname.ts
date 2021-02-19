import {INameChecker} from "./index";
import {INameCheckVerficationResult} from "../../command/namechecker";

export class PartialNameChecker implements INameChecker{
    checkNameInText(name:string, text:string): INameCheckVerficationResult {
        return {status: false, extractedName: null};
    }
}