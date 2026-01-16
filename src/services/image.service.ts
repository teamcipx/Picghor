
import { Injectable, signal, inject } from '@angular/core';
import { Image } from '../models/image.model';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private firebaseService = inject(FirebaseService);

  images = signal<Image[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    this.loadImages();
  }

  private async loadImages(): Promise<void> {
    this.loading.set(true);
    try {
      const imagesFromDb = await this.firebaseService.getImages();
      this.images.set(imagesFromDb);
    } catch (error) {
      console.error('Error loading images from Firebase:', error);
      // In a real app, you might want to show a user-facing error.
    } finally {
      this.loading.set(false);
    }
  }

  getImageBySlug(slug: string): Image | undefined {
    return this.images().find(img => img.slug === slug);
  }

  async addNewImage(imageData: Omit<Image, 'id' | 'createdAt'>): Promise<Image> {
    try {
      // 1. Save metadata to Firebase Firestore
      const newImage = await this.firebaseService.addImage(imageData);

      // 2. Update local state for immediate UI feedback
      this.images.update(currentImages => [newImage, ...currentImages]);
      
      return newImage;
    } catch (error) {
      console.error('Add image process failed:', error);
      throw error;
    }
  }
}
