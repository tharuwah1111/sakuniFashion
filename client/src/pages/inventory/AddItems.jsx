import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddItems() {
    const navigate = useNavigate();
    const [itemName, setItemName] = useState("");
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);

    return (
        <div>
            <h1>inventory</h1>
            <p>add ne items</p>

            <form>

                <input type="text" placeholder="item name" />
                <input type="number" placeholder="Quantity" />
                <input type="number" placeholder="price" />
                <button type="submit">Add Item</button>
            </form>

            <button onClick={() => { navigate("/home") }}>home</button>
            <button onClick={() => { navigate("/inventory") }}>back</button>
        </div>
    );

}

export default AddItems;