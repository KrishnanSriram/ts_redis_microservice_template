import 'mocha';
import {FullNameChecker} from "../src/services/namecheck/fullname";
import * as assert from "assert";
import {PartialNameChecker} from "../src/services/namecheck/partialname";
// declare var require: any;

describe("Check for full names", () => {
  const Data = require('./data.json');
  let fullnameChecker: FullNameChecker;
  let partialnameChecker: PartialNameChecker;
  before(() => {
    console.log("Instantiate app");
    fullnameChecker = new FullNameChecker();
    partialnameChecker = new PartialNameChecker();
  });
  it("Check for full name", () => {
    const {text, name} = Data["test1"];
    const result = fullnameChecker.checkNameInText(name, text);
    assert.strictEqual(result.status, true, `Full name match for ${name} should be TRUE`);
    assert.strictEqual(result.extractedName, "patrick travers corcor", "Extracted name is incorrect");
  });
  it("Check for flipped name", () => {
    const {text, name} = Data["test2"];
    const result = fullnameChecker.checkNameInText(name, text);
    assert.strictEqual(result.status, true, `Flipped name match for ${name} should be TRUE`);
    assert.strictEqual(result.extractedName, "gentry caden", "Extracted name is incorrect");
  });
  it("Check for partial name", () => {
    const {text, name} = Data["test3"];
    const result = partialnameChecker.checkNameInText(name, text);
    assert.strictEqual(result.status, true, `Failed to check on partial name - ${name}`);
    assert.strictEqual(result.extractedName, "charles", `Extracted name is incorrect - ${result.extractedName}`);
  });
  it("Check for no match", () => {
    const {text, name} = Data["test4"];
    const result = partialnameChecker.checkNameInText(name, text);
    assert.strictEqual(result.status, true, `Name match for ${name} should be FALSE`);
    assert.strictEqual(result.extractedName, "adeline", `Extracted name is incorrect - ${result.extractedName}`);
  });
  it("Check single letter middle name", () => {
    const {text, name} = Data["test5"];
    const result = partialnameChecker.checkNameInText(name, text);
    assert.strictEqual(result.status, false);
    assert.strictEqual(result.extractedName, null, `Extracted name is incorrect - ${result.extractedName}`);
  });
  it("Check for 2/multi letter middle name", () => {
    const {text, name} = Data["test6"];
    const result = partialnameChecker.checkNameInText(name, text);
    assert.strictEqual(result.status, true);
    assert.strictEqual(result.extractedName, "aj", `Extracted name is incorrect - ${result.extractedName}`);
  });
  after(() => {
    console.log("Close app");
  })


});
