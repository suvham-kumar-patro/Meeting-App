import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'https://localhost:7150';

export interface ICredentials {
  username: string;
  password: string;
  roles?: string[];
}

export interface ILoginResponse {
  email: string;
  authToken: string;
  role: 'Writer' | 'Reader';
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private static KEY_USER = 'user';

  private currentUserSubject: BehaviorSubject<ILoginResponse | null>;
  public currentUser: Observable<ILoginResponse | null>;

  constructor(private http: HttpClient) {
    const user = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<ILoginResponse | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getStoredUser(): ILoginResponse | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(AuthenticationService.KEY_USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  login(credentials: ICredentials): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`${apiUrl}/api/Auth/Login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((resp) => {
          if (resp && resp.authToken) {
              localStorage.setItem(AuthenticationService.KEY_USER, JSON.stringify(resp));
              this.currentUserSubject.next(resp);
          }
          return resp;
        })
      );
  }

  register(credentials: ICredentials) {
    return this.http
      .post(`${apiUrl}/api/Auth/Register`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AuthenticationService.KEY_USER);
      this.currentUserSubject.next(null);
    }
  }

  getUser(): ILoginResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}


