import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  limit,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

const routesCollection = collection(db, 'routes');

// A small helper that makes search text easier to compare.
function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export async function searchRoutes(searchText) {
  if (!searchText) {
    return [];
  }

  const normalizedSearch = normalizeText(searchText);

  // For this MVP, we read the first batch of routes and filter them in the browser.
  // This keeps the code beginner-friendly and avoids a custom backend.
  const q = query(routesCollection, limit(20));
  const snapshot = await getDocs(q);

  const results = snapshot.docs
    .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
    .filter((route) => {
      const from = normalizeText(route.fromLocation);
      const to = normalizeText(route.toLocation);
      const town = normalizeText(route.town);
      return (
        from.includes(normalizedSearch) ||
        to.includes(normalizedSearch) ||
        `${from} ${to}`.includes(normalizedSearch) ||
        town.includes(normalizedSearch)
      );
    });

  return results;
}

export async function submitFare(payload) {
  const cleaned = {
    fromLocation: payload.fromLocation.trim(),
    toLocation: payload.toLocation.trim(),
    distanceKm: Number(payload.distanceKm),
    fairFareMin: Number(payload.farePaid),
    fairFareMax: Number(payload.farePaid),
    reportCount: 1,
    lastUpdated: serverTimestamp(),
    town: (payload.town || 'Unknown Town').trim(),
  };

  // If the same route already exists, we update it instead of creating a duplicate.
  const q = query(
    routesCollection,
    where('fromLocation', '==', cleaned.fromLocation),
    where('toLocation', '==', cleaned.toLocation),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0];
    const data = existingDoc.data();
    const newReportCount = (data.reportCount || 0) + 1;
    const newMin = Math.round(((data.fairFareMin || 0) * (data.reportCount || 0) + cleaned.fairFareMin) / newReportCount);
    const newMax = Math.round(((data.fairFareMax || 0) * (data.reportCount || 0) + cleaned.fairFareMax) / newReportCount);

    await updateDoc(doc(db, 'routes', existingDoc.id), {
      fairFareMin: newMin,
      fairFareMax: newMax,
      reportCount: newReportCount,
      lastUpdated: serverTimestamp(),
      distanceKm: cleaned.distanceKm || data.distanceKm,
      town: cleaned.town || data.town,
    });

    return { updated: true, id: existingDoc.id };
  }

  const docRef = await addDoc(routesCollection, cleaned);
  return { updated: false, id: docRef.id };
}
