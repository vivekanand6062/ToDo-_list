import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://todo-list-77ma.onrender.com/register', { name, email, password })
            .then(res => {
                navigate('/login'); // Signup ke baad Login page par bhej do
            })
            .catch(err => console.log(err));
    }

    

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} style={inputStyle} />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                    <button type="submit" style={btnStyle}>Register</button>
                </form>
                <p>Already have an account?</p>
                <Link to="/login" style={{color: 'white'}}>Login</Link>
            </div>
        </div>
    );
}

// Inline Styles (Glassmorphism look)
const containerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#2c3e50' };
const cardStyle = { padding: '30px', borderRadius: '15px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white', textAlign: 'center' };
const inputStyle = { display: 'block', margin: '10px auto', padding: '10px', width: '250px', borderRadius: '5px', border: 'none' };
const btnStyle = { padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Signup;