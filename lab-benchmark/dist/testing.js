"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.runTests = exports.avgRuntime = void 0;
const restTests_1 = __importDefault(require("./tests/restTests"));
const perf_hooks_1 = require("perf_hooks");
const _ = __importStar(require("lodash"));
const runTest = (func, expected) => __awaiter(void 0, void 0, void 0, function* () {
    const start = perf_hooks_1.performance.now();
    const result = yield func();
    const end = perf_hooks_1.performance.now();
    let pass = result === null || result === void 0 ? void 0 : result.ok;
    // Function to compare arrays of objects by 'id'.
    function compareArraysById(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        // Extract ids from both arrays
        const ids1 = arr1.map((item) => item.id).sort();
        const ids2 = arr2.map((item) => item.id).sort();
        // Compare the sorted arrays of ids
        return _.isEqual(ids1, ids2);
    }
    if (expected !== undefined) {
        if (Array.isArray(expected) && Array.isArray(result === null || result === void 0 ? void 0 : result.payload)) {
            // Compare arrays of objects by 'id'
            pass = compareArraysById(result.payload, expected) && (result === null || result === void 0 ? void 0 : result.ok);
        }
        else if (typeof expected === "object" && typeof (result === null || result === void 0 ? void 0 : result.payload) === "object") {
            // Compare single objects by 'id'
            pass = expected.id === result.payload.id && (result === null || result === void 0 ? void 0 : result.ok);
        }
        else {
            pass = false;
        }
    }
    let message = pass
        ? "ok."
        : `failed.
Expected:
${JSON.stringify(expected, undefined, 2)}
Received:
${JSON.stringify(result === null || result === void 0 ? void 0 : result.payload, undefined, 2)}`;
    return {
        ok: pass,
        time: end - start,
        message,
    };
});
const avgRuntime = (func, iterations, expected) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const promises = [];
    for (let i = 0; i < iterations; i++) {
        promises.push(runTest(func, expected));
    }
    const results = yield Promise.all(promises);
    return {
        ok: results === null || results === void 0 ? void 0 : results.reduce((acc, curr) => acc && curr.ok, true),
        time: (results === null || results === void 0 ? void 0 : results.reduce((acc, curr) => acc + curr.time, 0)) / iterations,
        message: (_a = results === null || results === void 0 ? void 0 : results[0]) === null || _a === void 0 ? void 0 : _a.message,
    };
});
exports.avgRuntime = avgRuntime;
function runTests(awsUrl, resultCache, iterations, ws) {
    return __awaiter(this, void 0, void 0, function* () {
        const restTestSuite = new restTests_1.default(awsUrl);
        // const grpcTestSuite = new GrpcTestSuite(awsUrl);
        // Warmup
        yield restTestSuite.runSuite(1);
        // await grpcTestSuite.runSuite(1);
        resultCache[awsUrl] = {};
        resultCache[awsUrl]["rest"] = yield restTestSuite.runSuite(iterations);
        // resultCache[awsUrl]["grpc"] = await grpcTestSuite.runSuite(iterations);
        if (ws)
            ws.send(JSON.stringify(resultCache[awsUrl]));
    });
}
exports.runTests = runTests;
//# sourceMappingURL=testing.js.map