const db = require("../db/database")

//date
const now = new Date();

//get last id 
const getLastId = async () => {
    const sql = "SELECT Task_id FROM Task ORDER BY CAST(SUBSTRING(Task_id , 2) AS UNSIGNED ) DESC LIMIT 1"
    return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            if (result.length === 0) {
                resolve("T0");
                return;
            }
            resolve(result[0].Task_id);
        });
    });
}
//create new id
const createNewId = async () => {
    const lastID = await getLastId();
    const number = parseInt(lastID.substring(1));
    const newID = "T" + (number + 1);
    return newID;
}

//get fee for task
const getFeeForTask = async (Item_id) => {
    const sqlForFee = "SELECT Fee_for_task FROM Product WHERE Product_id = ?";
    const sqlForProductid = "SELECT Product_id FROM Order_items WHERE Item_id = ?";
    const Product_id = await new Promise((resolve, reject) => {
        db.query(sqlForProductid, [Item_id], (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.length === 0) {
                return reject(
                    new Error(`Product not found: ${Item_id}`)
                );
            }

            resolve(result[0].Product_id);
        });
    });
    const Fee_per_task = await new Promise((resolve, reject) => {
        db.query(sqlForFee, [Product_id], (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.length === 0) {
                return reject(
                    new Error(`Product not found: ${Item_id}`)
                );
            }

            resolve(Number(result[0].Fee_for_task));
        });
    });
    return Fee_per_task;
}

//get quantity
const getQuantity = async (Item_id) => {
    const sql = "SELECT Quantity FROM Order_items WHERE Item_id=?";
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
    return Quantity;
}
//get deadline date
const getDeadLine = async (Order_id) => {
    const sql = "SELECT Receive_date FROM Orders WHERE Order_id = ?";
    const Deadline = await new Promise((resolve, reject) => {
        db.query(sql, [Order_id], (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.length === 0) {
                return reject(
                    new Error(`Product not found: ${Order_id}`)
                );
            }

            resolve(result[0].Deadline);
        });
    });
    return Deadline;

}

//get all of the items
const getItems = async (Order_id) => {
    const sql = "SELECT Item_id FROM Order_items WHERE Order_id = ? AND is_deleted = 0 "
    const Items = await new Promise((resolve, reject) => {
        db.query(sql, [Order_id], (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.length === 0) {
                return reject(
                    new Error(`Product not found: ${Order_id}`)
                );
            }

            resolve(result);
        });
    });
    return Items;
}

//create task 
//req = > Item_id , Order_id , Employee_id , Deadline , Finnish_time , Fee_for_Task

const createTask = async (Item_id, Order_id) => {
    const Quantity = await getQuantity(Item_id);
    const Fee_for_task = await getFeeForTask(Item_id);
    const Deadline = await getDeadLine(Order_id);

    const sql = `
        INSERT INTO Task
        (
            Task_id, Item_id, Order_id, Employee_id,
            Start_date, Start_time, Deadline,
            Finnish_time, Fee_for_task, is_deleted
        )
        VALUES (?, ?, ?, NULL, NULL, NULL, ?, NULL, ?, 0)
    `;

    for (let i = 0; i < Quantity; i++) {
        const Task_id = await createNewId();

        await new Promise((resolve, reject) => {
            db.query(
                sql,
                [Task_id, Item_id, Order_id, Deadline, Fee_for_task],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
};


//create tasks 

const createTasks = async (req, res) => {
    try {
        const { Order_id } = req.body;

        if (!Order_id) {
            return res.status(400).json({
                successfull: false,
                message: "Order_id is required"
            });
        }

        const Items = await getItems(Order_id);

        if (Items.length === 0) {
            return res.status(404).json({
                successfull: false,
                message: "No order items found"
            });
        }

        for (const Item_id of Items) {
            await createTask(Item_id, Order_id);
        }

        return res.status(201).json({
            successfull: true,
            message: "Tasks created successfully"
        });

    } catch (error) {
        return res.status(500).json({
            successfull: false,
            message: "Failed to create tasks",
            error: error.message
        });
    }
};


//assign task

const assignTask = async (req, res) => {
    try {
        const { Task_id } = req.params;
        const { Employee_id } = req.body;



        const Start_time = now.toTimeString().split(" ")[0];

        const Start_date =
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

        const sql = `
            UPDATE Task
            SET Employee_id = ?,
                Start_date = ?,
                Start_time = ?
            WHERE Task_id = ?
              AND is_deleted = 0
        `;

        db.query(
            sql,
            [Employee_id, Start_date, Start_time, Task_id],
            (error, result) => {
                if (error) {
                    return res.status(500).json({
                        successfull: false,
                        message: "Task assignment failed",
                        error: error.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        successfull: false,
                        message: "Task not found or no changes made"
                    });
                }

                return res.status(200).json({
                    successfull: true,
                    message: "Task assigned successfully",
                    Start_date,
                    Start_time
                });
            }
        );
    } catch (error) {
        return res.status(500).json({
            successfull: false,
            message: "Server error",
            error: error.message
        });
    }
};


//complete task
const completeTask = async (req, res) => {
    try {
        const { Task_id } = req.params;
        const Finish_time = now.toTimeString().split(" ")[0];
        const sql = "UPDATE Task SET Finnish_time = ? WHERE Task_id = ? AND is_deleted=0";
        db.query(sql, [Finish_time, Task_id], (error) => {
            if (error) {
                return res.json({
                    successfull: false,
                    message: "failed to complete"
                });
            }
            return res.status(200).json({
                successfull: true,
                message: "Task completed"
            });
        });

    } catch (error) {
        return res.status(500).json({
            successfull: false,
            message: "Server error",
            error: error.message
        });
    }

}

//view task
const viewTask = async (req, res) => {
    try {
        const { Task_id } = req.params;
        const sql = "SELECT * FROM Task WHERE Task_id = ?";
        db.query(sql, [Task_id], (error, result) => {
            if (error) {
                return res.json({
                    successfull: false,
                    message: "failed to fetch"
                });
            }
            return res.json(result);
        });

    } catch (error) {
        return res.status(500).json({
            successfull: false,
            message: "Server error",
            error: error.message
        });
    }

}

//view task that one order has
const viewTaskOrder = async (req, res) => {
    try {
        const { Order_id } = req.params;
        const sql = "SELECT * FROM Task WHERE Order_id = ?";
        db.query(sql, [Order_id], (error, result) => {
            if (error) {
                return res.json({
                    successfull: false,
                    message: "failed to fetch"
                });
            }
            return res.json(result);
        });
    }
    catch (error) {
        return res.status(500).json({
            successfull: false,
            message: "Server error",
            error: error.message
        });
    }

}

module.exports = {
    viewTask, createTasks, assignTask, completeTask, viewTaskOrder
}