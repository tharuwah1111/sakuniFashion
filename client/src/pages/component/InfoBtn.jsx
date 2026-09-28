import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function InfoBtn({ cid }) {
    const navigate = useNavigate();

    return (<button onClick={() =>
        navigate(
            `/customer/${cid}`
        )
    }>info</button>)
}
export default InfoBtn;