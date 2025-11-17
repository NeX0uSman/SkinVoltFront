import React from 'react'
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children, requiredRole }) => {
    const [verified, setVerified] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const verify = async () => {
            const clientToken = localStorage.getItem('clientToken');
            const adminToken = localStorage.getItem('adminToken');
            let token, endpoint

            if (requiredRole == 'admin') {
                token = adminToken;
                endpoint = '/admin/verify'
            } else if (requiredRole == 'client') {
                token = clientToken || adminToken;
                endpoint = '/client/verify'
            }


            try {
                const res = await fetch(`${apiUrl}${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setVerified(res.ok)
            } catch (err) {
                setVerified(false)
            }


        }
        verify()
    }, [requiredRole, apiUrl])

    if (verified === null) return <div>Loading...</div>;
    if (!verified) {
        return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/client/login'} replace />;
    }

    return children;
}

export default ProtectedRoute