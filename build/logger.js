"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const winston = require("winston");
function createLogger(sourceFile) {
    const transports = [
        new winston.transports.Console({
            label: path.basename(sourceFile),
            timestamp: true,
            colorize: process.env.NODE_ENV === 'development',
            level: process.env.LOG_LEVEL || 'debug'
        })
    ];
    return new winston.Logger({
        transports: transports
    });
}
exports.default = createLogger;
//# sourceMappingURL=logger.js.map