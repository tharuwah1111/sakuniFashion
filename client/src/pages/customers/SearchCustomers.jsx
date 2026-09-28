import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoBtn from '../component/InfoBtn';
import UpdateBtnCustomers from "../component/UpdateBtnCustomer"
import DeleteCustomers from "../component/DeleteCustomers"

function SearchCustomers() {

    const navigate = useNavigate();

    const [customerName, setCustomerName] = useState("");
    const [customers, setCustomers] = useState([]);

    const searchCustomers = async (e) => {

        e.preventDefault();

        const response = await fetch(
            "http://localhost:5000/customers/search",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: customerName
                })
            }
        );

        const data = await response.json();

        setCustomers(data);
    };

    return (
        <div>

            <h1>Search Customers</h1>

            <form onSubmit={searchCustomers}>

                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />

                <button type="submit">
                    Search Customer
                </button>

            </form>

            <div>

                {
                    customers.length === 0 ? (

                        <p>Customers didn't find</p>

                    ) : (

                        customers.map((customer) => {

                            return (
                                <div key={customer.C_id}>

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
                        })
                    )
                }

            </div>

            <div>

                <button onClick={() => navigate("/home")}>
                    Home
                </button>

                <button onClick={() => navigate("/customer")}>
                    Back
                </button>

            </div>

        </div>
    );
}

export default SearchCustomers;