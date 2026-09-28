import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoBtnEmployee from "../component/InfoBtnEmployee"
import DeleteBtnEmployee from "../component/DeleteBtnEmployee"
import UpdateBtnEmployee from "../component/UpdateBtnEmployee"


function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);

    const getEmp = async () => {
        const response = await fetch("http://localhost:5000/employees");
        const data = await response.json();
        setEmployees(data);
    }

    useEffect(() => {
        getEmp();
    }, []);

    return (
        <div>
            <h1> Employees</h1>
            <div>
                {
                    employees.length === 0 ? (

                        <p>employeess didnt find</p>) :
                        (employees.map((employee) => {
                            return (
                                <div>
                                    <ul>
                                        <li>{employee.fullName}</li>
                                        <li>{employee.First_name}</li>
                                        <li>{employee.Last_Name}</li>
                                        <InfoBtnEmployee eid={employee.E_id} />
                                        <DeleteBtnEmployee eid={employee.E_id} />
                                        <UpdateBtnEmployee Eid={employee.E_id} />
                                    </ul>

                                </div>

                            );
                        }))

                }
            </div>
            <div>
                <button onClick={() => { navigate("/home") }}>Home</button>
                <button onClick={() => { navigate("/employee") }}>Back</button>
            </div>
        </div>
    )
}
export default EmployeeList;