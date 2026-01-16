
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly SECRET_PASSWORD = 'nimda'; // "admin" backwards

  isAuthenticated = signal<boolean>(false);

  login(password: string): boolean {
    if (password === this.SECRET_PASSWORD) {
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
