import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    // Axios ke sath credentials (cookies) bhejna zaroori hai
    axios.defaults.withCredentials = true;

   const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://todo-list-77ma.onrender.com/login', { email, password })
        .then(res => {
            if(res.data.status === "Success") {
                navigate('/home'); // SUCCESS: Home page par bhej do
            } else {
                alert(res.data);
            }
        })
        .catch(err => console.log(err));
}

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                    <button type="submit" style={btnStyle}>Login</button>
                </form>

                {/* Ye content 'cardStyle' ke andar rahega toh achha dikhega */}
                <p style={{marginTop: '15px'}}>Don't have an account?</p>
                <Link to="/" style={{color: 'white', fontWeight: 'bold', textDecoration: 'none'}}>
                    Register Now
                </Link>
            </div>
        </div>
    );
}
// (Styles same as Signup)
const containerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#2c3e50' };
const cardStyle = { padding: '30px', borderRadius: '15px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white', textAlign: 'center' };
const inputStyle = { display: 'block', margin: '10px auto', padding: '10px', width: '250px', borderRadius: '5px', border: 'none' };
const btnStyle = { padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Login;