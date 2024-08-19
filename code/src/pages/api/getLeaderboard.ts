// src/pages/api/getLeaderboard.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10)); // Fetch top 10 scores
    const querySnapshot = await getDocs(q);

    const leaderboard = querySnapshot.docs.map((doc) => doc.data());

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
}
