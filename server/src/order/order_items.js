const db = require("../db/database");

//get last order item id 
const getLastOrderItemId = async () => {
    const sql = "SELECT Item_id FROM Order_items ORDER BY CAST(SUBSTRING(Item_id, 12) AS UNSIGNED) DESC LIMIT 1";

    return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.length === 0) {
                return resolve("Order_Item_0");
            }

            return resolve(result[0].Item_id);
        });
    });
};

//create new order item id
const newOrderItemId = async () => {
    const lastId = await getLastOrderItemId();
    const numberPart = parseInt(lastId.substring(11));
    const newId = "Order_Item_" + (numberPart + 1);
    return newId;
}

//calculate product Price
const calculateProductPrice = async (Quantity, Product_id) => {
    const sqlForPrice = "SELECT Price_per_product FROM Product WHERE Product_id = ?";
    const productPrice = await new Promise((resolve, reject) => {
        db.query(sqlForPrice, [Product_id], (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.length === 0) {
                return reject(
                    new Error(`Product not found: ${Product_id}`)
                );
            }

            resolve(Number(result[0].Price_per_product));
        });
    });

    // Calculate total price for this item
    return Quantity * productPrice;

}

//get Quantity 
const getQuantity = async (Item_id) => {
    const sql = "SELECT Quantity FROM Order_items WHERE Item_id = ?"
    const Quantity = await new Promise((resolve, reject) => {
        db.query(sql, [Item_id], (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.length === 0) {
                return reject(
                    new Error(`Product not found: ${Item_id}`)
                );
            }

            resolve(Number(result[0].Quantity));
        });
    });

    // Calculate total price for this item
    return Quantity;

}


//req => Product_id , Notes , Quantity , Price_per_item , is_deleted

const CreateOrderItems = async (Products, Order_id) => {
    try {

        const sql = "INSERT INTO Order_items (Item_id, Order_id, Product_id, Notes, Quantity,Price_per_items, is_deleted) VALUES (?, ?, ?, ?, ?, ?, 0)";

        for (const product of Products) {
            const Item_id = await newOrderItemId();

            const { Product_id, Quantity, Notes } = product;

            // Get product price
            const Price_per_items = await calculateProductPrice(Quantity, Product_id);
            // Insert order item
            await new Promise((resolve, reject) => {
                db.query(sql, [Item_id, Order_id, Product_id, Notes, Quantity, Price_per_items],
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        resolve(result);
                    }
                );
            });
        }

        return {
            successfull: true,
            message: "Order items created successfully"
        };

    } catch (error) {
        throw error;
    }
};

//delete one item url must have Orde_item_id(Item_id)
const deleteItem = async (req, res) => {
    try {
        const { Item_id } = req.params;
        const sql = "UPDATE Order_items SET is_deleted = 1 WHERE Item_id = ?";
        db.query(sql, [Item_id], (error, result) => {
            if (error) {
                return res.json({
                    successfull: false
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    successfull: false,
                    message: "Item not found"
                });
            }
            return res.json({
                successfull: true,
                message: "Item deleted successfully"
            });
        });
    }
    catch (error) {
        return res.json({
            message: "Database Failure",
            error,
            successfull: false
        });
    }
}

//delete all items url must have Order_id
const deleteAllItem = async (req, res) => {
    try {
        const { Order_id } = req.params;
        const sql = "UPDATE Order_items SET is_deleted = 1 WHERE Order_id = ?";
        db.query(sql, [Order_id], (error, result) => {
            if (error) {
                return res.json({
                    successfull: false
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    successfull: false,
                    message: "Item not found"
                });
            }
            return res.json({
                successfull: true,
                message: "Item deleted successfully"
            });
        });
    }
    catch (error) {
        return res.json({
            message: "Database Failure",
            error,
            successfull: false
        });
    }
}


//delete Product url must have Order_item_id(Item_id) 
//req.body = Product_id
const updateProductId = async (req, res) => {
    try {
        const { Item_id } = req.params;
        const { Product_id } = req.body;
        const Quantity = await getQuantity(Item_id);
        const Price_per_items = calculateProductPrice(Quantity, Product_id);
        const sql = "UPDATE Order_items SET Product_Id = ? WHERE Item_id = ?";
        db.query(sql, [Product_id, Item_id], (error) => {
            if (error) {
                return res.json({
                    successfull: false
                });
            }
            const sql = "UPDATE Order_items SET Price_per_items = ? WHERE Item_id= ?"


            db.query(sql, [Quantity, Item_id], (error) => {
                if (error) {
                    return res.json({
                        successfull: false
                    });
                }

                return res.json({
                    successfull: true
                });
            })
        });
    }
    catch (error) {
        return res.json({
            message: "Database Failure",
            error,
            successfull: false
        });
    }
}

//delete Quantity url must have Orde_item_id(Item_id)

const updateQuantity = async (req, res) => {
    try {
        const { Item_id } = req.params;
        const { Quantity } = req.body;

        if (!Number.isInteger(Quantity) || Quantity <= 0) {
            return res.status(400).json({
                successfull: false,
                message: "Quantity must be a positive integer"
            });
        }

        const Product_id = await new Promise((resolve, reject) => {
            const sql = `
                SELECT Product_id
                FROM Order_items
                WHERE Item_id = ? AND is_deleted = 0
            `;

            db.query(sql, [Item_id], (error, result) => {
                if (error) return reject(error);

                if (result.length === 0) {
                    return reject(new Error("Order item not found"));
                }

                resolve(result[0].Product_id);
            });
        });

        const Price_per_items = await calculateProductPrice(
            Quantity,
            Product_id
        );

        const sql = `
            UPDATE Order_items
            SET Quantity = ?, Price_per_items = ?
            WHERE Item_id = ? AND is_deleted = 0
        `;

        db.query(
            sql,
            [Quantity, Price_per_items, Item_id],
            (error, result) => {
                if (error) {
                    return res.status(500).json({
                        successfull: false,
                        message: "Failed to update quantity"
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        successfull: false,
                        message: "Order item not found"
                    });
                }

                return res.json({
                    successfull: true,
                    message: "Quantity updated successfully"
                });
            }
        );
    } catch (error) {
        return res.status(
            error.message === "Order item not found" ? 404 : 500
        ).json({
            successfull: false,
            message: error.message
        });
    }
};



//delete note url must have Orde_item_id(Item_id)
const updateNotes = async (req, res) => {
    try {
        const { Item_id } = req.params;
        const { Notes } = req.body;
        const sql = "UPDATE Order_items SET Notes = ? WHERE Item_id = ?";
        db.query(sql, [Notes, Item_id], (error) => {
            if (error) {
                return res.json({
                    successfull: false
                });
            }
            return res.json({
                successfull: true
            });
        });
    }
    catch (error) {
        return res.json({
            message: "Database Failure",
            error,
            successfull: false
        });
    }
}

//view every order items in order
const viewOrderItems = async (req, res) => {
    try {
        const sql = "SELECT * FROM Order_items WHERE Order_id = ?";
        const { Order_id } = req.params;
        db.query(sql, [Order_id], (error, result) => {
            if (error) {
                return res.json({
                    successfull: false
                });
            }
            return res.json(result);
        });
    } catch (error) {
        return res.json({
            message: "Database Failure",
            error,
            successfull: false
        });
    }

}


module.exports = { CreateOrderItems, deleteItem, deleteAllItem, updateNotes, updateProductId, updateQuantity, viewOrderItems }