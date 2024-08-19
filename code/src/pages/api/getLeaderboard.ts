import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = query(collection(db, 'scores'), orderBy('score', 'desc'));
  const querySnapshot = await getDocs(q);

  const leaderboard: { name: string; score: number }[] = [];

  const playerScores: Record<string, number> = {};

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const { name, score } = data;

    if (!playerScores[name] || playerScores[name] < score) {
      playerScores[name] = score;
    }
  });

  for (const [name, score] of Object.entries(playerScores)) {
    leaderboard.push({ name, score });
  }

  // Sort the leaderboard by score in descending order
  leaderboard.sort((a, b) => b.score - a.score);

  res.status(200).json(leaderboard.slice(0, 10)); // Return the top 10 scores
}
