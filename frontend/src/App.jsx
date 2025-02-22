import { useState } from 'react';
import axios from 'axios';

function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    // Handle Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:5000/register', formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Registration failed');
        }
    };

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            setUser(response.data);
            setMessage('Login successful');
        } catch (error) {
            setMessage('Invalid email or password');
        }
    };

    // Download User Details
    const downloadDetails = () => {
        const element = document.createElement('a');
        const file = new Blob([JSON.stringify(user, null, 2)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${user.name}_details.txt`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-4">User Registration & Login</h1>

            <form onSubmit={handleRegister} className="mb-4">
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit">Register</button>
            </form>

            <form onSubmit={handleLogin} className="mb-4">
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>

            {message && <p>{message}</p>}

            {user && (
                <div className="mt-4">
                    <h2>Welcome, {user.name}</h2>
                    {user.image && <img src={`http://localhost:5000${user.image}`} alt="User" width="100" />}
                    <p>Email: {user.email}</p>
                    <button onClick={downloadDetails}>Download Details</button>
                </div>
            )}
        </div>
    );
}

export default App;
