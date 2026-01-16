
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminPanelComponent {
  authService = inject(AdminAuthService);
  imageService = inject(ImageService);
  fb = inject(FormBuilder);
  
  password = signal('');
  loginError = signal('');
  uploadState = signal<'idle' | 'uploading' | 'success' | 'error'>('idle');
  errorMessage = signal('');

  uploadForm = this.fb.group({
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    keywords: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
  });
  
  handleLogin(): void {
    if (this.authService.login(this.password())) {
      this.loginError.set('');
    } else {
      this.loginError.set('Incorrect password. Please try again.');
    }
  }

  slugifyTitle(): void {
    const title = this.uploadForm.get('title')?.value || '';
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.uploadForm.get('slug')?.setValue(slug);
  }

  async handleUpload(): Promise<void> {
    if (this.uploadForm.invalid) {
      return;
    }

    this.uploadState.set('uploading');
    this.errorMessage.set('');

    const formValue = this.uploadForm.value;
    const imageData = {
      url: formValue.url!,
      title: formValue.title!,
      description: formValue.description!,
      category: formValue.category!,
      keywords: formValue.keywords!.split(',').map(k => k.trim()),
      slug: formValue.slug!,
    };

    try {
      await this.imageService.addNewImage(imageData);
      this.uploadState.set('success');
      this.uploadForm.reset();
      // Reset state after a few seconds
      setTimeout(() => this.uploadState.set('idle'), 3000);
    } catch (error) {
      this.uploadState.set('error');
      this.errorMessage.set('Adding image failed. Please check the console for details.');
    }
  }
}
