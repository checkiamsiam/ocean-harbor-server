"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const jobs_1 = __importDefault(require("./jobs"));
// handle uncaughtExceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception...😓. Process Terminated");
    process.exit(1);
});
let server;
const runServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, jobs_1.default)();
        server = app_1.default.listen(config_1.default.port, () => {
            if (config_1.default.isDevelopment) {
                console.log(`✔ Server started at http://localhost:${config_1.default.port}`);
            }
        });
    }
    catch (err) {
        console.error(err.message);
    }
    // handle unHandledRejection
    process.on("unhandledRejection", (err) => {
        console.error("UNHANDLED REJECTION... 💥. Process Terminated");
        if (server) {
            server.close(() => {
                process.exit(1);
            });
        }
        else {
            process.exit(1);
        }
    });
});
runServer();
// handle signal termination
process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        console.log("💥 Process terminated!");
        process.exit(1);
    });
});
