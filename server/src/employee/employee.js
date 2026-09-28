const db = require("../db/database");

//find last employee id
const lastEmployeeID = () => {
    const sql = "SELECT E_id FROM Employee ORDER BY CAST(SUBSTRING(E_id , 2) AS UNSIGNED ) DESC LIMIT 1"
    return new Promise((resolve, reject) => {
        db.query(sql, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            if (result.length === 0) {
                resolve("E0");
                return;
            }
            resolve(result[0].E_id);
        });
    });
}


//create new employee id
const newEmployeeId = async () => {
    const lastID = await lastEmployeeID();
    const number = parseInt(lastID.substring(1));
    const newID = "E" + (number + 1);
    return newID;
};


const addEmployee = async (req, res) => {
    const id = await newEmployeeId();
    const { fullName, firstName, lastName, phone, address, Nic
    } = req.body;
    const sql1 = "INSERT INTO Employee (E_id,First_name,Last_Name,NIC,Address,is_deleted,fullName) VALUES (?,?,?,?,?,0,?)";
    const sql2 = "INSERT INTO Employee_phone_number (E_id , Phone_number) VALUES (?,?)";

    db.query(sql1, [id, firstName, lastName, Nic, address, fullName], (error) => {
        if (error) {
            console.log(error)
            return res.json({ message: "Error happend" })
        }
        db.query(sql2, [id, phone], (error) => {
            if (error) {
                return res.json({ message: "Error happend" })
            }
            return res.json({ addedd: true });
        });
    });

}

//getEmployees
const getEmployee = async (req, res) => {
    const sql = "SELECT*FROM Employee WHERE is_deleted = 0";
    db.query(sql, (error, result) => {
        if (error) {
            return res.json({ message: "failed" })
        }
        return res.json(result);
    });

}
//update

const updateEmployeefirstName = async (req, res) => {
    const { employeeId } = req.params;
    const { firstName } = req.body;
    const sql = "UPDATE Employee SET First_name = ? WHERE E_id = ?";
    db.query(sql, [firstName, employeeId], (error) => {
        if (error) {
            return res.json({ message: "error found" });
        }
        return res.json({ message: "success" });
    });
}

const updateEmployeelastName = async (req, res) => {
    const { employeeId } = req.params;
    const { lastName } = req.body;
    const sql = "UPDATE Employee SET Last_Name = ? WHERE E_id = ?";
    db.query(sql, [lastName, employeeId], (error) => {
        if (error) {
            return res.json({ message: "error found" });
        }
        return res.json({ message: "success" });
    });
}
const updateEmployeeAddress = async (req, res) => {
    const { employeeId } = req.params;
    const { address } = req.body;
    const sql = "UPDATE Employee SET Address = ? WHERE E_id = ?";
    db.query(sql, [address, employeeId], (error) => {
        if (error) {
            return res.json({ message: "error found" });
        }
        return res.json({ message: "success" });
    });
}
const updateEmployeeNic = async (req, res) => {
    const { employeeId } = req.params;
    const { Nic } = req.body;
    const sql = "UPDATE Employee SET NIC = ? WHERE E_id = ?";
    db.query(sql, [Nic, employeeId], (error) => {
        if (error) {
            return res.json({ message: "error found" });
        }
        return res.json({ message: "success" });
    });
}
const updateEmployeePhone = async (req, res) => {
    const { employeeId } = req.params;
    const { phone } = req.body;
    const sql = "UPDATE Employee_phone_number SET Phone_number = ? WHERE E_id = ?";
    db.query(sql, [phone, employeeId], (error) => {
        if (error) {
            return res.json({ message: "error found" });
        }
        return res.json({ message: "success" });
    });
}

const getEmp = async (req, res) => {
    const { Eid } = req.params;
    const sql = "SELECT * FROM Employee WHERE E_id = ? AND is_deleted = 0 ";
    db.query(sql, [Eid], (error, result) => {
        if (error) {
            return res.json({ message: "failed" })
        }
        return res.json(result);
    });
}

module.exports = { getEmp, addEmployee, getEmployee, updateEmployeefirstName, updateEmployeelastName, updateEmployeeAddress, updateEmployeeNic, updateEmployeePhone }