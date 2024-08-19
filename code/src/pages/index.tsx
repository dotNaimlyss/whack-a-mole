import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);

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
      alert(`Game over! Your score is ${score}`);
    }
  }, [timeLeft, isGameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameActive(true);
  };

  const hitMole = (index: number) => {
    if (moles[index]) {
      setScore(score + 1);
      setMoles(moles.map((mole, i) => (i === index ? false : mole)));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Whack-a-Mole</h1>
      <p className="text-lg mb-2">Score: {score}</p>
      <p className="text-lg mb-4">Time Left: {timeLeft}s</p>
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
