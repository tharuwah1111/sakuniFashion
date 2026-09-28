import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEmployees() {

    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [Nic, setNic] = useState("");

    const onHandle = async (e) => {
        e.preventDefault();
        const employeeData = {
            fullName, firstName, lastName, phone, address, Nic
        }
        const response = await fetch("http://localhost:5000/employees/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employeeData)
        })
        const data = await response.json();
        if (data.addedd) {
            alert("success");
            setFullName("");
            setAddress("");
            setFirstName("");
            setLastName("");
            setNic("");
            setPhone("");
        }
    }

    return (
        <div>
            <h1>Add Customers</h1>
            <form onSubmit={onHandle}>
                <input type="text" name="" id="" placeholder="First Name" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
                <input type="text" name="" id="" placeholder="Last Name" value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
                <input type="text" name="" id="" placeholder="Full Name" value={fullName} onChange={(e) => { setFullName(e.target.value) }} />
                <input type="text" name="" id="" placeholder=" address" value={address} onChange={(e) => { setAddress(e.target.value) }} />
                <input type="text" name="" id="" placeholder="NIC number" value={Nic} onChange={(e) => { setNic(e.target.value) }} />
                <input type="tel" name="" id="" placeholder="Phone Number" value={phone} onChange={(e) => { setPhone(e.target.value) }} />
                <button type="submit">Add Customers</button>
            </form>
            <div>
                <button onClick={() => { navigate("/home") }}>Home</button>
                <button onClick={() => { navigate("/employee") }}>Back</button>
            </div>
        </div>
    );
}

export default AddEmployees;