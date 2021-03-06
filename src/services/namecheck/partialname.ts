import {INameChecker} from "./index";
import {INameCheckVerficationResult} from "../../command/namechecker";
import Logger from "../../middleware/logger";

export class PartialNameChecker implements INameChecker{
    readonly NAMESPACE = "PartialNameChecker"

    checkNameInText(name:string, text:string): INameCheckVerficationResult {
        const lw_name = name.toLowerCase();
        const lw_text = text.toLowerCase();
        return this.checkForPartialName(lw_name, lw_text);
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
        Logger.info(this.NAMESPACE,'Check for PARTIAL name');
        let partialMatch = false;
        const splitNames = name.split(' ');
        const partialNames = this.removeSingleLetterPartials(splitNames);
        const pipedName = partialNames.join('|');
        const regex = new RegExp(`\\b(${pipedName})\\b`, "gmi");
        const partialMatchValue = regex.exec(text);
        partialMatch = partialMatchValue ? true : false;
        Logger.info(this.NAMESPACE,'+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        Logger.info(this.NAMESPACE,'MATCHES checkForPartialName:'+partialMatchValue);
        Logger.info(this.NAMESPACE,'+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        Logger.info(this.NAMESPACE,`Result of partial match test is ${partialMatch}`);
        Logger.info(this.NAMESPACE,`Extracted name(s) is ${partialMatchValue}`);
        let extractName : string | null = null;
        if(partialMatchValue && partialMatchValue.length > 0) {
            extractName = partialMatchValue[0];
        }
        return {status: partialMatch, extractedName: extractName };
    }
}