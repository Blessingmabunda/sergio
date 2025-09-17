import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole, LoginCredentials, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly TOKEN_KEY = 'dashboard_token';
  private readonly USER_KEY = 'dashboard_user';

  // Mock users for demonstration
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      role: UserRole.ADMIN,
      company: 'TechCorp',
      firstName: 'John',
      lastName: 'Admin',
      isActive: true
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@company.com',
      role: UserRole.USER,
      company: 'TechCorp',
      firstName: 'Jane',
      lastName: 'User',
      isActive: true
    },
    {
      id: '3',
      username: 'datamanager',
      email: 'dm@company.com',
      role: UserRole.DATA_MANAGER,
      company: 'DataCorp',
      firstName: 'Mike',
      lastName: 'Manager',
      isActive: true
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserFromStorage();
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock authentication - in real app, this would call an API
    const user = this.mockUsers.find(u => 
      u.username === credentials.username && 
      (credentials.password === 'password' || credentials.password === 'admin123')
    );

    if (user) {
      const token = this.generateMockToken(user);
      const authResponse: AuthResponse = {
        token,
        user: { ...user, lastLogin: new Date() },
        expiresIn: 3600
      };

      this.setSession(authResponse);
      return of(authResponse).pipe(delay(1000)); // Simulate API delay
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  canAccessCompany(company: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Admins can access all companies
    if (user.role === UserRole.ADMIN) return true;
    
    // Other users can only access their own company
    return user.company === company;
  }

  private setSession(authResponse: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, authResponse.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
    }
    this.currentUserSubject.next(authResponse.user);
  }

  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr && this.isAuthenticated()) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      username: user.username,
      role: user.role,
      company: user.company,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
  }
}
