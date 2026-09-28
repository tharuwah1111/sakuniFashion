import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateCustomers() {
    const navigate = useNavigate();
    const { customerid } = useParams();

    const [firstName, setFirstName] = useState("");;
    const [lastName, setLastName] = useState("");;
    const [fullName, setFullName] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");

    const [Arm_Length, setArm_Length] = useState(0);
    const [Point, setPoint] = useState(0);
    const [Arm_end, setArm_end] = useState(0);
    const [B_irst, setB_irst] = useState(0);
    const [Neck_width, setNeck_width] = useState(0);
    const [Arm_hole, setArm_hole] = useState(0);
    const [Back_height, setBack_height] = useState(0);
    const [Neck_length, setNeck_length] = useState(0);
    const [Back_neck_length, setBack_neck_length] = useState(0);
    const [Waist, setWaist] = useState(0);
    const [Arm, setArm] = useState(0);
    const [B_neck_width, setB_neck_width] = useState(0);
    const [Under_bra, setUnder_bra] = useState(0);
    const [Side_slim, setSide_slim] = useState(0);
    const [Sh_to_under_bra, setSh_to_under_bra] = useState(0);
    const [Sho_to_point, setSho_to_point] = useState(0);
    const [F_first, setF_first] = useState(0);
    const [Shoulder, setShoulder] = useState(0);
    const [sh_to_waist, setSh_to_waist] = useState(0);

    return (
        <div>
            <h1>Update customer details</h1>
            <div>
                <ul>
                    <li>first name <input type='text' placeholder="new first name" /> <button>update</button> </li>
                    <li>last name <input type='text' placeholder="new last name" /> <button>update</button></li>
                    <li>phone number <input type='text' placeholder="new phone number" /> <button>update</button></li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>Arm length <input type='number' placeholder="new Arm length" /> <button>update</button> </li>
                    <li>Point<input type='number' placeholder="new Point" /> <button>update</button></li>
                    <li>Arm end<input type='number' placeholder="new Arm end" /> <button>update</button></li>
                    <li>B irst<input type='number' placeholder="new B irst" /> <button>update</button></li>
                    <li>neck width<input type='number' placeholder="new Neck width" /> <button>update</button></li>
                    <li>arm hole<input type='number' placeholder="new Arm hole" /> <button>update</button></li>
                    <li>back height<input type='number' placeholder="new back height" /> <button>update</button></li>
                    <li>neck length<input type='number' placeholder="new neck length" /> <button>update</button></li>
                    <li>back neck length<input type='number' placeholder="new back neck length" /> <button>update</button></li>
                    <li>waist<input type='number' placeholder="new waist" /> <button>update</button></li>
                    <li>arm<input type='number' placeholder="new Arm " /> <button>update</button></li>
                    <li>b neck width<input type='number' placeholder="new B neck width" /> <button>update</button></li>
                    <li>under bra<input type='number' placeholder="new under bra" /> <button>update</button></li>
                    <li>side slim<input type='number' placeholder="new side slim" /> <button>update</button></li>
                    <li>sh to under bra<input type='number' placeholder="new sh to under bra" /> <button>update</button></li>
                    <li>sho to point<input type='number' placeholder="new sho to point" /> <button>update</button></li>
                    <li>f first<input type='number' placeholder="new f first" /> <button>update</button></li>
                    <li>shoulder<input type='number' placeholder="new shoulder" /> <button>update</button></li>
                    <li>sh to waist<input type='number' placeholder="new sh to waist" /> <button>update</button></li>
                </ul>
            </div>
            <div>
                <button onClick={() => { navigate("/home") }}>Home</button>
                <button onClick={() => { navigate("/customer/search") }}>Back</button>
            </div>
        </div>
    );
}

export default UpdateCustomers;