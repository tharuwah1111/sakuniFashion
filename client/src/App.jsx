import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import CustomerHome from "./pages/customers/CustomerHome"
import ShowCustomers from "./pages/customers/ShowCustomers";
import AddCustomers from "./pages/customers/AddCustomers"
import SearchCustomers from "./pages/customers/SearchCustomers";
import ShowDetails from "./pages/customers/ShowDetails";
import UpdateCustomers from "./pages/customers/UpdateCustomers";
import Login from "./pages/login/Login"
import EmployeeAdd from "./pages/employees/EmployeeAdd";
import EmployeeUpdate from "./pages/employees/EmployeeUpdate";
import EmployeeHome from "./pages/employees/EmployeeHome";
import EmployeeSearch from "./pages/employees/EmployeeSearch"
import EmployeeDetails from "./pages/employees/EmployeeDetails";
import EmployeeList from "./pages/employees/EmployeeList";
import AddItems from "./pages/inventory/AddItems";
import InventoryHome from "./pages/inventory/InventoryHome";
import ShowItems from "./pages/inventory/ShowItems";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/customer/all" element={<ShowCustomers />} />
        <Route path="/customers/add" element={<AddCustomers />} />
        <Route path="/customer/search" element={<SearchCustomers />} />
        <Route path="/customer/:cid" element={<ShowDetails />} />
        <Route path="/customer/update/:id" element={<UpdateCustomers />} />
        <Route path="/employee" element={<EmployeeHome />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employee/add" element={<EmployeeAdd />} />
        <Route path="/employee/search" element={<EmployeeSearch />} />
        <Route path="/employee/details/:Eid" element={<EmployeeDetails />} />
        <Route path="/employee/update/:Eid" element={<EmployeeUpdate />} />
        <Route path="/inventory" element={<InventoryHome />} />
        <Route path="/inventory/add" element={<AddItems />} />
        <Route path="/inventory/details" element={<ShowItems />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;