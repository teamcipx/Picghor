
import { Component, ChangeDetectionStrategy, input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image.model';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class ImageDetailComponent {
  slug = input.required<string>();

  private imageService = inject(ImageService);

  image = computed(() => this.imageService.getImageBySlug(this.slug()));
  
  copySuccess = signal(false);
  downloading = signal(false);

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
      // Optionally handle the error in the UI
    });
  }

  async downloadImage(image: Image): Promise<void> {
    if (this.downloading()) return;
    this.downloading.set(true);

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
      this.downloading.set(false);
    }
  }
}
