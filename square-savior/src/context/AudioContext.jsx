import { createContext, useContext, useRef, useState, useCallback } from 'react';

const AudioContextState = createContext(null);

export const useAudioContext = () => {
    const context = useContext(AudioContextState);
    if (!context) {
        throw new Error('useAudioContext must be used within AudioContextProvider');
    }
    return context;
};

export const AudioContextProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Initialize/unlock audio on user interaction (required for iOS)
    const unlockAudio = useCallback(() => {
        if (isUnlocked) return Promise.resolve(true);

        return new Promise((resolve) => {
            // Create a silent audio element and play it to unlock audio context
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+M4wAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+M4wDsAAADSAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

            const playPromise = silentAudio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        silentAudio.pause();
                        silentAudio.src = '';
                        setIsUnlocked(true);
                        console.log('🔓 Audio unlocked for iOS');
                        resolve(true);
                    })
                    .catch((error) => {
                        console.warn('⚠️ Could not unlock audio:', error);
                        // Still mark as attempted
                        resolve(false);
                    });
            } else {
                setIsUnlocked(true);
                resolve(true);
            }
        });
    }, [isUnlocked]);

    const value = {
        audioRef,
        isUnlocked,
        unlockAudio
    };

    return (
        <AudioContextState.Provider value={value}>
            {children}
        </AudioContextState.Provider>
    );
};
