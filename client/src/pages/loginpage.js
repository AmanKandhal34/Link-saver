import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (data.token) {
                localStorage.setItem("token", data.token); // save token
                alert("Login successful!");
                navigate("/home");
            } else {
                alert("Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            alert("Error logging in");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Login</button>
            </form>
            <p>
                Don’t have an account? <a href="/signup">Signup here</a>
            </p>
        </div>
    );
}

export default LoginPage;
