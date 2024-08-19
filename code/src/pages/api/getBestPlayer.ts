import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const bestPlayer = querySnapshot.docs[0].data();
    res.status(200).json(bestPlayer);
  } else {
    res.status(200).json({ name: 'No players yet', score: 0 });
  }
}
