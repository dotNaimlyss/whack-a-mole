// In saveScore.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, score } = req.body;
    console.log('Saving score:', { name, score }); // Debugging

    try {
      await addDoc(collection(db, 'scores'), { name, score });
      res.status(201).json({ message: 'Score saved successfully' });
    } catch (error) {
      console.error('Error saving score:', error); // Debugging
      res.status(500).json({ message: 'Error saving score', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
