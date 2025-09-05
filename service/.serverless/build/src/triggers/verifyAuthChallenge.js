"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/triggers/verifyAuthChallenge.ts
var verifyAuthChallenge_exports = {};
__export(verifyAuthChallenge_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(verifyAuthChallenge_exports);
var handler = async (event) => {
  if (!event.response) {
    event.response = {};
  }
  const userEnteredOtp = event.request.challengeAnswer;
  const expectedOtp = event?.request?.privateChallengeParameters?.otp || "111111";
  console.log("\u{1F680} ~ verifyAuthChallenge ~ userEnteredOtp:", userEnteredOtp, "expectedOtp:", expectedOtp);
  if (userEnteredOtp === expectedOtp) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }
  return event;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=verifyAuthChallenge.js.map
