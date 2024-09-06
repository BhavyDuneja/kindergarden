import React, { useState } from 'react';
import '../Styling/Login.css';  // Import the CSS file
import Navbar from '../component/navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === '' || password === '') {
            setErrorMessage('メールアドレスとパスワードを入力してください。');
        } else if (email === 'admin@example.com' && password === 'password123') {
            setErrorMessage('ログイン成功！');
        } else {
            setErrorMessage('無効なメールアドレスまたはパスワードです。');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <Navbar/>
                <h2>ログイン</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="メールアドレスを入力してください"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="パスワードを入力してください"
                            required
                        />
                    </div>
                    <button type="submit">サインイン</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Login;
