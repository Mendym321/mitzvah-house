// firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, onSnapshot }
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClGS4b5mf8HhYFGN8n3C_glnnGfLlMjAU",
  authDomain: "mitzvah-house-hub.firebaseapp.com",
  projectId: "mitzvah-house-hub",
  storageBucket: "mitzvah-house-hub.firebasestorage.app",
  messagingSenderId: "310571075031",
  appId: "1:310571075031:web:6fdb8bc59c87e66522b792"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function loadMembers() {
  const snap = await getDocs(collection(db, 'members'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function loadEvents() {
  const snap = await getDocs(collection(db, 'events'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveMember(member) {
  const { id, ...data } = member;
  if (typeof id === 'string' && id.length > 10) {
    await setDoc(doc(db, 'members', id), data);
    return id;
  }
  const ref = await addDoc(collection(db, 'members'), data);
  return ref.id;
}

export async function saveEvent(event) {
  const { id, ...data } = event;
  if (typeof id === 'string' && id.length > 10) {
    await setDoc(doc(db, 'events', id), data);
    return id;
  }
  const ref = await addDoc(collection(db, 'events'), data);
  return ref.id;
}

export function listenMembers(callback) {
  return onSnapshot(collection(db, 'members'), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export function listenEvents(callback) {
  return onSnapshot(collection(db, 'events'), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export const login = (email, pw) =>
  signInWithEmailAndPassword(auth, email, pw);
export const logout = () => signOut(auth);
export const onAuth = cb => onAuthStateChanged(auth, cb);
