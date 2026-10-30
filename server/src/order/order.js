
const db = require("../db/database");

const {
    CreateOrderItems,
    deleteAllItem
} = require("../order/order_items");

// Get last order ID
const getLastOrderId = async () => {
    const sql = `
        SELECT Order_id
        FROM Orders
        ORDER BY CAST(SUBSTRING(Order_id, 7) AS UNSIGNED) DESC
        LIMIT 1
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
            if (error) return reject(error);

            if (result.length === 0) {
                return resolve("Order_0");
            }

            return resolve(result[0].Order_id);
        });
    });
};

// Generate new order ID
const newOrderId = async () => {
    const lastId = await getLastOrderId();
    const numberPart = parseInt(lastId.substring(6), 10);

    return "Order_" + (numberPart + 1);
};

// Create a new order
// Request body:
// Customer_id, Receive_date, Products

const createNewOrder = async (req, res) => {
    try {
        const { Customer_id, Receive_date, Products } = req.body;

        if (!Customer_id || !Receive_date ||
            !Array.isArray(Products) || Products.length === 0) {
            return res.status(400).json({
                successfull: false,
                message: "Customer, receive date, and products are required"
            });
        }

        const Order_id = await newOrderId();

        const sql = `
            INSERT INTO Orders
            (Order_id, Customer_id, Receive_date, is_deleted)
            VALUES (?, ?, ?, 0)
        `;

        db.query(
            sql,
            [Order_id, Customer_id, Receive_date],
            async (error, result) => {
                if (error) {
                    return res.status(500).json({
                        successfull: false,
                        message: "Failed to create order",
                        error: error.message
                    });
                }

                try {
                    const itemResult = await CreateOrderItems(
                        Products,
                        Order_id
                    );

                    return res.status(201).json({
                        successfull: true,
                        message: "Order created successfully",
                        Order_id,
                        items: itemResult
                    });
                } catch (itemError) {
                    return res.status(500).json({
                        successfull: false,
                        message: "Order created, but adding order items failed",
                        Order_id,
                        error: itemError.message
                    });
                }
            }
        );
    } catch (error) {
        return res.status(500).json({
            successfull: false,
            message: "Database failure",
            error: error.message
        });
    }
};

// Delete an order and its items
const deleteOrder = async (req, res) => {
    try {
        const { Order_id } = req.params;

        const sql = `
            UPDATE Orders
            SET is_deleted = 1
            WHERE Order_id = ? AND is_deleted = 0
        `;

        db.query(sql, [Order_id], async (error, result) => {
            if (error) {
                return res.status(500).json({
                    successfull: false,
                    message: "Failed to delete order",
                    error: error.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    successfull: false,
                    message: "Order not found"
                });
            }

            try {
                // Pass the Order_id to the order-items controller
                await deleteAllItem(
                    { params: { Order_id } },
                    {
                        status: () => ({
                            json: (data) => data
                        }),
                        json: (data) => data
                    }
                );

                return res.json({
                    successfull: true,
                    message: "Order and its items deleted successfully"
                });
            } catch (itemError) {
                return res.status(500).json({
                    successfull: false,
                    message: "Order deleted, but deleting its items failed",
                    error: itemError.message
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            successfull: false,
            message: "Database failure",
            error: error.message
        });
    }
};

module.exports = {
    createNewOrder,
    deleteOrder
};
