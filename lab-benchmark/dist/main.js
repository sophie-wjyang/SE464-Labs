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
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const path_1 = __importDefault(require("path"));
const testing_1 = require("./testing");
const { app } = (0, express_ws_1.default)((0, express_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const resultsCache = {};
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
});
app.post('/viewResults', (req, res) => {
    const url = req.body.url;
    const id = btoa(url);
    res.redirect(`/viewResults/${id}`);
});
app.get('/viewResults/:id', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'results.html'));
});
app.ws('/results/:id', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    const awsUrl = atob(req.params.id);
    const iterations = Number(req.query.iterations) || 1;
    if (resultsCache[awsUrl]) {
        ws.send(JSON.stringify(resultsCache[awsUrl]));
    }
    else {
        (0, testing_1.runTests)(awsUrl, resultsCache, iterations, ws);
    }
    ws.onmessage = (msg) => {
        const iterations = Number(msg.data);
        (0, testing_1.runTests)(awsUrl, resultsCache, iterations, ws);
    };
}));
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=main.js.map