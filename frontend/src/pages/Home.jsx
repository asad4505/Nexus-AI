import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';
import LoginWelcomeSplash from '../components/LoginWelcomeSplash';

function Home() {
    const {userData}=useSelector(state=>state.user) // redux toolkit for managing user data
    const dispatch=useDispatch()
    const [loginError, setLoginError] = React.useState(null)
    const [isLoggingIn, setIsLoggingIn] = React.useState(false)

    // Controls the post-login welcome splash — holds the newly logged-in user data
    // so it shows even before Redux has fully re-rendered
    const [welcomeUser, setWelcomeUser] = React.useState(null)

    // Login function using axios for storing user data in redis and cookies for authentication
    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            if (data?.sessionId) {
                localStorage.setItem("sessionId", data.sessionId)
            }
            dispatch(setUserdata(data))
            // Trigger the post-login welcome splash with the fresh user data
            setWelcomeUser(data)
        } catch (error) {
            console.error("Backend login error:", error)
            setLoginError(error?.response?.data?.message || error?.message || "Failed to authenticate with backend server")
        }
    }

    // Handle authentication state and redirect results
    useEffect(() => {
        let isMounted = true
        let hasHandledAuth = false

        // 1. Process getRedirectResult if coming back from a redirect flow
        getRedirectResult(auth)
            .then(async (result) => {
                if (result?.user && isMounted && !hasHandledAuth) {
                    hasHandledAuth = true
                    setIsLoggingIn(true)
                    const token = await result.user.getIdToken()
                    await handleLogin(token)
                }
            })
            .catch((error) => {
                console.error("Redirect sign-in error:", error)
                if (isMounted) setLoginError(error.message)
            })
            .finally(() => {
                if (isMounted) setIsLoggingIn(false)
            })

        // 2. onAuthStateChanged catches the authenticated user even if getRedirectResult
        // returns null due to browser third-party cookie/storage partitioning
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && isMounted && !userData && !hasHandledAuth) {
                hasHandledAuth = true
                setIsLoggingIn(true)
                try {
                    const token = await firebaseUser.getIdToken()
                    await handleLogin(token)
                } catch (error) {
                    console.error("Firebase auth state token error:", error)
                    if (isMounted) setLoginError(error.message)
                } finally {
                    if (isMounted) setIsLoggingIn(false)
                }
            }
        })

        return () => {
            isMounted = false
            unsubscribe()
        }
    }, [userData])

    // Login with google using firebase
    const googleLogin = async () => {
        setIsLoggingIn(true)
        setLoginError(null)
        try {
            const data = await signInWithPopup(auth, googleProvider)
            const token = await data.user.getIdToken()
            await handleLogin(token)
        } catch (error) {
            console.error("Google sign in error:", error)
            if (error?.code === 'auth/popup-blocked') {
                // If browser blocks the popup, automatically fallback to redirect login
                try {
                    await signInWithRedirect(auth, googleProvider)
                    return
                } catch (redirectError) {
                    console.error("Redirect login error:", redirectError)
                    setLoginError(redirectError.message)
                }
            } else {
                setLoginError(error.message)
            }
        } finally {
            setIsLoggingIn(false)
        }
    }

    return (
        <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>

            <SideBar/>
            <ChatArea/>
            <Artifact/>

            {/* ── Login modal — shown when not authenticated ── */}
            {!userData && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur'>
                    <div className='w-[360px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5 shadow-2xl'>
                        <div className='flex flex-col gap-1'>
                            <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to Nexus AI</h2>
                            <p className='text-[13px] text-slate-500'>Please login to continue using the app.</p>
                        </div>

                        {loginError && (
                            <div className='text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 break-words'>
                                {loginError}
                            </div>
                        )}

                        <button
                            disabled={isLoggingIn}
                            className='w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200 disabled:opacity-50 transition-all duration-150 cursor-pointer'
                            onClick={googleLogin}
                        >
                            <FcGoogle size={15} />
                            {isLoggingIn ? "Signing In..." : "Continue With Google"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Post-login welcome splash — shown once after successful Google login ── */}
            {welcomeUser && (
                <LoginWelcomeSplash
                    user={welcomeUser}
                    onDone={() => setWelcomeUser(null)}
                />
            )}
        </div>
    )
}

export default Home
