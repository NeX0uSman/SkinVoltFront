import { useEffect } from 'react';
import cl from './App.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemCard from './itemCard/ItemCard.jsx';


function App() {


  const navigate = useNavigate('')

  useEffect(() => {
    fetch('https://skinvoltserver.onrender.com/skins/all')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(console.error)
  }, [])
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null);
  const [weapon, setWeapon] = useState('')
  const [rarity, setRarity] = useState('')
  const [wear, setWear] = useState('')
  const [float, setFloat] = useState()
  const [special, setSpecial] = useState('');

  console.log(notes)
  const addNote = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('name', title)
    formData.append('price', price)
    formData.append('image', image)
    formData.append('rarity', rarity)
    formData.append('float', float)
    formData.append('weapon', weapon)
    formData.append('wear', wear)
    formData.append('special', special)


    try {
      const res = await fetch('https://skinvoltserver.onrender.com/skins/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clientToken')}`
        },
        body: formData,
      })

      const data = await res.json();

      const newNote = data.skin


      setNotes([...notes, newNote])

    } catch (err) {
      console.log(err)
    }
  }

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`https://skinvoltserver.onrender.com/skins/delete/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id))
      } else {
        console.log('ti dalbaeb')
      }

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className={cl.app_container}>
        <form action="" className={cl.note_form}>
          <input placeholder='Weapon' type="text" value={weapon} onChange={(event) => setWeapon(event.target.value)} />
          <input placeholder='Skin name' value={title} onChange={(event) => setTitle(event.target.value)} required />
          <input placeholder='Rarity' list="options" value={rarity} onChange={(event) => setRarity(event.target.value)} />
          <datalist id='options'>
            <option value="Consumer Grade" />
            <option value="Industrial Grade" />
            <option value="Mil-Spec" />
            <option value="Restricted" />
            <option value="Classified" />
            <option value="Covert" />
            <option value="Exceedingly Rare" />
          </datalist>
          <input type="number" placeholder="Your Float:" onChange={(event) => setFloat(event.target.value)} required />
          <input placeholder='Price' type="number" value={price} onChange={(event) => setPrice(event.target.value)} />
          <input type='text' placeholder='Wear' list="options2" value={wear} onChange={(event) => { setWear(event.target.value) }} required />
          <datalist id="options2">
            <option value="Battle Scared" />
            <option value="Well Worn" />
            <option value="Field Tested" />
            <option value="Minimal Wear" />
            <option value="Factory New" />
          </datalist>
          <input type='file' name="image" accept='image/*' onChange={(event) => setImage(event.target.files[0])} required />
          <div className={cl.special_container}>
            <span className={cl.row}>
              <input
                type="radio"
                id="souvenir"
                value="Souvenir"
                name="special"
                checked={special === 'Souvenir'}
                onChange={() => setSpecial(prev => prev === 'Souvenir' ? '' : 'Souvenir')}
              />
              <label htmlFor="souvenir">Souvenir</label>
            </span>
            <span className={cl.row}>
              <input
                type="radio"
                id="stattrak"
                value="StatTrak™"
                name="special"
                checked={special === 'StatTrak™'}
                onChange={() => setSpecial(prev => prev === 'StatTrak™' ? '' : 'StatTrak™')}
              />
              <label htmlFor="stattrak">StatTrak™</label>
            </span>
          </div>
          <button type='submit' onClick={addNote}>Add Skin</button>
        </form>
        <div className={cl.notes_grid}>
          {notes.map((skin, index) => {
            return <ItemCard skin={skin} index={skin._id} />
          })}
        </div>
      </div>
    </>
  );
}

export default App