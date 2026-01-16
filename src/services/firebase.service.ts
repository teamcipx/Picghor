
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Image } from '../models/image.model';

// User provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvz1PWdklurbr4P65SxEbgQgky1rlnD8g",
  authDomain: "picghor-e738d.firebaseapp.com",
  projectId: "picghor-e738d",
  storageBucket: "picghor-e738d.firebasestorage.app",
  messagingSenderId: "914290295099",
  appId: "1:914290295099:web:bc53bc4c5c0fa12bff371e"
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private db;
  private imagesCollection;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.imagesCollection = collection(this.db, 'images');
  }

  async getImages(): Promise<Image[]> {
    const q = query(this.imagesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => this.mapDocToImage(doc));
  }

  async addImage(imageData: Omit<Image, 'id' | 'createdAt'>): Promise<Image> {
    const docData = {
      ...imageData,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(this.imagesCollection, docData);
    
    // Return the complete object with the new ID for immediate UI update.
    // The timestamp will be a client-side approximation until the next full fetch.
    return {
      ...imageData,
      id: docRef.id,
      createdAt: new Date(),
    };
  }
  
  private mapDocToImage(doc: QueryDocumentSnapshot<DocumentData>): Image {
      const data = doc.data();
      return {
        id: doc.id,
        url: data['url'],
        title: data['title'],
        description: data['description'],
        category: data['category'],
        keywords: data['keywords'],
        slug: data['slug'],
        createdAt: data['createdAt']?.toDate() ?? new Date()
      };
  }
}
