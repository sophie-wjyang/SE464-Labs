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
const testing_1 = require("../testing");
const uuid_1 = require("uuid");
const constants_1 = __importDefault(require("../constants"));
// Using built-in fetch API (available in Node.js 18+)
class RestTestSuite {
    constructor(ip) {
        // Track inserted order IDs
        this.insertedOrderIds = [];
        this.endpoint = `http://${ip}:3000`;
    }
    testRandomProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fetch(this.endpoint + "/randomproduct");
                if (!resp.ok)
                    throw new Error("Failed to fetch random product");
                const json = yield resp.json();
                return {
                    payload: json,
                    ok: true
                };
            }
            catch (e) {
                console.error(e);
                return {
                    payload: null,
                    ok: false
                };
            }
        });
    }
    testUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fetch(this.endpoint + "/user/" + id);
                if (!resp.ok)
                    throw new Error("Failed to fetch user by id");
                const json = yield resp.json();
                return { payload: json, ok: true };
            }
            catch (e) {
                console.error("error");
                return { payload: null, ok: false };
            }
        });
    }
    testAllProducts(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fetch(this.endpoint + "/products" + (categoryId ? "?categoryId=" + categoryId : ""));
                if (!resp.ok)
                    throw new Error("Failed to fetch all products");
                const json = yield resp.json();
                return { payload: json, ok: true };
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
                const resp = yield fetch(this.endpoint + "/product/" + productId);
                if (!resp.ok)
                    throw new Error("Failed to fetch product by id");
                const json = yield resp.json();
                return { payload: json, ok: true };
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
                const resp = yield fetch(this.endpoint + "/categories");
                if (!resp.ok)
                    throw new Error("Failed to fetch all categories");
                const json = yield resp.json();
                return { payload: json, ok: true };
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
                const resp = yield fetch(this.endpoint + "/allorders");
                if (!resp.ok)
                    throw new Error("Failed to fetch all orders");
                const json = yield resp.json();
                // console.log("Actual allOrders data:", JSON.stringify(json, null, 2));
                console.log("Actual allOrders size:", json.length);
                return { payload: json, ok: true };
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
                const resp = yield fetch(this.endpoint + "/orders?id=" + id);
                if (!resp.ok)
                    throw new Error("Failed to fetch orders by user");
                const json = yield resp.json();
                return { payload: json, ok: true };
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
                const resp = yield fetch(this.endpoint + "/order/" + id);
                if (!resp.ok)
                    throw new Error("Failed to fetch order by id");
                const json = yield resp.json();
                return { payload: json, ok: true };
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
                const resp = yield fetch(this.endpoint + "/users");
                if (!resp.ok)
                    throw new Error("Failed to fetch all users");
                const json = yield resp.json();
                return { payload: json, ok: true };
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
                const resp = yield fetch(this.endpoint + "/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(order)
                });
                if (!resp.ok)
                    throw new Error("Failed to insert order");
                // Record the inserted order ID
                this.insertedOrderIds.push(order.id);
                return { payload: null, ok: true };
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
                    const resp = yield fetch(this.endpoint + `/order/${orderId}`, {
                        method: "DELETE"
                    });
                    if (!resp.ok) {
                        console.error(`Failed to delete order with id ${orderId}`);
                    }
                }
                catch (e) {
                    console.error(`Error deleting order with id ${orderId}:`, e);
                }
            }
            // Clear the list after cleanup
            this.insertedOrderIds = [];
        });
    }
    testUpdateUser(patch) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fetch(this.endpoint + `/user/${patch.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(patch)
                });
                if (!resp.ok)
                    throw new Error("Failed to update user");
                return { payload: null, ok: true };
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
                // console.log("Expected allOrders data:", JSON.stringify(constants.EXPECTED_ORDERS, null, 2));
                console.log("Expected allOrders size:", constants_1.default.EXPECTED_ORDERS.length);
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
exports.default = RestTestSuite;
//# sourceMappingURL=restTests.js.map