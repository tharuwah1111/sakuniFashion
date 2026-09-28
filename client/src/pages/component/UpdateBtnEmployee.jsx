import { useNavigate } from "react-router-dom";

function UpdateBtnEmployee({ Eid }) {
    const navigate = useNavigate();
    return (
        <button onClick={() => { navigate(`/employee/update/${Eid}`) }}>update</button>
    );
}

export default UpdateBtnEmployee;