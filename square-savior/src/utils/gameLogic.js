import { allSongs } from './dataLoader';

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

/**
 * Selects 5 random songs for a round, excluding already played ones
 * @param {Array} playedSongIds - List of youtubeIds to exclude
 * @returns {Array} Array of 5 song objects
 */
export function getRoundSongs(playedSongIds = []) {
    // Filter out songs that have already been played (or saved, depending on rule)
    // The user rule: "piocher 5 musiques aléatoires dans l'ensemble de la base de données"
    // Usually we don't want repeats in a single game sesiion.
    const availableSongs = allSongs.filter(song => !playedSongIds.includes(song.youtubeId));

    // Shuffle and pick 5
    const shuffled = shuffle([...availableSongs]);

    // If not enough songs, we might need to reset or handle end game, 
    // but with 20 rounds * 5 songs = 100 songs needed.
    // We have 16 years * 25 songs = 400 songs. Plenty.
    return shuffled.slice(0, 5);
}

export const TOTAL_ROUNDS = 20;
export const SONGS_PER_ROUND = 5;
