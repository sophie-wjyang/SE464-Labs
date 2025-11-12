import { Product } from "../compiled_proto/app";
import { IDatabase } from "../interfaces";
import { Category, Order, User, UserPatchRequest } from "../types";
import mysql from "mysql2/promise";
import logger from "../logger";

export default class MySqlDB implements IDatabase {
    connection: mysql.Connection;

    async init() {
        this.connection = await mysql.createConnection({
            host: process.env.RDS_HOSTNAME,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            port: parseInt(process.env.RDS_PORT), // Convert port to a number
            database: process.env.RDS_DATABASE,
        });
        logger.info("MySQL connected!");
    }

    constructor() {
        this.init();
    }

    async queryProductById(productId) {
        return (
            await this.connection.query(`SELECT *
                                FROM products
                                WHERE id = "${productId}";`)
        )[0][0] as Product;
    }

    async queryRandomProduct() {
        return (
            await this.connection.query(`SELECT *
                                FROM products
                                ORDER BY RAND()
                                LIMIT 1;`)
        )[0][0] as Product;
    }

    queryAllProducts = async (category?: string) => {
        if (category) {
            return (
                await this.connection.query(`SELECT *
                                  FROM products
                                  WHERE categoryId = "${category}";`)
            )[0] as Product[];
        } else {
            return (await this.connection.query("SELECT * FROM products;"))[0] as Product[];
        }
    };

    queryAllCategories = async () => {
        return (await this.connection.query("SELECT * FROM categories;"))[0] as Category[];
    };

    queryAllOrders = async () => {
        const orders = (await this.connection.query("SELECT * FROM orders;"))[0] as any[];

        // For each order, get its products
        for (let order of orders) {
            const orderItems = (await this.connection.query(`SELECT productId, quantity FROM order_items WHERE orderId = "${order.id}";`))[0] as any[];
            order.products = orderItems;
        }

        return orders as Order[];
    };

    async queryOrdersByUser(id: string) {
        const orders = (
            await this.connection.query(`SELECT *
                             FROM orders
                             WHERE userId = "${id}";`)
        )[0] as any[];

        // For each order, get its products
        for (let order of orders) {
            const orderItems = (await this.connection.query(`SELECT productId, quantity FROM order_items WHERE orderId = "${order.id}";`))[0] as any[];
            order.products = orderItems;
        }

        return orders as Order[];
    }

    queryOrderById = async (id: string) => {
        return (
            await this.connection.query(`SELECT *
                             FROM orders
                             WHERE id = "${id}"`)
        )[0][0];
    };

    queryUserById = async (id: string) => {
        return (
            await this.connection.query(`SELECT id, email, name
                             FROM users
                             WHERE id = "${id}";`)
        )[0][0];
    };

    queryAllUsers = async () => {
        return (await this.connection.query("SELECT id, name, email FROM users"))[0] as User[];
    };

    insertOrder = async (order: Order) => {
        // Insert into orders table
        await this.connection.query(`INSERT INTO orders (id, userId, totalAmount) VALUES (?, ?, ?)`, [order.id, order.userId, order.totalAmount]);

        // Insert into order_items table
        for (let product of order.products) {
            await this.connection.query(`INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)`, [order.id, product.productId, product.quantity]);
        }
    };

    updateUser = async (patch: UserPatchRequest) => {
        const updates: string[] = [];
        const values: any[] = [];

        if (patch.email !== undefined) {
            updates.push("email = ?");
            values.push(patch.email);
        }

        if (patch.password !== undefined) {
            updates.push("password = ?");
            values.push(patch.password);
        }

        if (updates.length > 0) {
            values.push(patch.id);
            await this.connection.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);
        }
    };

    // This is to delete the inserted order to avoid database data being contaminated also to make the data in database consistent with that in the json files so the comparison will return true.
    // Feel free to modify this based on your inserOrder implementation
    deleteOrder = async (id: string) => {
        await this.connection.query(`DELETE FROM order_items WHERE orderId = ?`, [id]);
        await this.connection.query(`DELETE FROM orders WHERE id = ?`, [id]);
    };
}
