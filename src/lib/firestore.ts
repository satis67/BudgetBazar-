import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, Order, User, CartItem, Auction } from "./types";

// --- Products ---
export const getProducts = async (): Promise<Product[]> => {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const getProduct = async (id: string): Promise<Product | null> => {
  if (!db) return null;
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Product : null;
};

// --- Users ---
export const getUserProfile = async (uid: string): Promise<User | null> => {
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() as User : null;
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
  if (!db) return;
  await setDoc(doc(db, "users", uid), data, { merge: true });
};

// --- Orders ---
export const createOrder = async (orderData: Omit<Order, 'id'>) => {
  if (!db) return null;
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserOrders = async (uid: string): Promise<Order[]> => {
  if (!db) return [];
  const q = query(collection(db, "orders"), where("userId", "==", uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ 
    id: d.id, 
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
  } as unknown as Order));
};

export const getAllOrders = async (): Promise<Order[]> => {
  if (!db) return [];
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ 
    id: d.id, 
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
  } as unknown as Order));
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  if (!db) return;
  await updateDoc(doc(db, "orders", orderId), { status });
};

// --- Cart & Wishlist (Real-time Sync) ---
export const syncCart = async (uid: string, items: CartItem[]) => {
  if (!db) return;
  await setDoc(doc(db, "cart", uid), { items, updatedAt: serverTimestamp() });
};

export const syncWishlist = async (uid: string, items: string[]) => {
  if (!db) return;
  await setDoc(doc(db, "wishlist", uid), { items, updatedAt: serverTimestamp() });
};

export const subscribeToCart = (uid: string, callback: (items: CartItem[]) => void) => {
  if (!db) return () => {};
  return onSnapshot(doc(db, "cart", uid), (doc) => {
    if (doc.exists()) callback(doc.data().items);
  });
};

export const subscribeToWishlist = (uid: string, callback: (items: string[]) => void) => {
  if (!db) return () => {};
  return onSnapshot(doc(db, "wishlist", uid), (doc) => {
    if (doc.exists()) callback(doc.data().items);
  });
};

// --- Auctions ---
export const getAuctions = async (): Promise<Auction[]> => {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, "auctions"));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Auction));
};

export const placeBid = async (auctionId: string, userId: string, bidAmount: number) => {
  if (!db) return;
  await updateDoc(doc(db, "auctions", auctionId), {
    currentBid: bidAmount,
    leadBidder: userId,
    bids: increment(1)
  });
};
