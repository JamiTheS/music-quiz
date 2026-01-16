import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';

const PlayedSongStrip = ({ songs, selectedId, onSelect, isSelectionPhase }) => {
    if (songs.length === 0) return null;

    // During selection phase, show larger cards in the center
    if (isSelectionPhase && songs.length === 5) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl md:text-2xl font-bold text-white mb-6 text-center"
                >
                    🎵 Choisissez votre chanson préférée
                </motion.h2>

                <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
                    {songs.map((song, index) => {
                        const imageUrl = song.artwork || `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;
                        const isSelected = selectedId === song.youtubeId;

                        return (
                            <motion.button
                                key={song.youtubeId}
                                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20,
                                    delay: index * 0.1
                                }}
                                onClick={() => onSelect(song)}
                                className={clsx(
                                    "relative w-32 h-40 md:w-40 md:h-52 rounded-xl overflow-hidden transition-all duration-300",
                                    "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-cyan-400",
                                    "shadow-lg hover:shadow-xl hover:shadow-cyan-500/20",
                                    isSelected && "ring-4 ring-cyan-400 scale-105 shadow-xl shadow-cyan-500/30"
                                )}
                            >
                                {/* Glow effect when selected */}
                                {isSelected && (
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-50 -z-10" />
                                )}

                                <img
                                    src={imageUrl}
                                    alt={song.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;
                                    }}
                                />

                                {/* Dark overlay with info */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col items-center justify-end p-3">
                                    <span className="text-sm md:text-base text-white font-bold truncate w-full text-center mb-1">
                                        {song.title}
                                    </span>
                                    <span className="text-xs text-gray-300 truncate w-full text-center">
                                        {song.artist}
                                    </span>
                                    <span className="text-[10px] text-gray-500 mt-1">
                                        {song.year}
                                    </span>
                                </div>

                                {/* Selection indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2 bg-cyan-500 rounded-full p-1.5 shadow-lg"
                                    >
                                        <Check size={16} className="text-black" strokeWidth={3} />
                                    </motion.div>
                                )}

                                {/* Number badge */}
                                <div className="absolute top-2 left-2 bg-black/70 rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-xs text-white font-bold">{index + 1}</span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        );
    }

    // During reveal phase, show small thumbnails at the bottom
    return (
        <div className="border-t border-gray-800 bg-gray-900/50 p-4">
            <div className="flex items-center gap-2 mb-3 justify-center">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chansons écoutées
                </span>
                <span className="text-xs text-gray-600">
                    ({songs.length}/5)
                </span>
            </div>

            <div className="flex gap-3 justify-center">
                {/* Placeholder slots for unplayed songs */}
                {Array.from({ length: 5 }).map((_, index) => {
                    const song = songs[index];

                    if (!song) {
                        // Empty slot
                        return (
                            <div
                                key={`empty-${index}`}
                                className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gray-800/50 border border-gray-700 border-dashed flex items-center justify-center"
                            >
                                <span className="text-gray-600 text-xs">{index + 1}</span>
                            </div>
                        );
                    }

                    const imageUrl = song.artwork || `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;

                    return (
                        <motion.div
                            key={song.youtubeId}
                            initial={{ opacity: 0, scale: 0, y: -30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden opacity-80"
                        >
                            <img
                                src={imageUrl}
                                alt={song.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;
                                }}
                            />

                            {/* Number badge */}
                            <div className="absolute top-1 left-1 bg-black/70 rounded-full w-4 h-4 flex items-center justify-center">
                                <span className="text-[8px] text-white font-bold">{index + 1}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayedSongStrip;
