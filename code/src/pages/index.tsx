import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [bestPlayer, setBestPlayer] = useState<{ name: string; score: number }>({ name: 'Loading...', score: 0 });

  const router = useRouter();

  useEffect(() => {
    const name = sessionStorage.getItem('playerName');
    if (!name) {
      router.push('/player-name'); // Redirect to the name input page if not set
    } else {
      setPlayerName(name);
    }
  }, [router]);

  useEffect(() => {
    if (isGameActive) {
      const timer = setInterval(() => {
        setMoles(moles.map(() => Math.random() > 0.7));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [moles, isGameActive]);

  useEffect(() => {
    if (timeLeft > 0 && isGameActive) {
      const countdown = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
      saveScore(playerName || 'Anonymous', score);
      alert(`Game over, ${playerName}! Your score is ${score}`);
      fetchBestPlayer();
    }
  }, [timeLeft, isGameActive, playerName, score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsGameActive(true);
  };

  const hitMole = (index: number) => {
    if (moles[index]) {
      setScore(score + 1);
      setMoles(moles.map((mole, i) => (i === index ? false : mole)));
    }
  };

  const saveScore = async (name: string, score: number) => {
    try {
      const response = await fetch('/api/saveScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score }),
      });
      if (!response.ok) {
        throw new Error('Failed to save score');
      }
      console.log(await response.json());
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };
  

  const fetchBestPlayer = async () => {
    const response = await fetch('/api/getBestPlayer');
    const data = await response.json();
    setBestPlayer(data);
  };

  useEffect(() => {
    fetchBestPlayer();
  }, []);

  if (!playerName) return null; // Prevent rendering until the name is retrieved

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Whack-a-Mole</h1>
      <p className="text-lg mb-2">Player: {playerName}</p>
      <p className="text-lg mb-2">Score: {score}</p>
      <p className="text-lg mb-2">Time Left: {timeLeft}s</p>
      <p className="text-lg mb-4">Best Player: {bestPlayer.name} - {bestPlayer.score}</p>
      <button 
        onClick={startGame} 
        disabled={isGameActive} 
        className="px-4 py-2 bg-white text-black font-bold rounded-md mb-6 hover:bg-gray-300 disabled:opacity-50"
      >
        Start Game
      </button>
      <div className="grid grid-cols-3 gap-4">
        {moles.map((mole, index) => (
          <div 
            key={index} 
            className={`h-24 w-24 bg-gray-800 border-2 border-white rounded-full ${mole ? 'bg-white' : 'bg-gray-800'} cursor-pointer transition-colors duration-200`}
            onClick={() => hitMole(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
