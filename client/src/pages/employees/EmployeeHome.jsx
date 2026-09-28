import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeHome() {

    const navigate = useNavigate();

    return (
        <div>
            <h1>Employee home</h1>

            <button onClick={() => { navigate("/employee/add") }}>Add Employees</button>
            <button onClick={() => { navigate("/employees") }}> Employees</button>
            <button onClick={() => { navigate("/employee/search") }}>Search Employees</button>
            <div>
                <button onClick={() => { navigate("/home") }}>Home</button>
            </div>
        </div>
    );
}

export default EmployeeHome;