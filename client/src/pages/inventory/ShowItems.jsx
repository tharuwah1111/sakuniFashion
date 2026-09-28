import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ShowItems() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    return (

        <div>
            <h1>item list</h1>
            {
                items.length === 0 ?
                    <h2>no items</h2> :
                    items.map((item) => {
                        return (
                            <div>
                                <ul>
                                    <li>{item.itemId}</li>
                                    <li>{item.itemName}</li>
                                    <li>{item.qty}</li>
                                    <li>{item.price}</li>
                                </ul>
                                <input type="number" placeholder="enter qty" /><button>add qty</button>
                                <input type="number" placeholder="enter qty" /><button>remove qty</button>
                            </div>
                        )
                    })
            }
            <div>
                <button onClick={() => { navigate("/home") }}>Home</button>
                <button onClick={() => { navigate("/inventory") }}>Back</button>
            </div>
        </div>
    );
}

export default ShowItems;