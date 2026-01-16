import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';

const GameBoard = ({ songs, selectedId, playingId, onSelect, onTogglePlay }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 py-8">
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full"
                layout
            >
                <AnimatePresence>
                    {songs.map((song, index) => (
                        <motion.div
                            key={song.youtubeId} // Use unique ID for AnimatePresence
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: { delay: index * 0.1, duration: 0.4 }
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                                y: -50,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <Card
                                song={song}
                                isSelected={selectedId === song.youtubeId}
                                isPlaying={playingId === song.youtubeId}
                                onSelect={() => onSelect(song)}
                                onTogglePlay={() => onTogglePlay(song)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default GameBoard;
