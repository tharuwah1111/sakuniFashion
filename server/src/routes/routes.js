const express = require("express");

const { createCustomer, deleteCustomer, getCustomers, updateCustomer, searchCustomer, showCustomer } = require("../customer/customer");

const { isLogin, login, logOut } = require("../login/login")

const { addEmployee, getEmp, updateEmployeefirstName, updateEmployeelastName, updateEmployeeAddress, updateEmployeeNic, updateEmployeePhone, getEmployee } = require("../employee/employee")

const { viewTask, createTasks, assignTask, completeTask, viewTaskOrder } = require("../task/task")

const { createNewOrder, deleteOrder } = require("../order/order");

const { updateProductId, updateQuantity, updateNotes, viewOrderItems } = require("../order/order_items");

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

//task routes
router.post("/task/create", createTasks);
router.get("/task/:Task_id", viewTask);
router.put("/task/:Task_id", assignTask);
router.put("/task/:Task_id", completeTask);
router.get("task/:Order_id", viewTaskOrder);

//order routes
router.post("/order/", createNewOrder);
router.delete("/order/:Order_id", deleteOrder);
router.patch("/order/:Item_id", updateProductId);
router.patch("/order/:Item_id", updateQuantity);
router.patch("/order/:Item_id", updateNotes);
router.get("/order/:Order_id", viewOrderItems);

module.exports = router;