import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:9090/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/signin`, {
        username,
        password,
      })
      .pipe(
        tap((res: any) => {
          if (res?.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem(
              'user',
              JSON.stringify({
                username: res.username,
                email: res.email,
                roles: res.roles,
              })
            );
          }
        })
      );
  }

  register(username: string, email: string, password: string) {
    return this.http.post(
      `${this.baseUrl}/signup`,
      {
        username,
        email,
        password,
        role: ['user'],
      },
      { responseType: 'text' }
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getLoggedInUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    const user = this.getLoggedInUser();
    return user?.roles?.[0] ?? null;
  }
  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/change-password`, {
      oldPassword,
      newPassword,
    });
  }
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }
}
