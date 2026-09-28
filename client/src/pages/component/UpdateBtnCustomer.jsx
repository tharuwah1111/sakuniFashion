import { useNavigate } from "react-router-dom";

function UpdateBtnCustomer({ cid }) {
    const navigate = useNavigate();
    return (
        <button onClick={() => { navigate(`/customer/update/${cid}`) }}>update</button>
    );
}

export default UpdateBtnCustomer;