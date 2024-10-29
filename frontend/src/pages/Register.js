import { useState } from "react";
import { useRegister } from "../hooks/useRegister";

const Register = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const { register, error, isLoading } = useRegister();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await register(email, name, password);
    };

    return (
        <form className="register" onSubmit={handleSubmit}>
            <h3>Register</h3>
            <label>Email</label>
            <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label>Name</label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
            />

            <label>Password</label>
            <input
                type="text"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <button disabled={isLoading}>Register</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default Register;
