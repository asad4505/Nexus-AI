import React, { useEffect, useState } from 'react'

/**
 * WelcomeSplash
 * A minimal, clean splash screen shown once per session before the login modal.
 * Auto-dismisses when user clicks "Get Started".
 *
 * Props:
 *  onDone — callback called when the splash should be removed
 */
function WelcomeSplash({ onDone }) {
    // Controls fade-in on mount and fade-out before dismiss
    const [visible, setVisible] = useState(false)
    const [leaving, setLeaving] = useState(false)

    // Trigger fade-in shortly after mount (allows CSS transition to run)
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50)
        return () => clearTimeout(t)
    }, [])

    const handleGetStarted = () => {
        // Start fade-out, then call onDone after transition completes
        setLeaving(true)
        setTimeout(() => onDone(), 600)
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0d0f14',
                opacity: visible && !leaving ? 1 : 0,
                transition: 'opacity 0.6s ease',
                pointerEvents: leaving ? 'none' : 'auto',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '28px',
                    transform: visible && !leaving ? 'translateY(0)' : 'translateY(18px)',
                    transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
                    opacity: visible && !leaving ? 1 : 0,
                    textAlign: 'center',
                    padding: '0 24px',
                    maxWidth: '480px',
                    width: '100%',
                }}
            >
                {/* Logo / Icon */}
                <div
                    style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
                        flexShrink: 0,
                    }}
                >
                    {/* Simple "N" letter mark */}
                    <span
                        style={{
                            fontSize: '34px',
                            fontWeight: '700',
                            color: '#ffffff',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            letterSpacing: '-1px',
                        }}
                    >
                        N
                    </span>
                </div>

                {/* Heading */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#f1f5f9',
                            letterSpacing: '-0.5px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            lineHeight: '1.2',
                        }}
                    >
                        Welcome to Nexus AI
                    </h1>
                    <p
                        style={{
                            margin: 0,
                            fontSize: '15px',
                            color: '#64748b',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            lineHeight: '1.6',
                        }}
                    >
                        Your AI-powered platform. Intelligent conversations,<br />
                        powerful tools — all in one place.
                    </p>
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: '40px',
                        height: '2px',
                        borderRadius: '2px',
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        opacity: 0.6,
                    }}
                />

                {/* CTA Button */}
                <button
                    onClick={handleGetStarted}
                    style={{
                        padding: '12px 36px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: '600',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                        boxShadow: '0 4px 16px rgba(99,102,241,0.30)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.45)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.30)'
                    }}
                    onMouseDown={e => { e.currentTarget.style.opacity = '0.85' }}
                    onMouseUp={e => { e.currentTarget.style.opacity = '1' }}
                >
                    Get Started
                </button>

                {/* Small footnote */}
                <p
                    style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#334155',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                >
                    Secure login via Google — no password required
                </p>
            </div>
        </div>
    )
}

export default WelcomeSplash
