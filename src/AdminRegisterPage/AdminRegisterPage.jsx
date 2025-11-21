import React, { useState, useEffect } from 'react';
import cl from './AdminRegisterPage.module.css';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../TOOLS/apiFetch/apiFetch';

const COLORS = ["#FF3C78", "#FF9A3C", "#3CFF9A",];

const WIDTH = window.innerWidth * 0.6;
const HEIGHT = 800;

const strokeWidth = 1.5;
const radius = WIDTH / 2 - strokeWidth - 10;
const apiUrl = import.meta.env.VITE_API_URL;
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

const AdminRegisterPage = () => {

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

      } catch (err) {
        console.log('Error in adminregisterpage checkTokens() func', err)
      }
    }
    checkTokens()
  }, [])

  const [errors, setErrors] = useState([]);
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')


  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const data = await apiFetch(`${apiUrl}/admin/register/send`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          inviteCode: code
        }),
      });

        setErrors([]);
        console.log(data);
        navigate('/admin/login')

    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <SiriEffect />
      <div className={cl.wholePage}>
        <div className={cl.upperText}>
          <p>Register admin account</p>
          <p>*You can only register an account by getting a code for it.*</p>
        </div>
        <div className={cl.formDiv}>
          <form>
            <label htmlFor="nickname">Nickname</label>
            <input value={name} onChange={(e) => { setName(e.target.value) }} name="nickname" id="nickname" required />
            <label htmlFor="code">Code</label>
            <input value={code} onChange={(e) => { setCode(e.target.value) }} name="code" id="code" required />
            {errors && <p>{errors.msg}</p>}
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e) => { setEmail(e.target.value) }} name="email" id="email" required />
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" name="password" id="password" required />
            <div className={cl.registerButton}>
              <button onClick={handleRegister}>Register</button>
            </div>
          </form>
          <div className={cl.signInDiv}>
            <p>Already an Admin?<button onClick={() => { navigate('/admin/login') }}>Sign in</button></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegisterPage;
