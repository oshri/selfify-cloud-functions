"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
exports.test = functions.https.onRequest((request, response) => {
    response.status(200).send('HI its a Test end point');
});
//# sourceMappingURL=index.js.map