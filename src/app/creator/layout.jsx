import React from 'react'

export default function layout({ children }) {
    return (
        <div>
            <main className="min-h-screen">
                {children}
            </main>
        </div>
    )
}
