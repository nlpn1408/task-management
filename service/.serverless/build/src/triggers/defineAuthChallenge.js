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

// src/triggers/defineAuthChallenge.ts
var defineAuthChallenge_exports = {};
__export(defineAuthChallenge_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(defineAuthChallenge_exports);
var handler = async (event) => {
  const session = event.request.session || [];
  if (session.length === 0) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  } else {
    const lastChallenge = session[session.length - 1];
    if (lastChallenge.challengeName === "CUSTOM_CHALLENGE" && lastChallenge.challengeResult === true) {
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else if (lastChallenge.challengeName === "CUSTOM_CHALLENGE" && lastChallenge.challengeResult === false) {
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = "CUSTOM_CHALLENGE";
    } else {
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    }
  }
  return event;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=defineAuthChallenge.js.map
