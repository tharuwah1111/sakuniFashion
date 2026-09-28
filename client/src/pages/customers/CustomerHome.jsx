import { useNavigate } from "react-router-dom";

function CustomerHome() {
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={() => { navigate("/customers/add") }}>Add Customers</button>
            <button onClick={() => { navigate("/customer/search") }}>Customer Details</button>
            <button onClick={() => { navigate("/customer/all") }}>Customers</button>
            <button onClick={() => { navigate("/home") }}>Home</button>
            <button onClick={() => { navigate("/home") }}>Back</button>
        </div>
    );
}

export default CustomerHome;