const db = require("../db/database");

const lastCustomerID = () => {
    const sql = "SELECT C_id FROM Customer ORDER BY CAST(SUBSTRING(C_id , 2) AS UNSIGNED ) DESC LIMIT 1"
    return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            if (result.length === 0) {
                resolve("C0");
                return;
            }
            resolve(result[0].C_id);
        });
    });
}

const newCustomerId = async () => {
    const lastID = await lastCustomerID();
    const number = parseInt(lastID.substring(1));
    const newID = "C" + (number + 1);
    return newID;
};


const showCustomer = async (req, res) => {
    try {
        const sql = "SELECT*FROM Customer where is_deleted=0"
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Something wrong" })
            }
            return res.status(200).json(result);
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Server error"
        })
    }
};
const createCustomer = async (req, res) => {
    try {
        const newId = await newCustomerId();
        const { firstName, lastName, fullName, phoneNumber } = req.body;
        const sql1 = "INSERT INTO Customer ( C_id ,First_Name  , Last_Name , Arm_Length  , Point , Arm_end  , B_irst , Neck_width , Arm_hole , Back_height ,Neck_length , Back_neck_length , Waist , Arm , B_neck_width , Under_bra , Side_slim, Sh_to_under_bra, Sho_to_point, F_first, Shoulder , sh_to_waist,uname ,is_deleted) VALUES (? ,?, ? ,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,?,0)";
        const sql2 = "INSERT INTO Customer_Phonenumber (C_id , Phone_number )  VALUES (?,?)"
        db.query(sql1, [newId, firstName, lastName, fullName], (err) => {
            if (err) {
                return res.status(500).json({
                    message: "database Error"
                })
            }

            db.query(sql2, [newId, phoneNumber], (err) => {
                if (err) {
                    return res.json({
                        nessage: "error in telephone"
                    })

                }
                return res.json({
                    message: "Success",
                    is_created: true
                })
            })
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
};
const deleteCustomer = async (req, res) => {

    const { id } = req.params;

    const sql = "UPDATE Customer SET is_deleted = 1 WHERE C_id = ?";

    db.query(sql, [id], (error) => {

        if (error) {
            return res.status(500).json({
                message: "Failed"
            });
        }

        return res.json({
            message: "deleted"
        });
    });
};

//update customers
const updateCustomer = async (req, res) => {

};

//search customers
const searchCustomer = async (req, res) => {

    const { fullName } = req.body;

    sql = "SELECT * FROM Customer WHERE uname LIKE ? AND is_deleted =0";
    db.query(
        sql, [`%${fullName}%`], (err, result) => {
            if (err) {
                return res.json({ message: "error in database" })
            }
            return res.json(result);

        }
    );
};
const getCustomers = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM Customer  WHERE C_Id = ?";
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.json({ message: "Error in db" })
        }
        return res.json(result)
    })
}

module.exports = {
    getCustomers,
    showCustomer,
    createCustomer,
    deleteCustomer,
    updateCustomer,
    searchCustomer
}