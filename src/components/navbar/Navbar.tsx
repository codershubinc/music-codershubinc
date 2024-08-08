'use client'
import { cn } from '@/lib/utils'
import React from 'react'
import RightDropdownMenu from './RightDropdownMenu'
import { ModeToggle } from '@/components/ui/themeBtn'

function Navbar({ className }: { className: string }) {
    return (
        <header
            className={cn("flex flex-col  sticky  top-0  ", className)}
        >
            <nav
                className={cn("flex items-center h-[45px] dark:bg-[#212121] justify-between p-4  mx-auto w-[90vw] rounded-full mt-2", className)}
            >
                <h1>Navbar</h1>
                <div
                    className='flex items-center gap-4 '
                >
                    <ModeToggle />
                    <RightDropdownMenu />
                </div>
            </nav>
        </header>
    )
}

export default Navbar