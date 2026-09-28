import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteCustomers from '../component/DeleteCustomers';
import UpdateBtnCustomers from '../component/UpdateBtnCustomer';

function ShowDetails() {

    const navigate = useNavigate();

    const { cid } = useParams();

    const [customer, setCustomer] = useState();

    const showDetails = async () => {

        const response = await fetch(
            `http://localhost:5000/customers/${Eid}`
        );

        const data = await response.json();


        setCustomer(data[0]);
    };

    useEffect(() => {
        showDetails();
    }, []);

    if (!customer) {
        return <p>Loading...</p>;
    }

    return (
        <div>

            <h1>{customer.uname}</h1>

            <div>

                <p>First Name: {customer.First_Name}</p>
                <p>Last Name: {customer.Last_Name}</p>

                <p>Arm Length: {customer.Arm_Length}</p>
                <p>Point: {customer.Point}</p>
                <p>Arm End: {customer.Arm_end}</p>
                <p>B Iirst: {customer.B_irst}</p>
                <p>Neck Width: {customer.Neck_width}</p>
                <p>Arm Hole: {customer.Arm_hole}</p>
                <p>Back Height: {customer.Back_height}</p>
                <p>Neck Length: {customer.Neck_length}</p>
                <p>Back Neck Length: {customer.Back_neck_length}</p>
                <p>Waist: {customer.Waist}</p>
                <p>Arm: {customer.Arm}</p>
                <p>B Neck Width: {customer.B_neck_width}</p>
                <p>Under Bra: {customer.Under_bra}</p>
                <p>Side Slim: {customer.Side_slim}</p>
                <p>Shoulder to Under Bra: {customer.Sh_to_under_bra}</p>
                <p>Shoulder to Point: {customer.Sho_to_point}</p>
                <p>F First: {customer.F_first}</p>
                <p>Shoulder: {customer.Shoulder}</p>
                <p>Shoulder to Waist: {customer.sh_to_waist}</p>

                <DeleteCustomers cid={customer.C_Id} />
                <UpdateBtnCustomers cid={customer.C_Id} />

            </div>

            <div>

                <button onClick={() => navigate("/home")}>
                    Home
                </button>

                <button onClick={() => navigate("/customer/search")}>
                    Back
                </button>

            </div>

        </div>
    );
}

export default ShowDetails;