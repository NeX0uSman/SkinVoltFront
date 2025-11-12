const buyForm = async (skinId, salePrice) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const res = await fetch(`${apiUrl}/skins/purchase`, {
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