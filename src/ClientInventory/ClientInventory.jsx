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

  const [listingActionPerformedON, setListingActionPerformedON] = useState([]);

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

    const averagePrice = recentSales.reduce((sum, sale) => sum + sale.price, 0) / recentSales.length;

    return averagePrice;

  } //reccomended price based on last 3 days of sales

  return (
    <div style={{ color: 'white' }}>
      {userSkins.length === 0 ? (
        <div className={cl.empty}>
          <p>Your inventory is empty.</p>
        </div>
      ) : (
        <>
          <div className={cl.inventory_container}>
            {userSkins.map((skin, index) => (
              <ClientInventoryItemCards skin={skin}
                key={index}
                activeListWindow={activeListWindow}
                setActiveListWindow={setActiveListWindow}
                listingActionPerformedON={listingActionPerformedON}
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
                  <button onClick={() => {
                    List(activeListWindow._id, price);
                    setActiveListWindow(null);
                    setListingActionPerformedON(prev => [...prev, activeListWindow._id])
                  }
                  }>List Skin</button>
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