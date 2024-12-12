import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        this.isLoggedInSubject.next(true);
      }
    }
  }

  login(email: string): void {
    if (typeof window !== 'undefined') {
      if (email) {
        localStorage.setItem('userEmail', email); 
        this.isLoggedInSubject.next(true);
      }
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userEmail');
      this.isLoggedInSubject.next(false);
    }
  }

  getEmail(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userEmail');
    }
    return null;
  }
}
