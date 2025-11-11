import React from 'react'
import { useEffect, useState } from 'react'
import cl from './ClientPageTopCatalog.module.css'

const ClientPageTopCatalog = ({ categories, onSelectedCategory, setSelectedCategory }) => {

    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [selectedWeapon, setSelectedWeapon] = useState(null)

    const changeOpen = (category) => {
        if (onSelectedCategory === category) {
            setOpen(prev => !prev)
        } else {
            setSelectedCategory(category)
            setOpen(true)
        }
    }

    const setRowVisibility = () => {
        return {
            display: open ? 'flex' : 'none'
        }
    }
    console.log(open)
    useEffect(() => {
        if (!onSelectedCategory) return
        fetch(`http://localhost:3000/skins/category/${onSelectedCategory}`)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err))

    }, [onSelectedCategory])

    const itemColourDefiner = (rarity) => {
        switch (rarity) {
            case 'Consumer Grade':
                return {
                    background: 'linear-gradient(rgba(176, 195, 217, 0) 20%, rgba(176, 195, 217, 0.3) 100%)',
                    borderBottom: '2px solid #b0c3d9',
                };
            case 'Industrial Grade':
                return {
                    background: 'linear-gradient(rgba(94, 152, 217, 0) 20%, rgba(94, 152, 217, 0.3) 100%)',
                    borderBottom: '2px solid #5e98d9',
                };
            case 'Mil-Spec':
                return {
                    background: 'linear-gradient(rgba(75, 105, 255, 0) 20%, rgba(75, 105, 255, 0.3) 100%)',
                    borderBottom: '2px solid #4b69ff',
                };
            case 'Restricted':
                return {
                    background: 'linear-gradient(rgba(136, 71, 255, 0) 20%, rgba(136, 71, 255, 0.3) 100%)',
                    borderBottom: '2px solid #8847ff',
                };
            case 'Classified':
                return {
                    background: 'linear-gradient(rgba(211, 44, 230, 0) 20%, rgba(211, 44, 230, 0.3) 100%)',
                    borderBottom: '2px solid #d32ce6',
                };
            case 'Covert':
                return {
                    background: 'linear-gradient(rgba(235, 75, 75, 0) 20%, rgba(235, 75, 75, 0.3) 100%)',
                    borderBottom: '2px solid #eb4b4b',
                };
            case 'Exceedingly Rare':
                return {
                    background: 'linear-gradient(rgba(255, 215, 0, 0) 20%, rgba(255, 215, 0, 0.3) 100%)',
                    borderBottom: '2px solid #ffd700',
                };
            case 'Contraband':
                return {
                    background: 'linear-gradient(rgba(207, 106, 50, 0) 20%, rgba(207, 106, 50, 0.3) 100%)',
                    borderBottom: '2px solid #cf6a32',
                };
            default:
                return {
                    background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))',
                    borderBottom: '2px solid black',
                };
        }
    };

    const weapons = Array.from(new Set(data.map(skin => skin.weapon)));
    const filteredData = selectedWeapon
        ? data.filter((skin) => skin.weapon == selectedWeapon)
        : data;

    return (
        <div className={cl.column_container}>
            <div className={cl.category_row}>
                {categories.map((el, index) => (
                    <div
                        key={index}
                        className={el === onSelectedCategory ? cl.active : ''}
                        onClick={() => { changeOpen(el); setSelectedCategory(el); setSelectedWeapon(null) }}
                    >
                        <p>{el}</p>
                        <i className="ph ph-arrow-down" style={{ color: '#fff', width: '15px', height: '15px' }}></i>
                    </div>
                ))}
            </div>

            {open && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={cl.weapon_container}>
                            <div onClick={() => setSelectedWeapon(null)} className={selectedWeapon == null ? cl.active : ''}>
                                All
                            </div>
                            {weapons.map((weapon) => (
                                <div key={weapon} onClick={() => setSelectedWeapon(weapon)} className={weapon == selectedWeapon ? cl.active : ''}>
                                    {weapon}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={cl.skins_row} style={setRowVisibility()}>
                        {filteredData.length === 0 ? (
                            <p style={{ color: 'white' }}>No skins in this category yet!</p>
                        ) : (
                            filteredData.map((skin, index) => (
                                <div key={index} className={cl.skin_container} style={itemColourDefiner(skin.rarity)}>
                                    <img src={`http://localhost:3000${skin.imageUrl}`} alt="skin-image" />
                                    <p className={cl.weapon_text}>{skin.weapon} | {skin.name}</p>
                                    <p className={cl.price_text}>{skin.price}$</p>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default ClientPageTopCatalog