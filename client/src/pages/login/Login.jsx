import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const onHandle = async (e) => {

        e.preventDefault();

        const loginData = {
            userName,
            password
        };

        const response = await fetch(
            "http://localhost:5000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            }
        );

        const data = await response.json();

        if (data.login) {
            navigate("/home");
        } else {
            alert(data.message);
            alert(data.error);
        }
    };

    return (
        <div>

            <h1>Welcome to Sakuni Fashion</h1>

            <form onSubmit={onHandle}>

                <input
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => {
                        setUserName(e.target.value);
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;
