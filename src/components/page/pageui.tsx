'use client'
import { cn } from '@/lib/utils'
import React from 'react'

function PageUi({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div
            className={cn(" h-screen w-full dark:bg-black dark:text-white", className)}
        >
            {children}
        </div>
    )
}

export default PageUi