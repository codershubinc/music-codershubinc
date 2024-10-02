import { Maximize2, Minimize2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const KeepScreenAwake: React.FC = () => {
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const requestWakeLock = async () => {
            if (!('wakeLock' in navigator)) {
                toast.error('Wake Lock API is not supported in this browser');
                return;
            }

            try {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                toast.success('Wake lock is active');
            } catch (err: any) {
                toast.error(`Failed to request wake lock: ${err.name}, ${err.message}`);
            }
        };

        // Request wake lock on component mount
        requestWakeLock();
        toggleFullscreen();
        requestLandscape();

        // Release the wake lock when the component unmounts
        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release().then(() => {
                    toast.success('Wake lock released');
                });
            }
        };
    }, []);

    const requestLandscape = async () => {
        if ('screen' in window && 'orientation' in window.screen) {
            try {
                const screenOrientation = window.screen.orientation as any; // Use type assertion here
                await screenOrientation.lock('landscape');
                toast.success('Landscape mode is active');
            } catch (err: any) {
                toast.error(`Failed to lock landscape mode: ${err.name}, ${err.message}`);
            }
        } else {
            toast.error('Screen Orientation API is not supported in this browser');
        }
    };

    


    const toggleFullscreen = async () => {
        const documentElement = document.documentElement;

        if (isFullscreen) {
            // Exit fullscreen
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                toast.success('Exited fullscreen mode');
            }
        } else {
            // Request fullscreen
            if (documentElement.requestFullscreen) {
                try {
                    await documentElement.requestFullscreen();
                    toast.success('Fullscreen mode is active');
                } catch (err: any) {
                    toast.error(`Failed to enter fullscreen: ${err.name}, ${err.message}`);
                }
            } else {
                toast.error('Fullscreen API is not supported in this browser');
            }
        }

        // Toggle fullscreen state
        setIsFullscreen(!isFullscreen);
    };


    return (
        <button
            className='mt-4 px-4 py-2 fixed bottom-0 left-0 bg-blue-500 text-white rounded'
            onClick={toggleFullscreen}
        >
            {isFullscreen ?

                <Minimize2 />
                :
                <Maximize2 />
            }
        </button>

    );
};

export default KeepScreenAwake;

