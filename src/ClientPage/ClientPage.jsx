import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cl from './ClientPage.module.css';
import { Range } from 'react-range';
import ClientPageTopCatalog from '../ClientPageTopBars/ClientPageTopCatalog';
import ItemCard from '../itemCard/ItemCard.jsx';
import { InventoryContext } from '../Context/inventoryContext';
import { useContext } from 'react';

const ClientPage = () => {
  const {allSkins, setAllSkins} = useContext(InventoryContext);

  const [searchBar, setSearchBar] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [desiredLowestPrice, setDesiredLowestPrice] = useState('');

  const [desiredHighestPrice, setDesiredHighestPrice] = useState('');

  const [floatRange, setFloatRange] = useState([0, 1]);

  const [desiredRarity, setDesiredRarity] = useState([]);

  const [desiredWeapon, setDesiredWeapon] = useState('');

  const [desiredCollection, setDesiredCollection] = useState('');

  const [desiredSpecial, setDesiredSpecial] = useState([]);

  const FLOAT_MIN = 0.00;
  const FLOAT_MAX = 1.00;
  const FLOAT_STEP = 0.0001;

  const categories = [
    'Rifles', 'Pistols', 'SMGs', 'Heavy', 'Knives', 'Gloves', 'Agents',
    'Containers', 'Stickers', 'Keychains', 'Patches', 'Collectibles', 'Music Kits'];

  const allCollections = [
    "Dust 2 Collection",
    "Mirage Collection",
    "Inferno Collection",
    "Nuke Collection",
    "Train Collection",
    "Cache Collection",
    "Overpass Collection",
    "Vertigo Collection",
    "Ancient Collection",
    "Cobblestone Collection",
    "Safehouse Collection",
    "Agency Collection",
    "Canals Collection",
    "Operation Phoenix Collection",
    "Operation Broken Fang Collection",
    "Operation Riptide Collection",
    "Operation Hydra Collection",
    "Operation Vanguard Collection",
    "Operation Wildfire Collection",
    "Shattered Web Collection",
    "Operation Bloodhound Collection",
    "Operation Bravo Collection",
    "Operation Payback Collection",
    "Operation Breakout Collection",
    "Prisma Collection",
    "Prisma 2 Collection",
    "Spectrum Collection",
    "Spectrum 2 Collection",
    "Horizon Collection",
    "Fracture Collection",
    "Snakebite Collection",
    "Shattered Web Collection",
    "Clutch Collection",
    "Canals Collection",
    "Winter Offensive Collection",
    "Gamma Collection",
    "Gamma 2 Collection",
    "Cobblestone Collection",
    "Gods and Monsters Collection",
    "Danger Zone Collection",
    "St. Marc Collection",
    "Chop Shop Collection",
    "Glove Collection",
    "Revolver Case Collection",
    "Rising Sun Collection",
    "Chop Shop Collection",
    "Broken Fang Collection",
    "Dreams & Nightmares Collection",
    "Chop Shop Collection",
    "Huntsman Collection",
    "Wildfire Collection",
    "Breakout Collection",
    "Phoenix Collection",
    "Bloodhound Collection",
    "Winter Offensive Collection",
    "Cobblestone Collection",
    "Canals Collection",
    "Train Collection",
    "Safehouse Collection",
    "Overpass Collection",
    "Agency Collection",
    "Cache Collection",
    "Dust Collection",
    "Inferno Collection",
    "Nuke Collection",
    "Mirage Collection",
    "Vertigo Collection",
    "Ancient Collection"
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSkins = () => {
      fetch('https://skinvoltserver.onrender.com/skins/all')
        .then(res => res.json())
        .then(data => setAllSkins(data))
        .catch(err => console.error('Error fetching data', err));
    }
    console.log(allSkins);
    fetchAllSkins();
  }, [])

  const setActiveCategory = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  }

  const searchSkins = () => {
    if (searchBar.trim() === '') {
      return allSkins;
    }
    return allSkins.filter(skin => {
      return skin.name.toLowerCase().includes(searchBar.toLowerCase())
    })
  }

  const checkIfPriceInRange = () => {
    return searchSkins().filter((skin) => {
      const price = skin.price;

      const minOK = desiredLowestPrice === '' || price >= desiredLowestPrice;
      const maxOK = desiredHighestPrice === '' || price <= desiredHighestPrice;

      return minOK && maxOK;
    })
  }

  const checkIfWearMatches = () => {
    return checkIfPriceInRange().filter((skin) => {
      return skin.float >= floatRange[0] && skin.float <= floatRange[1];
    });
  };

  const checkIfRarityMatched = () => {
    if (desiredRarity.length === 0) {
      return checkIfWearMatches();
    } else {
      return checkIfWearMatches().filter(skin => desiredRarity.includes(skin.rarity));
    }
  }

  const checkIfSpecialMatched = () => {
    if (desiredSpecial.length === 0) {
      return checkIfRarityMatched();
    } else {
      return checkIfRarityMatched().filter(skin => desiredSpecial.includes(skin.special));
    }

  }

  const handleRarityChange = (e) => {
    const { value, checked } = e.target;
    setDesiredRarity((prev) => {
      return checked ?
        [...prev, value]
        :
        prev.filter(rarity => rarity !== value);
    })
  }

  const handleSpecialChange = (e) => {
    const { value, checked } = e.target;
    setDesiredSpecial((prev) => {
      return checked ?
        [...prev, value]
        :
        prev.filter(special => special !== value);
    })
  }

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
    <>
      <div className={cl.all_page}>
        <ClientPageTopCatalog categories={categories} onSelectedCategory={selectedCategory} setSelectedCategory={setActiveCategory} />
        <div className={cl.middle}>
          <div className={cl.left_side}>
            <div className={cl.search_bar}>
              <p>Search</p>
              <input value={searchBar} onChange={(e) => setSearchBar(e.target.value)} type="text" placeholder='Type to search for a skin...' />
            </div>
            <div className={cl.filters}>
              <div className={cl.price_filter_container}>
                <p>Price Filter</p>
                <div className={cl.price_filter}>
                  <div className={cl.column}>
                    <p>From</p>
                    <input type="number" onChange={(e) =>
                      setDesiredLowestPrice(e.target.value)} value={desiredLowestPrice} placeholder="0$" />
                  </div>
                  <div className={cl.column}>
                    <p>To</p>
                    <input type="number" onChange={(e) =>
                      setDesiredHighestPrice(e.target.value)} value={desiredHighestPrice} placeholder="100000$" />
                  </div>
                </div>
              </div>
              <div>
                <div className={cl.wear_container}>
                  <p>Wear Filter</p>
                  <div className={cl.range_container}>
                    <Range
                      step={FLOAT_STEP}
                      min={FLOAT_MIN}
                      max={FLOAT_MAX}
                      values={floatRange}
                      onChange={(values) => setFloatRange(values)}
                      renderTrack={({ props, children }) => (
                        <div
                          {...props}
                          style={{
                            ...props.style,
                            height: '6px',
                            width: '100%',
                            borderRadius: '4px',
                            background: 'linear-gradient(to right,#4caf50 0%,  #4caf50 7%, #ffc107 8%, #ffc107 14%, #ff9800 15%, #ff9800 30%, #f44336 31%, #f44336 44%, #9c27b0 45%, #9c27b0 100%)',
                          }}
                        >
                          {children}
                        </div>
                      )}
                      renderThumb={({ props }) => (
                        <div
                          {...props}
                          style={{
                            ...props.style,
                            height: '20px',
                            width: '20px',
                            backgroundColor: '#fff',
                            border: '1px solid black',
                            borderRadius: '50%',
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className={cl.floatButtons}>
                    <button onClick={() => setFloatRange([0.00, 0.07])}>FN</button>
                    <button onClick={() => setFloatRange([0.08, 0.14])}>MW</button>
                    <button onClick={() => setFloatRange([0.15, 0.30])}>FT</button>
                    <button onClick={() => setFloatRange([0.31, 0.45])}>WW</button>
                    <button onClick={() => setFloatRange([0.46, 1.00])}>BS</button>
                  </div>
                  <p>Float:</p>
                  <input type="number" value={floatRange[0].toFixed(2)}
                    step="0.01"
                    min={FLOAT_MIN}
                    max={FLOAT_MAX}
                    onChange={(e) => {
                      const newMin = parseFloat(e.target.value);
                      setFloatRange([newMin, floatRange[1]])
                    }}
                  /> – <input type="number" value={floatRange[1].toFixed(2)}
                    step="0.01"
                    min={FLOAT_MIN}
                    max={FLOAT_MAX}
                    onChange={(e) => {
                      const newMax = parseFloat(e.target.value)
                      setFloatRange([floatRange[0], newMax])
                    }}
                  />
                </div>
              </div>
              <div className={cl.rarity_container}>
                <p>Rarity</p>
                <div className={cl.rarities_container}>
                  {[
                    'Consumer Grade',
                    'Industrial Grade',
                    'Mil-Spec',
                    'Restricted',
                    'Classified',
                    'Covert',
                    'Exceedingly Rare',
                    'Contraband',
                  ].map((label) => (
                    <span className={cl.row} key={label}>
                      <input
                        type="checkbox"
                        id={label}
                        value={label}
                        onChange={(e) => handleRarityChange(e)}
                      />
                      <label htmlFor={label}>{label}</label>
                    </span>
                  ))}
                </div>
              </div>
              <div className={cl.special_container}>
                <p>Special</p>
                <div className={cl.special_inner_container}>
                  <span className={cl.row}>
                    <input
                      type="checkbox"
                      id="souvenir"
                      value="Souvenir"
                      onChange={(e) => handleSpecialChange(e)}
                    />
                    <label htmlFor="souvenir">Souvenir</label>
                  </span>
                  <span className={cl.row}>
                    <input
                      type="checkbox"
                      id="stattrak"
                      value="StatTrak™"
                      onChange={(e) => handleSpecialChange(e)}
                    />
                    <label htmlFor="stattrak">StatTrak™</label>
                  </span>
                </div>
              </div>
              <div>
                <p>Collections</p>
                <div className={cl.collections_container} style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #ccc',
                  padding: '10px',
                  width: '300px',
                  fontSize: '12px'
                }}>
                  {allCollections.map((collection, index) => {
                    return <label key={index} style={{ display: 'block' }}>
                      <input
                        type="checkbox"
                        value={collection}
                        checked={desiredCollection.includes(collection)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDesiredCollection((prev) =>
                            prev.includes(value)
                              ? prev.filter((v) => v !== value)
                              : [...prev, value]
                          );
                        }}
                      />
                      {collection}
                    </label>
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={cl.right_side}>
            <div className={cl.catalog_container}>
              {checkIfSpecialMatched().length === 0 ? (<h1>No skins found :(</h1>) : (
                checkIfSpecialMatched().map(skin => (
                  <ItemCard skin={skin} key={skin._id} />
                ))
              )}
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default ClientPage