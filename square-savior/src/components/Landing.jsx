import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import AuroraBackground from './AuroraBackground';

const Landing = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white overflow-hidden relative">
            {/* Aurora Background Effect */}
            <AuroraBackground />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 text-center"
            >
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    SQUARE<br />SAVIOR
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 font-light mb-12 tracking-wide uppercase">
                    Save One Song • 20 Rounds • Build Your Legacy
                </p>

                <motion.button
                    onClick={onStart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold tracking-wider uppercase overflow-hidden hover:bg-white hover:text-black transition-colors duration-300 rounded-none"
                >
                    <span className="relative z-10">Lancer l'expérience</span>
                    <Play size={20} className="relative z-10 fill-current" />

                    {/* Neon Glow Effect on Hover */}
                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
            </motion.div>

            <div className="absolute bottom-8 text-xs text-gray-600 tracking-widest uppercase z-10">
                2010 — 2025 Database Loaded
            </div>
        </div>
    );
};

export default Landing;
