
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image.model';

@Component({
  selector: 'app-public-gallery',
  templateUrl: './public-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class PublicGalleryComponent {
  private imageService = inject(ImageService);
  
  images = this.imageService.images;
  loading = this.imageService.loading;
  searchTerm = signal('');
  selectedCategory = signal<string | null>(null);
  downloading = signal<string | null>(null);

  heroImage = computed(() => this.images()[0]);

  categories = computed(() => {
    const allCategories = this.images().map(image => image.category);
    return ['All', ...new Set(allCategories)];
  });

  filteredImages = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();
    
    let filtered = this.images();

    if (category) {
      filtered = filtered.filter(image => image.category === category);
    }

    if (term) {
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(term) ||
        image.description.toLowerCase().includes(term) ||
        image.keywords.some(k => k.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  });

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  selectCategory(category: string): void {
    if (category === 'All') {
      this.selectedCategory.set(null);
    } else {
      this.selectedCategory.set(category);
    }
  }

  async downloadImage(event: MouseEvent, image: Image): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    if (this.downloading()) return;
    this.downloading.set(image.id);

    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error('Network response was not ok.');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${image.slug || image.title.replace(/\s/g, '_')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Download via blob failed, opening in new tab as fallback.', error);
      window.open(image.url, '_blank');
    } finally {
      this.downloading.set(null);
    }
  }
}
