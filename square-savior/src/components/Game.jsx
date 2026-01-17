import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Disc, AlertCircle, Volume2, HelpCircle, SkipForward, Play } from 'lucide-react';
import NowPlaying from './NowPlaying';
import PlayedSongStrip from './PlayedSongStrip';
import AudioPlayer from './AudioPlayer';
import AuroraBackground from './AuroraBackground';
import { getRoundSongs, TOTAL_ROUNDS } from '../utils/gameLogic';
import clsx from 'clsx';

const Game = ({ onEndGame }) => {
    const [round, setRound] = useState(1);
    const [currentSongs, setCurrentSongs] = useState([]);
    const [savedSongs, setSavedSongs] = useState([]);
    const [allPlayedSongIds, setAllPlayedSongIds] = useState([]); // Track ALL songs shown to prevent duplicates
    const [selectedId, setSelectedId] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [notification, setNotification] = useState(null);
    const [artworkCache, setArtworkCache] = useState({});

    // Sequential reveal state
    const [autoPlayIndex, setAutoPlayIndex] = useState(0);
    const [revealedSongs, setRevealedSongs] = useState([]);
    const [playProgress, setPlayProgress] = useState(0);
    const [isRevealPhase, setIsRevealPhase] = useState(true); // true = revealing songs, false = selection phase
    const [needsUserInteraction, setNeedsUserInteraction] = useState(false); // iOS audio unlock

    const progressIntervalRef = useRef(null);
    const audioPlayerRef = useRef(null);

    // Initialize first round
    useEffect(() => {
        const initialSongs = getRoundSongs([]);
        setCurrentSongs(initialSongs);
        // Track all songs from this round to prevent duplicates
        setAllPlayedSongIds(initialSongs.map(s => s.youtubeId));
        setRevealedSongs([]);
        setAutoPlayIndex(0);
        setIsRevealPhase(true);
    }, []);

    // Preload artwork for all current songs
    useEffect(() => {
        const fetchArtworkForSongs = async () => {
            const promises = currentSongs.map(async (song) => {
                if (artworkCache[song.youtubeId]) return null;

                try {
                    const query = encodeURIComponent(`${song.artist} ${song.title}`);
                    const url = `https://itunes.apple.com/search?term=${query}&media=music&limit=1&entity=song`;
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.results?.length > 0) {
                        const artwork = data.results[0].artworkUrl100?.replace('100x100', '600x600');
                        return { id: song.youtubeId, artwork };
                    }
                } catch (error) {
                    console.warn('Failed to preload artwork for:', song.title);
                }
                return null;
            });

            const results = await Promise.all(promises);
            const newCache = {};
            results.forEach(result => {
                if (result) newCache[result.id] = result.artwork;
            });

            if (Object.keys(newCache).length > 0) {
                setArtworkCache(prev => ({ ...prev, ...newCache }));
            }
        };

        if (currentSongs.length > 0) {
            fetchArtworkForSongs();
        }
    }, [currentSongs]);

    // Auto-play: Start playing current song during reveal phase
    useEffect(() => {
        if (currentSongs.length > 0 && isRevealPhase && !isTransitioning && autoPlayIndex < currentSongs.length) {
            const song = currentSongs[autoPlayIndex];
            if (song && playingId !== song.youtubeId) {
                setPlayingId(song.youtubeId);
                setPlayProgress(0);
            }
        }
    }, [currentSongs, autoPlayIndex, isRevealPhase, isTransitioning, playingId]);

    // Move to next song after current one finishes (defined first so it can be used in effects)
    const moveToNextSong = useCallback(() => {
        const currentSong = currentSongs[autoPlayIndex];

        // Add current song to revealed songs
        if (currentSong && !revealedSongs.find(s => s.youtubeId === currentSong.youtubeId)) {
            const enrichedSong = {
                ...currentSong,
                artwork: artworkCache[currentSong.youtubeId]
            };
            setRevealedSongs(prev => [...prev, enrichedSong]);
        }

        const nextIndex = autoPlayIndex + 1;

        if (nextIndex >= currentSongs.length) {
            // All songs revealed, switch to selection phase
            setIsRevealPhase(false);
            setPlayingId(null);
            setNotification({
                type: 'info',
                message: '🎵 Toutes les chansons ont été jouées ! Choisissez votre préférée.'
            });
        } else {
            // Move to next song
            setAutoPlayIndex(nextIndex);
            setPlayProgress(0);
        }
    }, [autoPlayIndex, currentSongs, revealedSongs, artworkCache]);

    // Progress timer with auto-advance fallback
    const progressFallbackRef = useRef(false);

    useEffect(() => {
        // Reset fallback flag when playing a new song
        progressFallbackRef.current = false;
    }, [playingId]);

    useEffect(() => {
        if (playingId && isRevealPhase) {
            progressIntervalRef.current = setInterval(() => {
                setPlayProgress(prev => {
                    // Fallback: if progress reaches 10 seconds, trigger moveToNextSong
                    // This ensures we always advance even if audio events don't fire
                    if (prev >= 10) {
                        if (!progressFallbackRef.current) {
                            progressFallbackRef.current = true;
                            console.log('⏱️ Progress fallback: 10s reached, moving to next song');
                            // Schedule the move on next tick to avoid state update conflicts
                            setTimeout(() => moveToNextSong(), 0);
                        }
                        return 10;
                    }
                    return prev + 0.1;
                });
            }, 100);
        } else {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        }

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [playingId, isRevealPhase, moveToNextSong]);

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSelect = (song) => {
        if (isTransitioning || isRevealPhase) return;

        if (selectedId === song.youtubeId) {
            setSelectedId(null);
        } else {
            setSelectedId(song.youtubeId);
        }
    };

    const handleSkipSong = () => {
        if (isRevealPhase) {
            moveToNextSong();
        }
    };

    const handleAudioError = () => {
        setNotification({
            type: 'error',
            message: '⚠️ Preview audio non disponible. Passage à la chanson suivante...'
        });
        setTimeout(moveToNextSong, 500);
    };

    const handleAudioReady = (data) => {
        if (data.artwork && playingId) {
            setArtworkCache(prev => ({
                ...prev,
                [playingId]: data.artwork
            }));
        }
    };

    const handleAudioEnded = () => {
        moveToNextSong();
    };

    const handleNeedsInteraction = useCallback(() => {
        setNeedsUserInteraction(true);
    }, []);

    const handleTapToPlay = useCallback(() => {
        setNeedsUserInteraction(false);
        // Trigger a retry of audio playback after user interaction
        if (audioPlayerRef.current && audioPlayerRef.current.retryPlay) {
            audioPlayerRef.current.retryPlay();
        }
    }, []);

    const handleNextRound = () => {
        if (!selectedId || isRevealPhase) return;

        const selectedSong = revealedSongs.find(s => s.youtubeId === selectedId);
        const newSaved = [...savedSongs, selectedSong];
        setSavedSongs(newSaved);

        if (round >= TOTAL_ROUNDS) {
            onEndGame(newSaved);
            return;
        }

        // Transition to next round
        setIsTransitioning(true);
        setPlayingId(null);
        setNotification(null);

        // Use allPlayedSongIds to exclude ALL songs that were shown, not just saved ones
        const nextSongs = getRoundSongs(allPlayedSongIds);
        // Add new round's songs to the tracking list
        const newPlayedIds = [...allPlayedSongIds, ...nextSongs.map(s => s.youtubeId)];

        setTimeout(() => {
            setRound(r => r + 1);
            setCurrentSongs(nextSongs);
            setAllPlayedSongIds(newPlayedIds);
            setRevealedSongs([]);
            setAutoPlayIndex(0);
            setSelectedId(null);
            setIsRevealPhase(true);
            setPlayProgress(0);
            setIsTransitioning(false);
        }, 400);
    };

    const playingSong = currentSongs.find(s => s.youtubeId === playingId);
    const currentDisplaySong = isRevealPhase && playingSong ? {
        ...playingSong,
        artwork: artworkCache[playingSong.youtubeId]
    } : null;

    return (
        <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden relative">
            {/* Aurora Background Effect */}
            <AuroraBackground />

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#050505]/95 backdrop-blur z-20 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        <Disc size={20} className={clsx("text-cyan-400", playingId && "animate-spin")} />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm tracking-widest uppercase text-gray-400">Round</h2>
                        <div className="text-xl font-mono text-white leading-none">
                            {round} <span className="text-gray-600">/ {TOTAL_ROUNDS}</span>
                        </div>
                    </div>
                </div>

                {/* Skip Button - only during reveal phase */}
                {isRevealPhase && (
                    <button
                        onClick={handleSkipSong}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                    >
                        <SkipForward size={16} />
                        Passer
                    </button>
                )}

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-500 transition-all duration-300" style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }} />

                <button
                    onClick={handleNextRound}
                    disabled={!selectedId || isTransitioning || isRevealPhase}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm uppercase tracking-wide transition-all duration-300",
                        selectedId && !isTransitioning && !isRevealPhase
                            ? "bg-white text-black hover:bg-cyan-400 hover:scale-105"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    )}
                >
                    Confirm & Next
                    <ArrowRight size={16} />
                </button>
            </header>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="absolute top-20 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className={clsx(
                            "flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg backdrop-blur-md",
                            notification.type === 'error'
                                ? "bg-red-500/90 text-white"
                                : "bg-gray-900/90 text-white border border-cyan-500"
                        )}>
                            {notification.type === 'error' ? <AlertCircle size={20} /> : <Volume2 size={20} />}
                            <span className="font-medium">{notification.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                {isRevealPhase ? (
                    <>
                        {/* Now Playing - takes most of the space during reveal */}
                        <div className="flex-1 flex items-center justify-center relative">
                            <AnimatePresence mode="wait">
                                {currentDisplaySong && (
                                    <motion.div
                                        key={currentDisplaySong.youtubeId}
                                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, y: 100 }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full max-w-md"
                                    >
                                        <NowPlaying
                                            song={currentDisplaySong}
                                            isPlaying={!!playingId && !needsUserInteraction}
                                            progress={playProgress}
                                            currentIndex={autoPlayIndex}
                                            totalSongs={currentSongs.length}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* iOS Tap to Play overlay */}
                            <AnimatePresence>
                                {needsUserInteraction && isRevealPhase && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30"
                                    >
                                        <motion.button
                                            onClick={handleTapToPlay}
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                                                <Play size={40} className="text-black ml-1" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white font-bold text-lg">Toucher pour jouer</p>
                                                <p className="text-gray-400 text-sm mt-1">Requis sur iOS pour l'audio</p>
                                            </div>
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Small thumbnails at bottom during reveal */}
                        <PlayedSongStrip
                            songs={revealedSongs}
                            selectedId={selectedId}
                            onSelect={handleSelect}
                            isSelectionPhase={false}
                        />

                        {/* Instructions for reveal phase */}
                        <div className="border-t border-gray-800 bg-gray-900/30 p-4">
                            <div className="flex items-start gap-3 text-sm text-gray-400 justify-center">
                                <HelpCircle size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                                <p>
                                    <strong className="text-white">Chanson {autoPlayIndex + 1}/5</strong> en cours.
                                    Écoutez attentivement, vous choisirez votre préférée après.
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Selection phase - large cards in center */}
                        <PlayedSongStrip
                            songs={revealedSongs}
                            selectedId={selectedId}
                            onSelect={handleSelect}
                            isSelectionPhase={true}
                        />

                        {/* Instructions for selection phase */}
                        <div className="border-t border-gray-800 bg-gray-900/30 p-4">
                            <div className="flex items-start gap-3 text-sm text-gray-400 justify-center">
                                <HelpCircle size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                                <p>
                                    Cliquez sur votre chanson préférée, puis <strong className="text-white">"Confirm & Next"</strong>.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Invisible Audio Player */}
            <AudioPlayer
                ref={audioPlayerRef}
                song={playingSong}
                isPlaying={!!playingId}
                onEnded={handleAudioEnded}
                onError={handleAudioError}
                onReady={handleAudioReady}
                onNeedsInteraction={handleNeedsInteraction}
            />
        </div>
    );
};

export default Game;
