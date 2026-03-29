import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { PRODUCTS, AUCTIONS, SELLERS } from "../lib/data.js"; // Note: Changed to .js for node execution
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if config is valid
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your_firebase_api_key") {
  console.error("❌ Error: Firebase configuration is missing in .env.local");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("🚀 Starting database seeding...");

  try {
    // 1. Seed Products
    console.log("📦 Seeding products...");
    const productBatch = writeBatch(db);
    PRODUCTS.forEach((product) => {
      const ref = doc(db, "products", product.id);
      productBatch.set(ref, product);
    });
    await productBatch.commit();
    console.log(`✅ successfully seeded ${PRODUCTS.length} products.`);

    // 2. Seed Auctions
    console.log("🔨 Seeding auctions...");
    const auctionBatch = writeBatch(db);
    AUCTIONS.forEach((auction) => {
      const ref = doc(db, "auctions", auction.id);
      auctionBatch.set(ref, auction);
    });
    await auctionBatch.commit();
    console.log(`✅ successfully seeded ${AUCTIONS.length} auctions.`);

    // 3. Seed Sellers
    console.log("🏪 Seeding sellers...");
    const sellerBatch = writeBatch(db);
    SELLERS.forEach((seller) => {
      const ref = doc(db, "sellers", seller.id);
      sellerBatch.set(ref, seller);
    });
    await sellerBatch.commit();
    console.log(`✅ successfully seeded ${SELLERS.length} sellers.`);

    console.log("\n✨ Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
