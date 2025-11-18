import React from 'react'
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../TOOLS/apiFetch/apiFetch';


const ProtectedRoute = ({ children, requiredRole }) => {
    const [verified, setVerified] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const verify = async () => {
            const adminToken = localStorage.getItem('adminToken')
            const clientToken = localStorage.getItem('clientToken')
            let endpoint;
            let token;

            if (requiredRole === 'admin') {
                endpoint = '/admin/verify';
                token = adminToken
            } else if (requiredRole === 'client') {
                token = clientToken || adminToken
                endpoint = token == clientToken ? '/client/verify' : '/admin/verify';
                
            }

            if (!token) {
                setVerified(false);
                return;
            }

            try {
                await apiFetch(`${apiUrl}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setVerified(true);
            } catch (err) {
                setVerified(false);
            }
        }

        verify();
    }, [requiredRole, apiUrl]);

    if (verified === null) return <div>Loading...</div>;
    if (!verified) {
        return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/client/login'} replace />;
    }

    return children;
}

export default ProtectedRoute