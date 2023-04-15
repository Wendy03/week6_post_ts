"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../config.env') });
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB)
    .then(() => console.log('Connect'))
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map