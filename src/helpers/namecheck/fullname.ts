import {NameChecker} from "./index";
import {INameCheckVerficationResult} from "../../command/namechecker";

export class FullNameChecker extends NameChecker{
    checkNameInText(name:string, text:string): INameCheckVerficationResult {
        // Don't modify text content and look for matching name
        let result = this.checkNameAsIs(name, text);
        if(result.status === false) {
            result = this.checkNameWithoutPunctuations(name, text);
        }

        return result;
    }

    private checkNameAsIs(name: string, text: string): INameCheckVerficationResult {
        console.log('info', 'Check for FULL name WITH punctuations');
        // Check to see if the text contains name as is
        if(text.includes(name) === true) {
            console.log('info', '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log('info', 'MATCHES checkNameInText:'+name);
            console.log('info', '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            return {status: true, extractedName: name};
        }

        console.log('info', 'Check for FULL name WITH punctuations FAILED');
        return {status: false, extractedName: null};
    }

    private checkNameWithoutPunctuations(name: string, text: string):INameCheckVerficationResult {
        console.log('info', 'Check for FULL name WITHOUT punctuations');
        // Remove "," from entire text and search for name
        const textWithoutComma = this.removeCommaFromText(text);
        if(textWithoutComma.includes(name) === true) {
            console.log('info', '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            console.log('info', 'MATCHES checkNameWithoutPunctuations:'+name);
            console.log('info', '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            return {status: true, extractedName: name};
        } else {
            // Reverse name and check to see if it contains name
            const reverseName = this.flipName(name);
            if(textWithoutComma.includes(reverseName) === true) {
                console.log('info', '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                console.log('info', 'MATCHES checkNameWithoutPunctuations:'+reverseName);
                console.log('info', '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                return {status: true, extractedName: reverseName};
            }
        }
        console.log('info', 'Check for FULL name WITHOUT punctuations FAILED');
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