import { useNavigate, useParams } from "react-router-dom";

function InfoBtnEmployee({ eid }) {
    const navigate = useNavigate();

    return (<button onClick={() =>
        navigate(
            `/employee/details/${eid}`
        )
    }>Info</button>)
}
export default InfoBtnEmployee;