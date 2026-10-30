const db = require("../db/database");

const date = new Date();

//get last bill id 
const getLastId = async () => {
    const sql = "SELECT Bill_id FROM Bill ORDER BY CAST(SUBSTRING(Bill_id, 2) AS UNSIGNED) DESC LIMIT 1";
    return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            if (result.length === 0) {
                resolve("B0");
            }
            resolve(result[0].Bill_id);
        })
    });
}

//create new bill id
const NewBillId = async (req, res) => {
    const lastId = await getLastId();
    const number = parseInt(lastID.substring(1));
    const newID = "B" + (number + 1);
    return newID;
}

//get order items price 
const TotalBill = async (Order_id) => {
    const sql = "SELECT Price_per_items FROM WHERE Order_id = ? AND is_deleted=0";
    const fee = new promise((resolve, reject) => {
        db.query(sql, [Order_id], (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            if (result.length >= 0) {
                resolve(result)
            }
        })
    });
    let price = 0;
    for (const one in fee) {
        price = price + Float(one);
    }
    return price;
}

//create new bill 
const createNewBill = async (req, res) => {
    const Bill_id = await NewBillId();
    const { Order_id } = req.params;
    const { Advance } = req.body;
    const Total = await TotalBill(Order_id);
    const Remain = Total - Advance;
    const is_complete_balance = Remain === 0 ? 1 : 0;
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const sql = "INSERT INTO Bill (Bill_id,Order_id,Total,Advance,Remain , is_completed_balance,Advance_payment_date,Balance_complete_date,is_deleted) VALUES (?,?,?,?,?,?,?,?,0)";
    if (Remain === 0) {
        db.query(sql, [Bill_id, Order_id, Total, Advance, Remain, is_complete_balance, date, date], (error) => {
            if (error) {
                return res.json(error);
            }
        })
    }
    else {
        const notPay = null;
        db.query(sql, [Bill_id, Order_id, Total, Advance, Remain, is_complete_balance, date, notPay], (error) => {
            if (error) {
                return res.json(error);
            }
        });
        return res.json({ successfull: false });
    }
}

// delete bills 
const deleteBill = async (Order_id) => {
    const sql = "UPDATE Bill SET is_deleted = 1 WHERE Order_id = ?";
    db.query(sql, [Order_id], (error) => {
        return error;
    });
}

const getAdvance = async (Order_id) => {
    const sql = "SELECT Advance FROM Bill WHERE Order_id = ?";
    const advance = new promise((resolve, reject) => {
        db.query(sql, [Order_id], (error, result) => {
            if (error) {
                reject(error)
                return
            }
            resolve(Float(result[0]))
        });
    });
    return advance;
}

//update bills 
const updateBill = async (Order_id) => {
    const Total = await TotalBill();
    const Advance = await getAdvance(Order_id);
    const Remain = Total - Advance;
    const is_complete_balance = Remain === 0 ? 1 : 0;
    const sql = "UPDATE Bill SET Total = ? , Remain = ? , is_completed_balance = ? WHERE Order_id = ? ";
    db.query(sql, [Total, Remain, is_complete_balance, Order_id], (error, result) => {
        if (error) {
            return error;
        }
    });

}

module.exports = { updateBill, createNewBill, deleteBill }
