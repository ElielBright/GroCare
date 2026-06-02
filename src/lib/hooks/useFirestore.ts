'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, query, limit } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { Food, Exercise, Recipe, HealthTip, HealthGoal, DailyLog } from '@/types';

export function useCollection<T>(collectionName: string) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const db = getFirestoreInstance();
        const snapshot = await getDocs(collection(db, collectionName));
        const items: (T & { id: string })[] = [];
        snapshot.forEach((doc) => items.push({ ...doc.data() as T, id: doc.id }));
        setData(items);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [collectionName]);

  return { data, loading };
}

export function useDocument<T>(collectionName: string, documentId: string | undefined) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentId) { setLoading(false); return; }
    const id: string = documentId;
    async function fetch() {
      try {
        const db = getFirestoreInstance();
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (snap.exists()) setData({ ...snap.data() as T, id: snap.id });
      } catch (err) {
        console.error(`Error fetching ${collectionName}/${id}:`, err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [collectionName, documentId]);

  return { data, loading };
}
