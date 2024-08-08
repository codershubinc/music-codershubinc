'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
    textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };

    return (
        <Button
            onClick={handleCopy}
            variant="outline"
            className="flex items-center gap-2"
        >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
        </Button>
    );
};

export default CopyButton;
