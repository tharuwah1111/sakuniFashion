import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoBtn from '../component/InfoBtn';
import UpdateBtnCustomers from "../component/UpdateBtnCustomer"
import DeleteCustomers from "../component/DeleteCustomers"


function ShowCustomers() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);

    const getCustomers = async () => {
        const response = await fetch("http://localhost:5000/customers");
        const data = await response.json();
        setCustomers(data);
    }

    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <div>
            <h1> Customers</h1>
            <div>
                {
                    customers.length === 0 ? (

                        <p>customers didnt find</p>) :
                        (customers.map((customer) => {
                            return (
                                <div>
                                    <ul>
                                        <li>{customer.uname}</li>
                                        <li>{customer.First_Name}</li>
                                        <li>{customer.Last_Name}</li>
                                    </ul>

                                    <DeleteCustomers cid={customer.C_id} />
                                    <InfoBtn cid={customer.C_id} />
                                    <UpdateBtnCustomers id={customer.C_id} />
                                </div>

                            );
                        }))

                }
            </div>
            <div>
                <button onClick={() => { navigate("/home") }}>Home</button>
                <button onClick={() => { navigate("/customer") }}>Back</button>
            </div>
        </div>
    )
}
export default ShowCustomers;