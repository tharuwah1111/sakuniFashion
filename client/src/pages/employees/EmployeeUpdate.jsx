import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EmployeeUpdate() {
    const { Eid } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [Nic, setNic] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const updateFirstName = async (e) => {
        e.preventDefault();
        const uData = { firstName }
        const response = await fetch(`http://localhost:5000/employees/update/firstname/${Eid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uData)
        });
        const data = await response.json();
        if (data.message === "success") {
            alert("updated")
        }
    }
    const updateLastName = async (e) => {
        e.preventDefault();
        const uData = { lastName }
        const response = await fetch(`http://localhost:5000/employees/update/lastname/${Eid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uData)
        });
        const data = await response.json();
        if (data.message === "success") {
            alert("updated")
        }
    }
    const updateAddress = async (e) => {
        e.preventDefault();
        const uData = { address }
        const response = await fetch(`http://localhost:5000/employees/update/address/${Eid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uData)
        });
        const data = await response.json();
        if (data.message === "success") {
            alert("updated")
        }
    }
    const updateNic = async (e) => {
        e.preventDefault();
        const uData = { Nic }
        const response = await fetch(`http://localhost:5000/employees/update/nic/${Eid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uData)
        });
        const data = await response.json();
        if (data.message === "success") {
            alert("updated")
        }
    }
    const updatePhone = async (e) => {
        e.preventDefault();
        const uData = { phone }
        const response = await fetch(`http://localhost:5000/employees/update/phone/${Eid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uData)
        });
        const data = await response.json();
        if (data.message === "success") {
            alert("updated")
        }
    }
    return (
        <div>
            <h1>employee</h1>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} /><button onClick={updateFirstName}>update first Name</button><br />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => { setLastName(e.target.value) }} /><button onClick={updateLastName}>update last Name</button><br />
            <input type="text" placeholder="Address" value={address} onChange={(e) => { setAddress(e.target.value) }} /><button onClick={updateAddress}>update Address</button><br />
            <input type="text" placeholder="NIC" value={Nic} onChange={(e) => { setNic(e.target.value) }} /><button onClick={updateNic}> update NIC</button><br />
            <input type="tel" placeholder="Phone" value={phone} onChange={(e) => { setPhone(e.target.value) }} /><button onClick={updatePhone}>update phone</button><br />
            <button onClick={() => { navigate("/home") }}>Home</button>
            <button onClick={() => { navigate("/employee/search") }}>back</button>
        </div>
    );
}
export default EmployeeUpdate;