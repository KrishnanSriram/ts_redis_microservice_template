import {INameChecker} from "./index";
import {INameCheckVerficationResult} from "../../command/namechecker";

export class PartialNameChecker implements INameChecker{
    checkNameInText(name:string, text:string): INameCheckVerficationResult {
        return this.checkForPartialName(name, text);
    }

    /*
     * Check each word in name to be more than 1 character length. We want to ignore single character names
     * to avoid false positive cases.
     */
    private removeSingleLetterPartials(names: string[]) {
        let partialNames = [];
        for (let index=0;index<names.length;index++) {
            if(names[index].length > 1) {
                partialNames.push(names[index]);
            }
        }
        return partialNames;
    }

    /*
     * This method will be invoked, only if the checkNameInText method failed
     * Here, we split name to individual words and search for each word in the text
     * a. If all words match, we have a full match
     * b. If we have a match for some words and not for others, we have a partial match
     */
    private checkForPartialName(name: string, text: string) : INameCheckVerficationResult {
        console.log('info', 'Check for PARTIAL name');
        let partialMatch = false;
        const splitNames = name.split(' ');
        const partialNames = this.removeSingleLetterPartials(splitNames);
        const pipedName = partialNames.join('|');
        const regex = new RegExp(`\\b(${pipedName})\\b`, "gmi");
        partialMatch = regex.test(text);
        let partialMatchValue = regex.exec(text);

        console.log('info', '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('info', 'MATCHES checkForPartialName:'+regex.exec(text));
        console.log('info', '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('info', `Result of partial match test is ${partialMatch}`);
        let extractName : string | null = null;
        if(partialMatchValue && partialMatchValue.length > 0) {
            extractName = partialMatchValue[0];
        }
        return {status: partialMatchValue ? true : false, extractedName: extractName };
    }
}