"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_json_1 = __importDefault(require("./oracles/categories.json"));
const orders_json_1 = __importDefault(require("./oracles/orders.json"));
const products_json_1 = __importDefault(require("./oracles/products.json"));
const users_json_1 = __importDefault(require("./oracles/users.json"));
const lodash_1 = __importDefault(require("lodash"));
const constants = {
    TEST_USER_ID: users_json_1.default[0].id,
    TEST_PRODUCT_ID: products_json_1.default[0].id,
    TEST_ORDER_ID: orders_json_1.default[0].id,
    TEST_ORDER: {
        userId: users_json_1.default[1].id,
        products: [{ productId: products_json_1.default[0].id, quantity: 1 }],
        totalAmount: 8
    },
    TEST_UPDATE: {
        id: users_json_1.default[1].id,
        password: "test123"
    },
    EXPECTED_CATEGORIES: lodash_1.default.cloneDeep(categories_json_1.default),
    EXPECTED_USER: lodash_1.default.cloneDeep(users_json_1.default[0]),
    EXPECTED_USERS: lodash_1.default.cloneDeep(users_json_1.default),
    EXPECTED_PRODUCT: lodash_1.default.cloneDeep(products_json_1.default[0]),
    EXPECTED_PRODUCTS: lodash_1.default.cloneDeep(products_json_1.default),
    EXPECTED_ORDER: lodash_1.default.cloneDeep(orders_json_1.default[0]),
    EXPECTED_ORDERS: lodash_1.default.cloneDeep(orders_json_1.default),
    EXPECTED_ORDERSBYUSER: lodash_1.default.cloneDeep(orders_json_1.default.filter((order) => order.userId === users_json_1.default[0].id))
};
exports.default = constants;
//# sourceMappingURL=constants.js.map