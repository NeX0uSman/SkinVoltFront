import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ClientRoute = ({ children }) => {
    const [verified, setVerified] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const verifyToken = async () => {
            const clientToken = localStorage.getItem('clientToken');
            
            if (!clientToken) {
                setVerified(false);
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/client/verify`, {
                    headers: { Authorization: `Bearer ${clientToken}` }
                })
                setVerified(res.ok)
            } catch (err) {
                setVerified(false)
            }


        }
        verifyToken()
    }, [])

    if (verified === null) return <div>Loading...</div>;
    if (!verified) return <Navigate to="/client/login" />;

    return children;

}
export default ClientRoute