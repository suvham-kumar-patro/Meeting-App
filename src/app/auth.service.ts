import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private emailSubject = new BehaviorSubject<string>(''); 
  public email$ = this.emailSubject.asObservable(); 
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); 
  public isLoggedIn$ = this.isLoggedInSubject.asObservable(); 

  setEmail(email: string) {
    this.emailSubject.next(email);
    this.isLoggedInSubject.next(true);
  }

  logout() {
    this.emailSubject.next('');
    this.isLoggedInSubject.next(false);
  }
}
