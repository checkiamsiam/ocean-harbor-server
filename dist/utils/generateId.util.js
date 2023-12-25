"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewID = void 0;
const generateNewID = (prefix, lastIdWithSignatures) => {
    const lastId = lastIdWithSignatures
        ? lastIdWithSignatures.slice(2)
        : (0).toString().padStart(6, "0");
    const incrementedId = (parseInt(lastId) + 1).toString().padStart(6, "0");
    return `${prefix}${incrementedId}`;
};
exports.generateNewID = generateNewID;
