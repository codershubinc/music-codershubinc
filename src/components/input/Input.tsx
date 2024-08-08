'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useId } from 'react'

function Input({
    type = "text",
    label,
    className,
    ...props
}: {
    type?: string,
    label?: string,
    className?: string,
    [key: string]: any
}, ref: any) {
    const id = useId()
    return (
        <div className='w-full px-5 flex flex-col justify-center items-center '>
            {label &&
                <label
                    htmlFor={id}
                    id={id}
                    className='text-left text-3xl font-semibold '
                >
                    {label}
                </label>
            }

            <input
                ref={ref}
                type={type}
                className={cn("w-full border-solid border-2 border-gray-700 p-1 rounded-2xl", className)}
                {...props}
                id={id}
            />
        </div>
    )
}

export default React.forwardRef(Input)