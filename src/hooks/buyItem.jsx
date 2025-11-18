import { apiFetch } from "../TOOLS/apiFetch/apiFetch";

const buyForm = async (skinId, salePrice) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        return await apiFetch(`${apiUrl}/skins/purchase`, {
            method: 'POST',
            body: JSON.stringify({ skinId, salePrice }),
        })
    } catch (err) {
        console.log(err)
    }
}
export default buyForm;