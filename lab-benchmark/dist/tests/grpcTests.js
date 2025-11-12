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
const app_1 = require("../compiled_proto/app");
const nice_grpc_1 = require("nice-grpc");
const testing_1 = require("../testing");
const constants_1 = __importDefault(require("../constants"));
const uuid_1 = require("uuid");
class GrpcTestSuite {
    constructor(ip) {
        this.insertedOrderIds = [];
        this.channel = (0, nice_grpc_1.createChannel)(`${ip}:3001`);
        this.client = (0, nice_grpc_1.createClient)(app_1.AppDefinition, this.channel);
    }
    testRandomProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getRandomProduct({});
                return {
                    payload: data,
                    ok: true,
                };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getUser({ id });
                return { payload: data, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testAllProducts(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getAllProducts({ categoryId });
                return { payload: data.products, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getProduct({ productId });
                return { payload: data, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getAllCategories({});
                return { payload: data.categories, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getAllOrders({});
                return { payload: data.orders, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testOrdersByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getAllUserOrders({ id });
                return { payload: data.orders, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getOrder({ id });
                return { payload: data, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.getAllUsers({});
                return { payload: data.users, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    testInsertOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.postOrder(order);
                this.insertedOrderIds.push(order.id);
                return { payload: data, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    cleanupInsertedOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const orderId of this.insertedOrderIds) {
                try {
                    yield this.client.deleteOrder({ id: orderId });
                }
                catch (e) {
                    console.error(`Failed to delete order with id ${orderId}:`, e);
                }
            }
            // Clear the list after cleanup
            this.insertedOrderIds = [];
        });
    }
    testUpdateUser(patch) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.patchAccountDetails(patch);
                return { payload: data, ok: true };
            }
            catch (e) {
                console.error(e);
                return { payload: null, ok: false };
            }
        });
    }
    runSuite(iterations) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = {
                randomProduct: {
                    ok: false,
                    time: 0
                },
                userById: {
                    ok: false,
                    time: 0
                },
                allProducts: {
                    ok: false,
                    time: 0
                },
                productById: {
                    ok: false,
                    time: 0
                },
                allCategories: {
                    ok: false,
                    time: 0
                },
                allOrders: {
                    ok: false,
                    time: 0
                },
                ordersByUser: {
                    ok: false,
                    time: 0
                },
                orderById: {
                    ok: false,
                    time: 0
                },
                allUsers: {
                    ok: false,
                    time: 0
                },
                insertOrder: {
                    ok: false,
                    time: 0
                },
                updateUser: {
                    ok: false,
                    time: 0
                }
            };
            try {
                results.randomProduct = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testRandomProduct(); }), iterations);
                results.userById = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testUserById(constants_1.default.TEST_USER_ID); }), iterations, constants_1.default.EXPECTED_USER);
                results.allProducts = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testAllProducts(); }), iterations, constants_1.default.EXPECTED_PRODUCTS);
                results.productById = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testProductById(constants_1.default.TEST_PRODUCT_ID); }), iterations, constants_1.default.EXPECTED_PRODUCT);
                results.allCategories = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testAllCategories(); }), iterations, constants_1.default.EXPECTED_CATEGORIES);
                results.allOrders = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testAllOrders(); }), iterations, constants_1.default.EXPECTED_ORDERS);
                results.ordersByUser = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testOrdersByUser(constants_1.default.TEST_USER_ID); }), iterations, constants_1.default.EXPECTED_ORDERSBYUSER);
                results.orderById = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testOrderById(constants_1.default.TEST_ORDER_ID); }), iterations, constants_1.default.EXPECTED_ORDER);
                results.allUsers = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testAllUsers(); }), iterations, constants_1.default.EXPECTED_USERS);
                results.insertOrder = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testInsertOrder(Object.assign({ id: (0, uuid_1.v4)() }, constants_1.default.TEST_ORDER)); }), iterations);
                results.updateUser = yield (0, testing_1.avgRuntime)(() => __awaiter(this, void 0, void 0, function* () { return yield this.testUpdateUser(constants_1.default.TEST_UPDATE); }), iterations);
            }
            finally {
                yield this.cleanupInsertedOrders();
            }
            return results;
        });
    }
}
exports.default = GrpcTestSuite;
//# sourceMappingURL=grpcTests.js.map