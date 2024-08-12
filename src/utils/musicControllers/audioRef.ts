import { useRef } from "react";

const useAudioRef = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    return audioRef;
};

export default useAudioRef;