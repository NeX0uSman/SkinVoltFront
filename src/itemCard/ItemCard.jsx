import React, { useContext } from 'react'
import cl from './ItemCard.module.css'
import { useNavigate } from 'react-router-dom';
import { InventoryContext } from '../Context/inventoryContext';

const ItemCard = ({ skin, key }) => {
    const navigate = useNavigate();
    const { buyItem, userData, setUserData, unList, itemColourDefiner } = useContext(InventoryContext);
    const isOwner = (
        skin.ownerId?._id?.toString?.() === userData?._id?.toString?.() ||
        skin.ownerId?.toString?.() === userData?._id?.toString?.()
    );
    const apiUrl = import.meta.env.VITE_API_URL;
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
        <div className={cl.skin_container} style={itemColourDefiner(skin.rarity)} key={key}>
            <div className={cl.upper_note}>
                <div className={cl.whole_upper}>
                    <div className={cl.upper_note1}>
                        <p style={checkWhichSpecial(skin.special)}>{skin.special === `StatTrak™` ? (<>{skin.special} <br /></>) : ''} {rewritename(skin.weapon)} </p>
                        <p> {rewritename(skin.name)}</p>
                    </div>
                    <p className={cl.wear}>{skin.wear}</p>
                </div>
                {skin.imageUrl && <img src={`${apiUrl}${skin.imageUrl}`} alt="skin" className={cl.card_image} />}
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
                {isOwner ?
                    <>
                        <button style={{ backgroundColor: 'black' }} onClick={() => unList(skin._id)}>Unlist</button>
                    </>
                    :
                    <>
                        <button onClick={() => { buyItem(skin._id, skin.price) }}>Buy</button>
                    </>
                }

            </div>
        </div>
    )
}

export default ItemCard