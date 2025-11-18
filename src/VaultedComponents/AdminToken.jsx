import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../TOOLS/apiFetch/apiFetch';

const AdminRoute = ({ children }) => {
    const [verified, setVerified] = useState(null)
const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const verifyToken = async () => {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) return;

            try {
                const res = await apiFetch(`${apiUrl}/admin/verify`, {})
                setVerified(res.ok)
            } catch (err) {
                setVerified(false)
            }


        }
        verifyToken()
    }, [])

    if (verified === null) return <div>Loading...</div>;
    if (!verified) return <Navigate to="/admin/login" />;

    return children;

}
export default AdminRoute