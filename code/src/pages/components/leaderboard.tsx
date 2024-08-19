import { useState, useEffect } from 'react';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/getLeaderboard');
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul className="text-lg">
        {leaderboard.map((player, index) => (
          <li key={index} className="mb-2">
            {index + 1}. {player.name} - {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
