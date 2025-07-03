import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckAuth({ children, protectedRoute }) {
    const nagivate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token')

        if(protectedRoute) {
            if(!token) {
                nagivate("/login")
            } else {
                setLoading(false)
            }
        } else {
            if(token) {
                nagivate("/")
            } else {
                setLoading(false)
            }
        }
    }, [nagivate, protectedRoute])
    
    if(loading) {
        return <div className='loading'>Loading...</div>
    }
    return children
}

export default CheckAuth