import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

const AudioPlayer = forwardRef(({ song, isPlaying, onEnded, onError, onReady, onNeedsInteraction, volume = 0.5 }, ref) => {
    const audioRef = useRef(null);
    const timeoutRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasPlaybackError, setHasPlaybackError] = useState(false);
    const fetchedSongRef = useRef(null); // Track which song we've fetched
    const playAttemptedRef = useRef(false);
    const retryCountRef = useRef(0);

    // Fetch iTunes preview URL when song changes
    useEffect(() => {
        if (!song) {
            setPreviewUrl(null);
            return;
        }

        // Prevent fetching the same song multiple times
        const songKey = `${song.youtubeId}-${song.artist}-${song.title}`;
        if (fetchedSongRef.current === songKey) {
            return;
        }

        const fetchPreviewUrl = async () => {
            setIsLoading(true);
            setHasPlaybackError(false);
            playAttemptedRef.current = false;
            retryCountRef.current = 0;
            fetchedSongRef.current = songKey;

            try {
                // Search iTunes API for the song
                const query = encodeURIComponent(`${song.artist} ${song.title}`);
                const url = `https://itunes.apple.com/search?term=${query}&media=music&limit=1&entity=song`;

                console.log('🎵 Fetching preview for:', song.title, 'by', song.artist);

                const response = await fetch(url);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    const result = data.results[0];
                    const preview = result.previewUrl;
                    const artwork = result.artworkUrl100?.replace('100x100', '600x600') || result.artworkUrl100;

                    console.log('✅ Preview found');

                    setPreviewUrl(preview);

                    // Notify parent about artwork
                    if (onReady && artwork) {
                        onReady({ artwork, previewUrl: preview });
                    }
                } else {
                    console.warn('❌ No preview found for:', song.title);
                    if (onError) onError(new Error('No preview available'));
                }
            } catch (error) {
                console.error('❌ Error fetching iTunes preview:', error);
                if (onError) onError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreviewUrl();
    }, [song?.youtubeId]);

    // Attempt to play audio with iOS-friendly handling
    const attemptPlay = useCallback(async () => {
        if (!audioRef.current || !previewUrl) return false;

        try {
            // Set volume to maximum
            audioRef.current.volume = 1.0;
            audioRef.current.currentTime = 0;

            console.log('▶️ Attempting playback for:', song?.title);

            await audioRef.current.play();

            console.log('✅ Audio playing successfully');
            setHasPlaybackError(false);
            playAttemptedRef.current = true;

            return true;
        } catch (error) {
            console.error('❌ Error playing audio:', error);

            // Check if this is an iOS autoplay restriction error
            if (error.name === 'NotAllowedError') {
                console.log('⚠️ Autoplay blocked - needs user interaction');
                setHasPlaybackError(true);

                // Notify parent that user interaction is needed
                if (onNeedsInteraction) {
                    onNeedsInteraction();
                }

                // Don't call onError immediately for autoplay issues on first attempt
                // Give user a chance to tap to play
                if (retryCountRef.current > 0) {
                    if (onError) onError(error);
                }
                retryCountRef.current++;
            } else {
                // For other errors, report immediately
                if (onError) onError(error);
            }

            return false;
        }
    }, [previewUrl, song?.title, onError, onNeedsInteraction]);

    // Handle playback control
    const isCurrentlyPlayingRef = useRef(false);
    const currentPreviewUrlRef = useRef(null);

    // Separate effect for the 10-second auto-advance timer
    // This ensures the timer always runs regardless of audio loading state
    useEffect(() => {
        if (isPlaying && previewUrl) {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set timeout to stop after 10 seconds
            console.log('⏱️ Starting 10-second timer');
            timeoutRef.current = setTimeout(() => {
                console.log('⏱️ 10 seconds elapsed, moving to next song');
                isCurrentlyPlayingRef.current = false;
                if (audioRef.current) {
                    audioRef.current.pause();
                }
                if (onEnded) onEnded();
            }, 10000);
        } else {
            // Clear timeout when not playing
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isPlaying, previewUrl, onEnded]);

    // Separate effect for handling audio playback
    useEffect(() => {
        // Track if previewUrl changed
        const previewUrlChanged = currentPreviewUrlRef.current !== previewUrl;
        currentPreviewUrlRef.current = previewUrl;

        if (!audioRef.current || !previewUrl) {
            isCurrentlyPlayingRef.current = false;
            return;
        }

        if (isPlaying) {
            // Only start playback if not already playing this URL, or if URL changed
            if (!isCurrentlyPlayingRef.current || previewUrlChanged) {
                isCurrentlyPlayingRef.current = true;

                attemptPlay().then(success => {
                    if (!success) {
                        isCurrentlyPlayingRef.current = false;
                    }
                });
            }
        } else {
            // Pause if not playing
            if (audioRef.current && isCurrentlyPlayingRef.current) {
                audioRef.current.pause();
                console.log('⏸️ Playback paused');
                isCurrentlyPlayingRef.current = false;
            }
        }
    }, [isPlaying, previewUrl, attemptPlay]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Manual play handler (exposed for user interaction)
    const handleManualPlay = useCallback(() => {
        attemptPlay();
    }, [attemptPlay]);

    // Expose manual play handler to parent via ref
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.manualPlay = handleManualPlay;
        }
    }, [handleManualPlay]);

    // Expose retryPlay method to parent via ref
    useImperativeHandle(ref, () => ({
        retryPlay: () => {
            console.log('🔄 Retry play triggered from parent');
            attemptPlay();
        }
    }), [attemptPlay]);

    if (!song || !previewUrl) return null;

    return (
        <audio
            ref={audioRef}
            src={previewUrl}
            preload="auto"
            playsInline
            onError={(e) => {
                console.error('❌ Audio element error:', e);
                if (onError) onError(new Error('Audio playback failed'));
            }}
            onEnded={() => {
                console.log('🎵 Audio ended naturally');
                if (onEnded) onEnded();
            }}
            onLoadedMetadata={() => {
                console.log('✅ Audio metadata loaded');
            }}
            onCanPlayThrough={() => {
                console.log('✅ Audio can play through');
                // If we had a playback error and audio is now ready, try again
                if (hasPlaybackError && isPlaying && !isCurrentlyPlayingRef.current) {
                    attemptPlay();
                }
            }}
        />
    );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;

