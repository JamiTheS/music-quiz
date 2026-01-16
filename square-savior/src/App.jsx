import { useState, useCallback } from 'react';
import Landing from './components/Landing';
import Game from './components/Game';
import Result from './components/Result';
import { AudioContextProvider, useAudioContext } from './context/AudioContext';

function AppContent() {
  const [view, setView] = useState('landing'); // 'landing', 'game', 'result'
  const [savedSongs, setSavedSongs] = useState([]);
  const { unlockAudio } = useAudioContext();

  const handleStart = useCallback(async () => {
    // Unlock audio on iOS before starting the game
    await unlockAudio();
    setView('game');
  }, [unlockAudio]);

  const handleEndGame = (songs) => {
    setSavedSongs(songs);
    setView('result');
  };

  const handleRestart = useCallback(async () => {
    // Also unlock audio on restart
    await unlockAudio();
    setSavedSongs([]);
    setView('game');
  }, [unlockAudio]);

  return (
    <>
      {view === 'landing' && (
        <Landing onStart={handleStart} />
      )}

      {view === 'game' && (
        <Game onEndGame={handleEndGame} />
      )}

      {view === 'result' && (
        <Result savedSongs={savedSongs} onRestart={handleRestart} />
      )}
    </>
  );
}

function App() {
  return (
    <AudioContextProvider>
      <AppContent />
    </AudioContextProvider>
  );
}

export default App;
