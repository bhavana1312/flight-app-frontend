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
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getLoggedInUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole() {
    const user = this.getLoggedInUser();
    console.log(user.roles);
    return user?.roles?.[0];
  }
}
