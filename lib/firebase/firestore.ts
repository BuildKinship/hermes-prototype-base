import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "./client";
import type { PrototypeManifest } from "@/types/manifest";

export type FirestorePrototype = PrototypeManifest & { createdAt?: unknown };

const COL = "prototypes";

/** Create a new prototype document; returns the Firestore UUID */
export async function createPrototype(
  data: Omit<FirestorePrototype, "createdAt">
): Promise<string> {
  const ref: DocumentReference = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Fetch a single prototype by UUID */
export async function getPrototype(
  uuid: string
): Promise<FirestorePrototype | null> {
  const snap = await getDoc(doc(db, COL, uuid));
  if (!snap.exists()) return null;
  return snap.data() as FirestorePrototype;
}

/** Fetch all prototypes, ordered by creation time desc */
export async function listPrototypes(): Promise<
  (FirestorePrototype & { id: string })[]
> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as FirestorePrototype),
  }));
}

/** Update prototype metadata by UUID */
export async function updatePrototype(
  uuid: string,
  data: Partial<FirestorePrototype>
): Promise<void> {
  await updateDoc(doc(db, COL, uuid), data);
}
