import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";

function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const data = await signup(email, password);
            console.log("Signup response:", data);
            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Signup successful!");
                navigate("/home");
            } else {
                alert(data.error || "Signup failed");
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Error signing up");
        }
    };


    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
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
                <button type="submit">Signup</button>
            </form>
            <p>
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
}

export default SignupPage;
