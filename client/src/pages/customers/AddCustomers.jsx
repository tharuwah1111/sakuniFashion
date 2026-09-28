import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCustomers() {

    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");

    const onHandle = async (e) => {

        e.preventDefault();

        const customerData = {
            fullName,
            firstName,
            lastName,
            phone
        }
        const response = await fetch("http://localhost:5000/customers/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customerData)
        });
        const data = await response.json();
        if (data.isCreated) {
            alert("create successfully")
        }
    };

    return (
        <div>
            <h1>Add Customers</h1>
            <form onSubmit={onHandle}>
                <input type="text" name="" id="" placeholder="First Name" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
                <input type="text" name="" id="" placeholder="Last Name" value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
                <input type="text" name="" id="" placeholder="Full Name" value={fullName} onChange={(e) => { setFullName(e.target.value) }} />
                <input type="tel" name="" id="" placeholder="Phone Number" value={phone} onChange={(e) => { setPhone(e.target.value) }} />
                <button type="submit">Add Customers</button>
            </form>
            <div>
                <button onClick={() => { navigate("/home") }}>Home</button>
                <button onClick={() => { navigate("/customer") }}>Back</button>
            </div>
        </div>
    );
}

export default AddCustomers;