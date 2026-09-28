import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <button>Appointment</button>
            <button onClick={() => { navigate("/customer") }}>Customers</button>
            <button onClick={() => { navigate("/employee") }}>Employee</button>
            <button onClick={() => { navigate("/inventory") }}>Inventory</button>
            <button>Order</button>
            <button>Task</button>
            <button onClick={() => { navigate("/login") }}>Log Out</button>
        </div>
    );
}
export default Home;