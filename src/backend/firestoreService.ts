import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Backend Firestore Database Collections
 * Centralized collection names for Firestore persistence
 */
export const COLLECTIONS = {
  USERS: 'users',
  SWAP_REQUESTS: 'swap_requests',
  SESSIONS: 'sessions',
  CHAT_MESSAGES: 'chat_messages',
  PROBLEM_REPORTS: 'problem_reports',
  REVIEWS: 'reviews',
  PLATFORM_STATS: 'platform_stats',
} as const;

/**
 * Collection reference helpers
 */
export const getCollectionRef = (collectionName: string) => collection(db, collectionName);
export const getDocumentRef = (collectionName: string, docId: string) => doc(db, collectionName, docId);

export {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot
};
