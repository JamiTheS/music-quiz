import { motion } from 'framer-motion';

const AuroraBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />

            {/* Aurora layer 1 - Cyan/Teal */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 80% 50% at 80% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 80% 50% at 40% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                    ],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Aurora layer 2 - Purple/Magenta */}
            <motion.div
                className="absolute inset-0 opacity-25"
                animate={{
                    background: [
                        'radial-gradient(ellipse 60% 40% at 70% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
                        'radial-gradient(ellipse 60% 40% at 30% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
                        'radial-gradient(ellipse 60% 40% at 60% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
                        'radial-gradient(ellipse 60% 40% at 70% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
                    ],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Aurora layer 3 - Pink/Rose */}
            <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                    background: [
                        'radial-gradient(ellipse 50% 30% at 50% 60%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 50% 30% at 20% 40%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 50% 30% at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 50% 30% at 50% 60%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
                    ],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Aurora layer 4 - Green/Emerald */}
            <motion.div
                className="absolute inset-0 opacity-15"
                animate={{
                    background: [
                        'radial-gradient(ellipse 70% 35% at 30% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 70% 35% at 60% 60%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 70% 35% at 40% 45%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 70% 35% at 30% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
                    ],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Subtle star-like particles */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.1, 0.5, 0.1],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            {/* Subtle noise/grain overlay for texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};

export default AuroraBackground;
