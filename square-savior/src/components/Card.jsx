import { motion } from 'framer-motion';
import { Play, Pause, Check } from 'lucide-react';
import clsx from 'clsx';

const Card = ({ song, isSelected, isPlaying, onSelect, onTogglePlay }) => {
    // Use iTunes artwork if available, fallback to YouTube thumbnail
    const imageUrl = song.artwork || `https://img.youtube.com/vi/${song.youtubeId}/maxresdefault.jpg`;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                "relative rounded-xl overflow-hidden cursor-pointer group aspect-[3/4]",
                "border-2 transition-all duration-300",
                isSelected ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : "border-transparent hover:border-white/20"
            )}
            onClick={onSelect}
        >
            {/* Background Image */}
            <div className="absolute inset-0 bg-gray-900">
                <img
                    src={imageUrl}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        // Fallback if image doesn't exist
                        if (!e.target.src.includes('hqdefault')) {
                            e.target.src = `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;
                        }
                    }}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-4 pb-6 flex flex-col items-center text-center">
                <h3 className={clsx(
                    "font-bold text-lg leading-tight mb-1 max-w-full truncate px-2",
                    isSelected ? "text-cyan-400" : "text-white"
                )}>
                    {song.title}
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                    {song.artist}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    {song.year}
                </p>
            </div>

            {/* Play/Loading Indicator Overlay */}
            {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin absolute inset-0 md:w-16 md:h-16" />
                        <div className="w-12 h-12 flex items-center justify-center text-cyan-400 md:w-16 md:h-16">
                            <span className="font-bold text-xs uppercase tracking-widest animate-pulse">Playing</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3 bg-cyan-500 text-black rounded-full p-1 shadow-lg shadow-cyan-500/50">
                    <Check size={16} strokeWidth={3} />
                </div>
            )}

            {/* Hover overlay hint */}
            {!isSelected && !isPlaying && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="text-white fill-white opacity-80" size={48} />
                </div>
            )}
        </motion.div>
    );
};

export default Card;
