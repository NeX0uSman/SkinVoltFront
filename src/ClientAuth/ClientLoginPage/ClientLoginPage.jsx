import React, { useState, useEffect, useContext } from 'react';
import cl from './ClientLoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { InventoryContext } from '../../Context/inventoryContext';
import { apiFetch } from '../../TOOLS/apiFetch/apiFetch';

const apiUrl = import.meta.env.VITE_API_URL;

const COLORS = ["#FF3C78", "#FF9A3C", "#3CFF9A",];
const WIDTH = window.innerWidth * 0.6;
const HEIGHT = 800;
const strokeWidth = 1.5;
const radius = WIDTH / 2 - strokeWidth - 10;

const SiriEffect = () => {
  return (
    <div className={cl.siriWrapper}>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        {COLORS.map((color, i) => {
          const r = radius - i * 15;
          const circumference = Math.PI * r;
          return (
            <circle
              key={i}
              cx={WIDTH / 2}
              cy={HEIGHT}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference * 1.5}
              className={cl.siriCircle}
              style={{
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${6 - i * 2}s`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

const ClientLoginPage = () => {
  const { fetchUserData } = useContext(InventoryContext)
  const navigate = useNavigate('')

  useEffect(() => {
    const clientToken = localStorage.getItem('clientToken');
    if (clientToken) {
      navigate('/client');
    }
  }, [])

  const [errors, setErrors] = useState([]);
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')


  const handleLogIn = async (e) => {
    e.preventDefault()

    try {
      const data = await apiFetch(`${apiUrl}/client/login/send`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });
      setErrors([]);
      console.log(data);
      fetchUserData(data.token)
      console.log('Login successful');
      localStorage.setItem('Nickname', data.name)
      localStorage.setItem('clientToken', data.token);
      navigate('/client');
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <SiriEffect />
      <div className={cl.wholePage}>
        <div className={cl.upperText}>
          <p>Sign into your account!</p>
        </div>
        <div className={cl.formDiv}>
          <form>
            {errors && <p>{errors.msg}</p>}
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e) => { setEmail(e.target.value) }} name="email" id="email" required />
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" name="password" id="password" required />
            <div className={cl.registerButton}>
              <button onClick={handleLogIn}>Log in!</button>
            </div>
          </form>
          <div className={cl.signInDiv}>
            <p>Don't have an account? <button onClick={() => { navigate('/client/register') }}>Sign up</button></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientLoginPage;
