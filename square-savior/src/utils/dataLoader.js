// Import all JSON files directly using Vite's glob import
const modules = import.meta.glob('../data/*.json', { eager: true });

// Flatten all song arrays into a single master list, excluding templates
export const allSongs = Object.entries(modules)
    .filter(([path]) => !path.includes('template') && !path.includes('/_'))
    .flatMap(([_, mod]) => mod.default || mod);

// Helper to get songs by year if needed
export const getSongsByYear = (year) => {
    return allSongs.filter(song => song.year === year);
};
