import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUserdata } from './redux/userSlice'
import getCurrentUser from './features/getCurrentUser'
import Home from './pages/Home'
import WelcomeSplash from './components/WelcomeSplash'

// Key used to track whether the splash has been shown this session
const SPLASH_SEEN_KEY = 'nexus_splash_seen'

function App() {
    const dispatch = useDispatch()

    // Show splash only on the very first visit of a browser session
    const [showSplash, setShowSplash] = useState(
        () => !sessionStorage.getItem(SPLASH_SEEN_KEY)
    )

    // Fetch the currently logged-in user on mount
    useEffect(() => {
        const getUser = async () => {
            const data = await getCurrentUser()
            dispatch(setUserdata(data))
        }
        getUser()
    }, [])

    // Called by WelcomeSplash when the user clicks "Get Started"
    const handleSplashDone = () => {
        sessionStorage.setItem(SPLASH_SEEN_KEY, 'true')
        setShowSplash(false)
    }

    return (
        <>
            {/* Splash screen — shown once per session, only to unauthenticated users */}
            {showSplash && <WelcomeSplash onDone={handleSplashDone} />}

            {/* Main app — always rendered in background; login modal is inside Home */}
            <Home />
        </>
    )
}

export default App
