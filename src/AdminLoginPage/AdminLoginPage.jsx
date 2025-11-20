import React, { useState, useEffect } from 'react';
import cl from './AdminLoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../TOOLS/apiFetch/apiFetch';

const COLORS = ["#ffffffff", "#7c7c7cff", "#000000ff",];
const apiUrl = import.meta.env.VITE_API_URL;
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

  const navigate = useNavigate('')

  useEffect(() => {
    const checkTokens = async () => {
      try {
        const data = await apiFetch(`${apiUrl}/admin/verify`, {
          method: 'GET'
        })

        if (data?.message == 'Failed to authenticate the token') {
          localStorage.removeItem('adminToken')
          return
        }

        navigate('/admin')
      } catch (err) {
        console.log('Error in adminloginpage checkTokens() func', err)
      }
    }
    checkTokens()
  }, [])

  const [errors, setErrors] = useState([]);
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')


  const handleLogIn = async (e) => {
    e.preventDefault()

    try {
      const data = await apiFetch(`${apiUrl}/admin/login/send`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });
        setErrors([]);
        console.log('Login successful');
        localStorage.setItem('adminToken', data.token);
        navigate('/client');
      
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <SiriEffect />
      <div className={cl.wholePage}>
        <div className={cl.upperText}>
          <p>Hi, Admin!</p>
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
            <p>Contact us if you are an admin and <u>don't have an account yet</u></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientLoginPage;
