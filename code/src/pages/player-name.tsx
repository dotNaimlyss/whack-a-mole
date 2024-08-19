import { useState } from 'react';
import { useRouter } from 'next/router';

const PlayerName: React.FC = () => {
  const [name, setName] = useState<string>('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Save the player's name to sessionStorage or pass it to the game via URL
      sessionStorage.setItem('playerName', name);
      router.push('/'); // Redirect to the game page
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Enter Your In-Game Name</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 mb-4 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Enter your name"
          required
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-300"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default PlayerName;
