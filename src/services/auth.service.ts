import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserRole } from '../models/model';
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSub = new BehaviorSubject<User | null>(null);
 
  user$ = this.userSub.asObservable();
 
  constructor() {
    this.restoreUser();
  }
  private restoreUser() {
    try {
      const hasStorage =
        typeof window !== 'undefined' &&
        window.localStorage &&
        typeof window.localStorage.getItem === 'function';
      if (hasStorage) {
        const raw = window.localStorage.getItem('currentUser');
        if (raw) {
          try {
            this.userSub.next(JSON.parse(raw));
          } catch {
            this.logout();
          }
        }
      }
    } catch {}
  }
 
  isLoggedIn(): boolean {
    return !!this.userSub.value;
  }

  getUserRole(): UserRole | null {
    return this.userSub.value?.role || null;
  }

  getUserName(): string | undefined {
    return this.userSub.value?.name;
  }

  getCurrentUser(): User | null {
    return this.userSub.value;
  }
 
  login(user: User) {
    this.userSub.next(user);
    try {
      if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        typeof window.localStorage.setItem === 'function'
      ) {
        window.localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } catch {}
  }
 
  logout() {
    this.userSub.next(null);
    try {
      if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        typeof window.localStorage.removeItem === 'function'
      ) {
        window.localStorage.removeItem('currentUser');
        window.localStorage.removeItem('auth');
      }
    } catch {}
  }
}