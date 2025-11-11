const buyForm = async (skinId, salePrice) => {
try {
    const res = await fetch('http://localhost:3000/skins/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('clientToken')}`
        },
        body: JSON.stringify({ skinId, salePrice }),
    })

    const data = await res.json();
    console.log(data);
    return data;
} catch (err) {
    console.log(err)
}
}
export default buyForm;