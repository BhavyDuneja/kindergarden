import React, { useState } from 'react';
import axios from 'axios';
import '../Styling/register.css';
import Navbar from '../component/navbar';

const RegisterScreen = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (role && name && email && password) {
      try {
        const response = await axios.post('http://localhost:3001/register', {
          role,
          name,
          email,
          password,
          phoneNumber,
        });

        setMessage(response.data); 
      } catch (error) {
        setMessage('登録中にエラーが発生しました');
      }
    } else {
      setMessage('すべての必須フィールドに入力してください。');
    }
  };

  return (
    
    <div>
      <Navbar/>
      <h2>登録</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>役割:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">役割を選択</option>
            <option value="teacher">教師 </option>
            <option value="parent"> 親    </option>
            <option value="admin">  管理者 </option>
          </select>
        </div>
        <div>
          <label>名前:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="お名前を入力してください"
          />
        </div>
        <div>
          <label>メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力してください"
          />
        </div>
        <div>
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力してください"
          />
        </div>
        <div>
          <label>電話番号:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="電話番号を入力してください"
          />
        </div>
        <button type="submit">登録</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterScreen;
