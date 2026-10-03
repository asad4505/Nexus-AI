import React, { useEffect, useState } from 'react'

/**
 * LoginWelcomeSplash
 * Shown immediately after a successful Google login.
 * Displays the user's avatar, name, email, and a warm welcome message.
 * Auto-dismisses after 3 seconds with a smooth fade-out.
 *
 * Props:
 *   user    — { name, email, avatar } from Redux userData
 *   onDone  — called when the splash should be removed
 */
function LoginWelcomeSplash({ user, onDone }) {
    const [visible, setVisible] = useState(false)
    const [leaving, setLeaving] = useState(false)

    // Fade in after mount
    useEffect(() => {
        const fadeIn = setTimeout(() => setVisible(true), 60)
        // Auto-dismiss after 3 seconds
        const dismiss = setTimeout(() => handleDone(), 3200)
        return () => {
            clearTimeout(fadeIn)
            clearTimeout(dismiss)
        }
    }, [])

    const handleDone = () => {
        if (leaving) return
        setLeaving(true)
        setTimeout(() => onDone(), 550)
    }

    // Derive first name
    const firstName = user?.name?.split(' ')[0] || 'there'

    // Fallback avatar: initials circle
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    const opacity = visible && !leaving ? 1 : 0

    return (
        <div
            onClick={handleDone}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                opacity,
                transition: 'opacity 0.55s ease',
                cursor: 'pointer',
            }}
        >
            {/* Card */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#13151c',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px',
                    padding: '40px 36px 36px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    width: '340px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                    transform: visible && !leaving ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
                    transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
                    textAlign: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    cursor: 'default',
                }}
            >
                {/* Confetti-style top accent */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    borderRadius: '24px 24px 0 0',
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
                }} />

                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid rgba(99,102,241,0.5)',
                                boxShadow: '0 0 0 4px rgba(99,102,241,0.15)',
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#fff',
                            border: '3px solid rgba(99,102,241,0.5)',
                        }}>
                            {initials}
                        </div>
                    )}

                    {/* Online / success badge */}
                    <div style={{
                        position: 'absolute',
                        bottom: '3px',
                        right: '3px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        border: '2px solid #13151c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* checkmark */}
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                {/* Welcome text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6366f1', fontWeight: '600', letterSpacing: '0.04em' }}>
                        WELCOME BACK
                    </p>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                        Hello, {firstName}! 👋
                    </h2>
                    <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                        Welcome to <span style={{ color: '#94a3b8', fontWeight: '500' }}>Nexus AI</span>.
                        Your workspace is ready.
                    </p>
                </div>

                {/* User info strip */}
                <div style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'flex-start',
                }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>
                        {user?.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#475569' }}>
                        {user?.email}
                    </span>
                </div>

                {/* Dismiss hint */}
                <p style={{ margin: 0, fontSize: '11px', color: '#1e293b' }}>
                    Tap anywhere to continue
                </p>

                {/* Auto-dismiss progress bar */}
                <div style={{
                    width: '100%',
                    height: '2px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        borderRadius: '2px',
                        width: visible ? '0%' : '100%',
                        transition: visible ? 'width 3.0s linear' : 'none',
                    }} />
                </div>
            </div>
        </div>
    )
}

export default LoginWelcomeSplash
