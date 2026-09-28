import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoBtnEmployee from "../component/InfoBtnEmployee"
import DeleteBtnEmployee from "../component/DeleteBtnEmployee"
import UpdateBtnEmployee from "../component/UpdateBtnEmployee"

function SearchEmployees() {
    const navigate = useNavigate();
    const [employeeName, setEmployeeName] = useState("");
    const [employees, setEmployees] = useState([]);

    const getEmployee = async (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <h1>Search Customers</h1>
            <form>
                <input type="text" placeholder="Employee Name" value={employeeName} onChange={(e) => { setEmployeeName(e.target.value) }} />
                <button type="submit">Search Customer</button>
            </form>
            <div>
                {
                    employees.length === 0 ? (

                        <p>employers didnt find</p>) :
                        (employees.map((employee) => {
                            return (
                                <div>
                                    <ul>
                                        <li>{employee.name}</li>
                                        <li>{employee.Firstname}</li>
                                        <li>{employee.Lastname}</li>
                                        <li>{employee.phone}</li>
                                        <InfoBtnEmployee eid={employee.E_id} />
                                        <DeleteBtnEmployee eid={employee.E_id} />
                                        <UpdateBtnEmployee eid={employee.E_id} />
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
export default SearchEmployees;