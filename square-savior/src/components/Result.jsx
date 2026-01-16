import { motion } from 'framer-motion';
import { ExternalLink, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const Result = ({ savedSongs, onRestart }) => {
    const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${savedSongs.map(s => s.youtubeId).join(',')}`;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black mb-8 text-center"
                >
                    YOUR LEGACY
                </motion.h1>

                {/* Grid of saved songs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 w-full mb-12">
                    {savedSongs.map((song, index) => (
                        <motion.div
                            key={song.youtubeId}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="aspect-square relative group overflow-hidden rounded-lg bg-gray-800"
                        >
                            <img
                                src={`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`}
                                alt={song.title}
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                                <div className="w-full">
                                    <p className="text-xs font-bold truncate text-white">{song.title}</p>
                                    <p className="text-[10px] text-gray-400 truncate">{song.artist}</p>
                                </div>
                            </div>
                            <div className="absolute top-1 right-1 bg-cyan-500/80 text-black text-[10px] font-bold px-1 rounded">
                                #{index + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                    <motion.a
                        href={playlistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all uppercase tracking-wide text-sm sm:text-base text-center"
                    >
                        <ExternalLink size={20} />
                        Generate YouTube Playlist
                    </motion.a>

                    <motion.button
                        onClick={onRestart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-gray-700 text-gray-300 font-bold py-4 px-6 rounded-lg hover:bg-white/5 transition-all uppercase tracking-wide text-sm sm:text-base"
                    >
                        <RefreshCw size={20} />
                        Play Again
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Result;
