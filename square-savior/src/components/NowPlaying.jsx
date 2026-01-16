import { motion } from 'framer-motion';
import { Music, Pause, Play } from 'lucide-react';
import clsx from 'clsx';

const NowPlaying = ({ song, isPlaying, progress, onTogglePlay, currentIndex, totalSongs }) => {
    const imageUrl = song?.artwork || (song?.youtubeId ? `https://img.youtube.com/vi/${song.youtubeId}/maxresdefault.jpg` : null);

    // Format progress as mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!song) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Music size={64} className="mb-4 opacity-50" />
                <p className="text-lg">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-6">
            {/* Album Art */}
            <motion.div
                key={song.youtubeId}
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-64 h-64 md:w-80 md:h-80 mb-8"
            >
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse" />

                {/* Album cover */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={imageUrl}
                        alt={song.title}
                        className={clsx(
                            "w-full h-full object-cover transition-transform duration-1000",
                            isPlaying && "scale-105"
                        )}
                        onError={(e) => {
                            if (!e.target.src.includes('hqdefault')) {
                                e.target.src = `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`;
                            }
                        }}
                    />

                    {/* Vinyl record effect when playing */}
                    {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-4 border-white/30 animate-spin" style={{ animationDuration: '3s' }}>
                                    <div className="w-3 h-3 rounded-full bg-white/50 mx-auto mt-3" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Song Info */}
            <motion.div
                key={`info-${song.youtubeId}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 truncate max-w-xs md:max-w-md">
                    {song.title}
                </h2>
                <p className="text-lg text-gray-400">{song.artist}</p>
                <p className="text-sm text-gray-600 mt-1">{song.year}</p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{formatTime(progress)}</span>
                    <span>0:10</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                        style={{ width: `${(progress / 10) * 100}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
            </div>

            {/* Song Counter */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Chanson</span>
                <div className="flex gap-1">
                    {Array.from({ length: totalSongs }).map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                i === currentIndex
                                    ? "bg-cyan-400 scale-125"
                                    : i < currentIndex
                                        ? "bg-gray-500"
                                        : "bg-gray-700"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* EQ Visualization */}
            <div className="flex items-end gap-1 h-8 mt-6">
                {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.5, 0.7, 0.4].map((height, i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full"
                        animate={{
                            height: isPlaying ? [height * 32, height * 16, height * 32] : height * 8
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: isPlaying ? Infinity : 0,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default NowPlaying;
