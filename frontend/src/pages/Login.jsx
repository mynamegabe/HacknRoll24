import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import config from '@/config'

function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        const res = await fetch(`${config.API_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const data = await res.json()
        if (data.error) {
            setError(data.error)
        } else {
            setError('')
            navigate('/editor')
        }
    }
}