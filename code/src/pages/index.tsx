import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Leaderboard from '../pages/components/leaderboard';

const Home: React.FC = () => {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(10); // Adjusted to 10 seconds
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [bestPlayer, setBestPlayer] = useState<{ name: string; score: number }>({ name: 'Loading...', score: 0 });

  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moleInterval = useRef<number>(1000); // Base interval for mole appearance

  const router = useRouter();

  // Redirect to player name input page if name is not set
  useEffect(() => {
    const name = sessionStorage.getItem('playerName');
    if (!name) {
      router.push('/player-name');
    } else {
      setPlayerName(name);
    }
  }, [router]);

  // Set up game moles with quick appearance and disappearance
  useEffect(() => {
    if (isGameActive) {
      // Function to update mole visibility
      const updateMoles = () => {
        setMoles((prevMoles) => {
          const newMoles = Array(9).fill(false);
          const randomIndex = Math.floor(Math.random() * 9);
          newMoles[randomIndex] = true;
          return newMoles;
        });

        // Hide mole after 0.1 second
        setTimeout(() => {
          setMoles((prevMoles) => prevMoles.map(() => false));
        }, 7000); // Mole disappears after 0.1 second
      };

      // Update moles at regular intervals
      moleTimerRef.current = setInterval(updateMoles, moleInterval.current);

      return () => {
        if (moleTimerRef.current) clearInterval(moleTimerRef.current);
      };
    }
  }, [isGameActive]);

  // Handle game timer and end of game
  useEffect(() => {
    if (timeLeft > 0 && isGameActive) {
      countdownTimerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      };
    } else if (timeLeft === 0) {
      setIsGameActive(false);
      saveScore(playerName || 'Anonymous', score);
      alert(`Game over, ${playerName}! Your score is ${score}`);
      fetchBestPlayer();
    }
  }, [timeLeft, isGameActive, playerName, score]);

  // Start a new game
  const startGame = () => {
    setScore(0);
    setTimeLeft(10); // Set the game duration to 10 seconds
    setIsGameActive(true);
  };

  // Handle mole click
  const hitMole = (index: number) => {
    if (moles[index]) {
      setScore(prev => prev + 1);
      setMoles(prev => prev.map((mole, i) => (i === index ? false : mole)));
    }
  };

  // Save score to Firebase
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
  

  // Fetch the best player
  const fetchBestPlayer = async () => {
    try {
      const response = await fetch('/api/getBestPlayer');
      const data = await response.json();
      setBestPlayer(data);
    } catch (error) {
      console.error('Error fetching best player:', error);
    }
  };

  // Fetch the best player on component mount
  useEffect(() => {
    fetchBestPlayer();
  }, []);

  // Increase game difficulty over time
  useEffect(() => {
    if (isGameActive) {
      const difficultyInterval = setInterval(() => {
        if (moleInterval.current > 300) {
          moleInterval.current -= 100; // Decrease interval to increase difficulty
          clearInterval(moleTimerRef.current as NodeJS.Timeout);
          moleTimerRef.current = setInterval(() => {
            setMoles((prevMoles) => {
              const newMoles = Array(9).fill(false);
              const randomIndex = Math.floor(Math.random() * 9);
              newMoles[randomIndex] = true;
              return newMoles;
            });

            // Hide mole after 0.1 second
            setTimeout(() => {
              setMoles((prevMoles) => prevMoles.map(() => false));
            }, 7000);
          }, moleInterval.current);
        }
      }, 1000); // Increase difficulty every 5 seconds

      return () => clearInterval(difficultyInterval);
    }
  }, [isGameActive]);

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
      <Leaderboard/>
    </div>
  );
};

export default Home;
