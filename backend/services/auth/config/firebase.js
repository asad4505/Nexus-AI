import { cert, initializeApp, getApps } from "firebase-admin/app"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let serviceAccount = null

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    } catch {
        try {
            const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf-8")
            serviceAccount = JSON.parse(decoded)
        } catch (err) {
            console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", err.message)
        }
    }
}

if (!serviceAccount) {
    const keyPath = path.resolve(__dirname, "../serviceAccountKey.json")
    if (fs.existsSync(keyPath)) {
        try {
            serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"))
        } catch (err) {
            console.error("❌ Failed to read serviceAccountKey.json:", err.message)
        }
    }
}

if (!serviceAccount) {
    console.warn("⚠️ No Firebase service account credentials found! Set FIREBASE_SERVICE_ACCOUNT env var or add serviceAccountKey.json.")
}

export const app = getApps().length === 0
    ? initializeApp(serviceAccount ? { credential: cert(serviceAccount) } : undefined)
    : getApps()[0]