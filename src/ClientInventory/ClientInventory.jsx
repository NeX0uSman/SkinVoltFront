import React from 'react'
import cl from './ClientInventory.module.css'
import { useEffect, useState } from 'react';
import { InventoryContext } from '../Context/inventoryContext';
import { useContext } from 'react';
import ClientInventoryItemCards from '../ClientInventoryItemCards/ClientInventoryItemCards.jsx';
import SaleLineChart from '../TOOLS/SaleLineChart.jsx';

const ClientInventory = () => {
  const { userSkins, List, itemColourDefiner } = useContext(InventoryContext);
  const [activeListWindow, setActiveListWindow] = useState(null);
  const [price, setPrice] = useState(0)
  const [listShow, setListShow] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const reccomendedPrice = (saleHistory) => {
    const now = new Date()
    const threeDaysAgo = new Date(now)
    threeDaysAgo.setDate(now.getDate() - 3)

    const recentSales = saleHistory.filter((sale) => {
      const saleDate = new Date(sale.date)
      return saleDate >= threeDaysAgo && saleDate <= now;
    })
    if (recentSales.length == 0) return 0;
    console.log(recentSales)
    const averagePrice = recentSales.reduce((sum, sale) => sum + sale.price, 0) / recentSales.length;
    console.log(averagePrice)
    return averagePrice;

  } //reccomended price based on last 3 days of sales
 
  return (
    <div style={{ color: 'white' }}>
      {userSkins.length === 0 ? (
        <p>Your inventory is empty.</p>
      ) : (
        <>
          <div className={cl.inventory_container}>
            {userSkins.map((skin, index) => (
              <ClientInventoryItemCards skin={skin}
                key={index}
                activeListWindow={activeListWindow}
                setActiveListWindow={setActiveListWindow}
                listShow={listShow}
              />
            ))}
          </div>
          {activeListWindow && (
            <div className={cl.listingWindow}>
              <div className={cl.row}>
                <div className={cl.listingGunSkin}>
                  <div className={cl.rowSkinName}>
                    <h2>{activeListWindow.weapon} </h2>
                    <h2> {activeListWindow.name}</h2>
                  </div>
                  <div className={cl.skinImage}>
                    <img style={itemColourDefiner(activeListWindow.rarity)} src={`${apiUrl}${activeListWindow.imageUrl}`} alt="skinImage" />
                  </div>
                  <p>{activeListWindow.float}</p>
                  <div className={cl.saleList}>
                    <p>SALE LIST</p>
                  </div>
                </div>
                <div className={cl.listinGraphAndInputs}>
                  <div className={cl.saleGraph} style={{ width: '400px', height: '250px' }}>
                    <p>Latest Sales</p>
                    <SaleLineChart saleHistory={activeListWindow.saleHistory} />
                  </div>
                  <input onChange={(event) => { setPrice(event.target.value) }} value={price} type="text" placeholder="Enter your price" />
                  <p>Reccomended price: {reccomendedPrice(activeListWindow.saleHistory ?? [])}</p>
                  <button onClick={() => { List(activeListWindow._id, price); setActiveListWindow(null); setListShow(true) }}>List Skin</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ClientInventory