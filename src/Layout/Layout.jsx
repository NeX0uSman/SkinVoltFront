import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import cl from './Layout.module.css'
import { InventoryContext } from '../Context/inventoryContext';
import buyForm from '../hooks/buyItem';
import logo from '../assets/logo2.png'

const Layout = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [name, setName] = useState('')
    const [balance, setBalance] = useState(0)
    const [userSkins, setUserSkins] = useState([]);
    const [allSkins, setAllSkins] = useState([]);
    const [userData, setUserData] = useState({});
    const apiUrl = import.meta.env.VITE_API_URL;
    const fetchUserData = async (tokenFromLogin) => {
        const token = tokenFromLogin || localStorage.getItem('clientToken');
        if (!token) return;

        try {
            const res = await fetch(`${apiUrl}/client/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                // токен просрочен или невалидный
                localStorage.removeItem('clientToken');
                return;
            }

            const data = await res.json();
            setLoggedIn(true);
            setName(data.username || localStorage.getItem('Nickname'));
            setBalance(data.balance);
            setUserData(data);

            if (data.inventory?.length > 0) {
                const resSkins = await fetch(`${apiUrl}/skins/getByIds`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: data.inventory })
                });
                const skinsData = await resSkins.json();
                setUserSkins(skinsData);
            } else {
                setUserSkins([]);
            }

        } catch (err) {
            console.log("Error fetching user data: ", err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    console.log(name)
    const buyItem = async (skinId, salePrice) => {
        try {
            const res = await buyForm(skinId, salePrice);
            if (res.success && res) {
                const userRes = await fetch(`${apiUrl}/client/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('clientToken')}`
                    }
                });
                const userData = await userRes.json();

                setBalance(userData.balance);
                setUserSkins(userData.inventory || []);
                console.log(userSkins, 'updated user skins after purchase');
                setAllSkins(prev => prev.filter(s => s._id !== skinId));
            }
        } catch (err) {
            console.log(err)
        }
    }

    const logout = () => {
        setLoggedIn(false);
        setName('');
        setBalance(0);
        setUserSkins([]);
        setAllSkins([]);
        localStorage.removeItem('clientToken');
        localStorage.removeItem('username');
    };

    const unList = async (skinId) => {
        try {
            const res = await fetch(`${apiUrl}/skins/unlist/${skinId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('clientToken')}`
                }
            })
            const data = await res.json();
            console.log(data, 'unlisting skin response');
        } catch (err) {
            console.log(err, 'error unlisting skin')
        }
    }

    const List = async (skinId, skinPrice) => {
        try {
            const res = await fetch(`${apiUrl}/skins/list/${skinId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('clientToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ price: skinPrice })
            })
            const data = await res.json();
            console.log(data, 'listing skin response');
        } catch (err) {
            console.log(err, 'error unlisting skin')
        }
    }
    const itemColourDefiner = (rarity) => {
        switch (rarity) {
            case 'Consumer Grade':
                return {

                    borderBottom: '2px solid #b0c3d9',
                };
            case 'Industrial Grade':
                return {

                    borderBottom: '2px solid #5e98d9',
                };
            case 'Mil-Spec':
                return {

                    borderBottom: '2px solid #4b69ff',
                };
            case 'Restricted':
                return {

                    borderBottom: '2px solid #8847ff',
                };
            case 'Classified':
                return {

                    borderBottom: '2px solid #d32ce6',
                };
            case 'Covert':
                return {

                    borderBottom: '2px solid #eb4b4b',
                };
            case 'Exceedingly Rare':
                return {

                    borderBottom: '2px solid #ffd700',
                };
            case 'Contraband':
                return {

                    borderBottom: '2px solid #cf6a32',
                };
            default:
                return {

                    borderBottom: '2px solid black',
                };
        }
    };
    const navigate = useNavigate('')
    return (
        <div className={cl.Layout}>
            <div className={cl.navBar}>
                <img src={logo} alt="logo" style={{ objectFit: 'contain', width: '400px', height: '60px' }} />
                <nav className={cl.navBar_inner}>
                    <i className="ph ph-line-vertical" style={{ color: 'white', fontSize: '35px' }}></i>
                    <button onClick={() => { navigate('/') }}>Landing</button>
                    <i className="ph ph-line-vertical" style={{ color: 'white', fontSize: '35px' }}></i>
                    <button onClick={() => { navigate('/client') }}>Marketplace</button>
                    <i className="ph ph-line-vertical" style={{ color: 'white', fontSize: '35px' }}></i>
                    <button onClick={() => { navigate('/admin') }}>Admin Page</button>
                    <i className="ph ph-line-vertical" style={{ color: 'white', fontSize: '35px' }}></i>
                    <button onClick={() => { navigate('/clientInventory') }}>Inventory</button>
                    <i className="ph ph-line-vertical" style={{ color: 'white', fontSize: '35px' }}></i>
                    <div className={cl.userInfo}>
                        {loggedIn ?

                            <>
                                <div className={cl.row}>
                                    <p style={{ color: 'white' }}>{`${balance}$`}</p>
                                    <p style={{ color: 'orange' }}>{name}</p>
                                    <i className="ph ph-user" style={{ color: 'white', fontSize: '35px' }}></i>
                                    <button onClick={logout}><i style={{ color: 'white', fontSize: '25px' }} className="ph ph-sign-out"></i></button>
                                </div>
                            </>

                            :

                            <>
                                <button onClick={() => { navigate('/client/login') }} >Sign In</button>
                                <button onClick={() => { navigate('/client/register') }} className={cl.sign_up}>Sign up</button>
                                <i className="ph ph-user" style={{ color: 'white', fontSize: '35px' }}></i>
                            </>
                        }
                    </div>
                </nav>
            </div>
            <main>
                <InventoryContext.Provider value={{
                    balance,
                    setBalance,
                    userSkins,
                    setUserSkins,
                    allSkins,
                    setAllSkins,
                    buyItem,
                    userData,
                    setUserData,
                    unList,
                    List,
                    itemColourDefiner,
                    fetchUserData
                }}>
                    <Outlet />
                </InventoryContext.Provider>

            </main>
            <footer>
                <section className={cl.footer_left}>
                    <div className={cl.footer_left_inner}>
                        <p>We can also bring <sup>(skins)</sup> right to your email!</p>
                        <h1>Sign up for our<br />
                            notifications.</h1>
                        <button>Subscribe</button>
                    </div>
                </section>
                <section className={cl.footer_right}>
                    <div className={cl.footer_upper}>
                        <div className={cl.footer_section}>
                            <h3>Company</h3>
                            <p>About us</p>
                            <p>Blog</p>
                            <p>Partnerships</p>
                            <p>Career</p>
                            <p>Press</p>
                        </div>
                        <div className={cl.footer_section}>
                            <h3>Services</h3>
                            <p>Marketplace</p>
                            <p>Price Tracking</p>
                            <p>Notifications</p>
                        </div>
                        <div className={cl.footer_section}>
                            <h3>Contact us</h3>
                            <p>Email: info@company.com</p>
                            <p>Phone: +48 123 456 789</p>
                            <p>Address: Warsaw, Poland</p>
                            <p onClick={() => { navigate('/admin/login') }}>Admin?</p>
                        </div>
                    </div>
                    <div className={cl.socials}>
                        <i className="ph ph-facebook-logo" style={{ fontSize: '45px' }}></i>
                        <i className="ph ph-instagram-logo" style={{ fontSize: '45px' }}></i>
                        <i className="ph ph-twitter-logo" style={{ fontSize: '45px' }}></i>
                        <i className="ph ph-discord-logo" style={{ fontSize: '45px' }}></i>
                        <i className="ph ph-github-logo" style={{ fontSize: '45px' }}></i>
                    </div>
                </section>
            </footer>
        </div>
    )
}

export default Layout