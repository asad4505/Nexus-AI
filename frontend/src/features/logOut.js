import api from '../../utils/axios'
import { auth } from '../../utils/firebase'
import { signOut } from 'firebase/auth'

async function logOut() {
    try {
        localStorage.removeItem("sessionId")
        await signOut(auth).catch(() => {})
        const { data } = await api.get("/api/auth/logout")
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

export default logOut
