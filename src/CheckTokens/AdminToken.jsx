import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const [verified, setVerified] = useState(null)

    useEffect(() => {
        const verifyToken = async () => {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) return;

            try {
                const res = await fetch('http://localhost:3000/admin/verify', {
                    headers: { Authorization: `Bearer ${adminToken}` }
                })
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