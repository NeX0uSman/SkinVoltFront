import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import cl from './ProductPage.module.css'
import { apiFetch } from '../TOOLS/apiFetch/apiFetch'

const ProductPage = () => {
    const { id } = useParams()
    const [skin, setSkin] = useState()
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const productFind = async () => {
            const skin = await apiFetch(`${apiUrl}/skins/${id}`)
            setSkin(skin)
        }
        productFind()
    }, [id])
    /*const skinData = skin.skinData;*///change after adding saleHistory
    const itemColourDefiner = (rarity) => {
        switch (rarity) {
            case 'Consumer Grade':
                return {

                    backgroundColor: ' #b0c3d9',
                };
            case 'Industrial Grade':
                return {

                    backgroundColor: ' #5e98d9',
                };
            case 'Mil-Spec':
                return {

                    backgroundColor: ' #4b69ff',
                };
            case 'Restricted':
                return {

                    backgroundColor: ' #8847ff',
                };
            case 'Classified':
                return {

                    backgroundColor: ' #d32ce6',
                };
            case 'Covert':
                return {

                    backgroundColor: ' #eb4b4b',
                };
            case 'Exceedingly Rare':
                return {

                    backgroundColor: ' #ffd700',
                };
            case 'Contraband':
                return {

                    backgroundColor: ' #cf6a32',
                };
            default:
                return {

                    backgroundColor: ' black',
                };
        }
    };
    console.log(skin)
    return (
        skin ? (
            <div className={cl.productPage}>
                <div className={cl.skinInfo}>
                    <div className={cl.leftSide}>
                        <h2>{skin.weapon} | {skin.name}</h2>
                        {skin.imageUrl && <img src={`${apiUrl}${skin.imageUrl}`} alt="skin" width="300" />}
                        <div className={cl.rarityRow} style={itemColourDefiner(skin.rarity)}></div>
                    </div>
                    <div className={cl.skinCard}>
                        <p>Rarity: {skin.rarity}</p>
                        <p>Wear: {skin.wear}</p>
                        <p>Price: {skin.price} $</p>

                    </div>
                </div>
            </div>
        ) : (
            <div>Loading ...</div>
        )
    )
}
export default ProductPage