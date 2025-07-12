import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="relative flex items-center justify-center">
                <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-700"></div>
                <motion.div
                    className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-indigo-500"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
            </div>
            <span className="ml-8 text-xl font-semibold text-indigo-300">Loading...</span>
        </div>
    );
};

export default LoadingScreen;
