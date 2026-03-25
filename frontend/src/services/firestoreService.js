/**
 * Storage service for ZameenLink.
 * Uses localStorage as the primary reliable store.
 * Firestore sync is attempted in the background but failures are silently ignored.
 */
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const SAVED_KEY = 'zameenlink_saved_properties';
const HISTORY_KEY = 'zameenlink_prediction_history';

// ─── localStorage helpers ────────────────────────────────────

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function writeLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded – silently ignore
  }
}

// ─── Saved Properties ───────────────────────────────────────

export async function saveProperty(userId, property) {
  // 1. Persist locally first (instant)
  const saved = readLocal(SAVED_KEY);
  const exists = saved.some(
    (p) => String(p.property_id) === String(property.property_id)
  );
  if (!exists) {
    saved.unshift({ ...property, savedAt: new Date().toISOString() });
    writeLocal(SAVED_KEY, saved);
  }

  // 2. Background Firestore sync (best-effort)
  try {
    const ref = doc(db, 'users', userId, 'savedProperties', String(property.property_id));
    await setDoc(ref, { ...property, savedAt: serverTimestamp() });
  } catch (err) {
    console.warn('Firestore save skipped:', err.message);
  }
}

export async function removeSavedProperty(userId, propertyId) {
  // 1. Remove locally first
  const saved = readLocal(SAVED_KEY);
  writeLocal(
    SAVED_KEY,
    saved.filter((p) => String(p.property_id) !== String(propertyId))
  );

  // 2. Background Firestore sync
  try {
    const ref = doc(db, 'users', userId, 'savedProperties', String(propertyId));
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Firestore remove skipped:', err.message);
  }
}

const withTimeout = (promise, ms = 3000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore request timed out')), ms))
  ]);
};

export async function getSavedProperties(userId) {
  try {
    if (!userId) return readLocal(SAVED_KEY);
    
    const ref = collection(db, 'users', userId, 'savedProperties');
    const q = query(ref, orderBy('savedAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q), 3000);
    
    const properties = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        savedAt: data.savedAt?.toDate ? data.savedAt.toDate().toISOString() : data.savedAt
      };
    });
    
    // Sync to local storage for quick access
    writeLocal(SAVED_KEY, properties);
    return properties;
  } catch (err) {
    console.warn('Firestore fetch failed, using local storage:', err.message);
    return readLocal(SAVED_KEY);
  }
}

// ─── Prediction History ─────────────────────────────────────

export async function savePredictionHistory(userId, property, prediction) {
  // 1. Persist locally
  const history = readLocal(HISTORY_KEY);
  history.unshift({
    id: `${Date.now()}_${property.property_id}`,
    propertyId: property.property_id,
    areaName: property.area_name,
    bhk: property.bhk,
    plotSize: property.plot_size_sqft,
    predictedPrice: prediction.predicted_fair_value,
    pricePerSqft: prediction.price_per_sqft,
    riskLevel: prediction.scam_analysis?.risk_level || 'UNKNOWN',
    createdAt: new Date().toISOString(),
  });
  // Keep last 50 entries
  writeLocal(HISTORY_KEY, history.slice(0, 50));

  // 2. Background Firestore sync
  try {
    const ref = collection(db, 'users', userId, 'predictionHistory');
    await addDoc(ref, {
      propertyId: property.property_id,
      areaName: property.area_name,
      bhk: property.bhk,
      plotSize: property.plot_size_sqft,
      predictedPrice: prediction.predicted_fair_value,
      pricePerSqft: prediction.price_per_sqft,
      riskLevel: prediction.scam_analysis?.risk_level || 'UNKNOWN',
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore history save skipped:', err.message);
  }
}

export async function getPredictionHistory(userId, maxResults = 20) {
  try {
    if (!userId) return readLocal(HISTORY_KEY);
    
    const ref = collection(db, 'users', userId, 'predictionHistory');
    const q = query(ref, orderBy('createdAt', 'desc'), limit(maxResults));
    const snapshot = await withTimeout(getDocs(q), 3000);
    
    const history = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });
    
    // Sync to local storage
    writeLocal(HISTORY_KEY, history);
    return history;
  } catch (err) {
    console.warn('Firestore history fetch failed, using local storage:', err.message);
    return readLocal(HISTORY_KEY);
  }
}
