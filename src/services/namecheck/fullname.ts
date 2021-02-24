import {NameChecker} from "./index";
import {INameCheckVerficationResult} from "../../command/namechecker";
import Logger from "../../middleware/logger";

export class FullNameChecker extends NameChecker{
    readonly NAMESPACE = "FullNameChecker";
    checkNameInText(name:string, text:string): INameCheckVerficationResult {
        const lw_name = name.toLowerCase();
        const lw_text = text.toLowerCase();
        Logger.info(this.NAMESPACE, `Check for name ${name} in text`);
        // Don't modify text content and look for matching name
        let result = this.checkNameAsIs(lw_name, lw_text);
        if(result.status === false) {
            result = this.checkNameWithoutPunctuations(lw_name, lw_text);
        }

        return result;
    }

    private checkNameAsIs(name: string, text: string): INameCheckVerficationResult {
        Logger.info(this.NAMESPACE, 'Check for FULL name WITH punctuations');
        // Check to see if the text contains name as is
        if(text.includes(name) === true) {
            Logger.info(this.NAMESPACE,'+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            Logger.info(this.NAMESPACE,'MATCHES checkNameInText:'+name);
            Logger.info(this.NAMESPACE,'+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            return {status: true, extractedName: name};
        }

        Logger.info(this.NAMESPACE, 'Check for FULL name WITH punctuations FAILED');
        return {status: false, extractedName: null};
    }

    private checkNameWithoutPunctuations(name: string, text: string):INameCheckVerficationResult {
        Logger.info(this.NAMESPACE, 'Check for FULL name WITHOUT punctuations');
        // Remove "," from entire text and search for name
        const textWithoutComma = this.removeCommaFromText(text);
        if(textWithoutComma.includes(name) === true) {
            Logger.info(this.NAMESPACE, '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            Logger.info(this.NAMESPACE, 'MATCHES checkNameWithoutPunctuations:'+name);
            Logger.info(this.NAMESPACE, '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            return {status: true, extractedName: name};
        } else {
            // Reverse name and check to see if it contains name
            const reverseName = this.flipName(name);
            if(textWithoutComma.includes(reverseName) === true) {
                Logger.info(this.NAMESPACE, '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                Logger.info(this.NAMESPACE, 'MATCHES checkNameWithoutPunctuations:'+reverseName);
                Logger.info(this.NAMESPACE, '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                return {status: true, extractedName: reverseName};
            }
        }
        Logger.info(this.NAMESPACE, 'Check for FULL name WITHOUT punctuations FAILED');
        return {status: false, extractedName: null};
    }

    /*
     * A simple method to exchange first and lastname
     */
    private flipName(name: string){
        if(this.numberOfWords(name) == 2) {
            const splitName = name.split(' ');
            return `${splitName[1]} ${splitName[0]}`
        }
        return name;
    }
    //*******************************************************************
}