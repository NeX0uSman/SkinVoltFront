import React, { useContext, useState } from 'react'
import cl from './ClientInventoryItemCards.module.css'
import { useNavigate } from 'react-router-dom';
import { InventoryContext } from '../Context/inventoryContext';

const ClientInventoryItemCards = ({ skin, key, activeListWindow, setActiveListWindow }) => {
    const navigate = useNavigate();
    const { buyItem, userData, setUserData, unList, List, itemColourDefiner } = useContext(InventoryContext);
    const isOwner = (
        skin.ownerId?._id?.toString?.() === userData?._id?.toString?.() ||
        skin.ownerId?.toString?.() === userData?._id?.toString?.()
    );
    const isListed = skin.status === 'selling';
    const [unlistShow, setUnlistShow] = useState(false);
    const isListWindowOpen = activeListWindow === skin._id;
    const checkWhichSpecial = (special) => {
        if (special == 'StatTrak™') {
            return {
                color: 'orange',
            }
        } else if (special == 'Souvenir') {
            return {
                color: 'yellow',
            }
        } else {
            return
        }
    }

    const rewritename = (name) => {
        if (name.length > 9) {
            return name.slice(0, 9) + '...'
        } else {
            return name
        }
    }
    return (
        <div className={cl.cardWrapper}>
            <div
                className={`${cl.skin_container} ${unlistShow ? cl.blurred : ''}`}
                style={itemColourDefiner(skin.rarity)}
            >
                <div className={cl.upper_note}>
                    <div className={cl.whole_upper}>
                        <div className={cl.upper_note1}>
                            <p style={checkWhichSpecial(skin.special)}>{skin.special === `StatTrak™` ? (<>{skin.special} <br /></>) : ''} {rewritename(skin.weapon)} </p>
                            <p> {rewritename(skin.name)}</p>
                        </div>
                        <p className={cl.wear}>{skin.wear}</p>
                    </div>
                    {skin.imageUrl && <img src={`http://localhost:3000${skin.imageUrl}`} alt="skin" className={cl.card_image} />}
                </div>
                <div className={cl.downer_note}>
                    <div className={cl.price_block}>
                        <p className={cl.skin_price}>{skin.price} $</p>
                        <p className={cl.skin_float}>Float: {skin.float.toFixed(2)}</p>
                    </div>
                </div>
                <p className={cl.unboxed_from}>Fever Case</p>
                <div className={cl.buttons}>
                    <button onClick={() => { navigate(`/client/product/${skin._id}`) }}>View</button><span style={{ fontSize: '15px' }}></span>
                    {isListed ?
                        <>
                            <button style={{ backgroundColor: 'red' }} onClick={() => { unList(skin._id); setUnlistShow(true) }}>Unlist</button>
                        </>
                        :
                        <>
                            <button style={{ backgroundColor: 'green' }} onClick={() => {setActiveListWindow(skin) }}>List</button>
                        </>}
                </div>
            </div>
            {unlistShow && <p className={cl.successText} style={{ color: 'white', marginTop: '10px' }}>Skin unlisted successfully!</p>}
        </div>
    )
}

export default ClientInventoryItemCards