const express = require("express");

const { createCustomer, deleteCustomer, getCustomers, updateCustomer, searchCustomer, showCustomer } = require("../customer/customer");

const { isLogin, login, logOut } = require("../login/login")

const { addEmployee, getEmp, updateEmployeefirstName, updateEmployeelastName, updateEmployeeAddress, updateEmployeeNic, updateEmployeePhone, getEmployee } = require("../employee/employee")

const router = express.Router();

//login routes
router.post("/login", login);
router.get("/logout", logOut);

//customer routes
router.get("/customers", showCustomer);
router.get("/customers/:id", getCustomers);
router.post("/customers/add", createCustomer);
router.put("/customers/details/update/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);
router.post("/customers/search", searchCustomer);

//employee routes
router.post("/employees/add", addEmployee);
router.get("/employees", getEmployee);
router.put("/employees/update/firstname/:employeeId", updateEmployeefirstName);
router.put("/employees/update/lastname/:employeeId", updateEmployeelastName);
router.put("/employees/update/address/:employeeId", updateEmployeeAddress);
router.put("/employees/update/nic/:employeeId", updateEmployeeNic);
router.put("/employees/update/phone/:employeeId", updateEmployeePhone);
router.get("/employees/:Eid", getEmp);

module.exports = router;