import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteBtnEmployee from "../component/DeleteBtnEmployee";
import UpdateBtnEmployee from "../component/UpdateBtnEmployee";

function EmployeeDetails() {

    const { Eid } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState();

    const getEmployee = async () => {

        const response = await fetch(
            `http://localhost:5000/employees/${Eid}`
        );

        const data = await response.json();

        setEmployee(data[0]);
    };

    useEffect(() => {
        getEmployee();
    }, []);

    if (!employee) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>

            <h1>Employee {employee.First_name}</h1>

            <ul>
                <li>{employee.First_name}</li>
                <li>{employee.Last_Name}</li>
                <li>{employee.NIC}</li>
                <li>{employee.Address}</li>
            </ul>

            <DeleteBtnEmployee eid={employee.E_id} />

            <UpdateBtnEmployee Eid={employee.E_id} />

            <div>

                <button onClick={() => navigate("/home")}>
                    Home
                </button>

                <button onClick={() => navigate("/employee")}>
                    Back
                </button>

            </div>

        </div>
    );
}

export default EmployeeDetails;
