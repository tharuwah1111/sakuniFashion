import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InventoryHome() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Inventory</h1>
            <button onClick={() => { navigate("/inventory/add") }}>Add new Items</button>
            <button onClick={() => { navigate("/inventory/details") }}>Visit Items</button>
            <div>
                <button onClick={() => { navigate("/home") }}>Home</button>
                <button onClick={() => { navigate("/home") }}>back</button>
            </div>
        </div>
    );
}
export default InventoryHome;