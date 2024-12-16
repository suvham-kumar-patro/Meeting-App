import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; 
import { OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../common/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports:[RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  email: string = '';
  private emailSubscription: Subscription = new Subscription();

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.emailSubscription = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.email=user.email;
      } else {
        this.email='';
      }
    });
  }


    // const storedEmail = this.authService.getEmail();
    // this.email = storedEmail ? storedEmail : 'Guest'; 

    // this.emailSubscription = this.authService.isLoggedIn$.subscribe((loggedIn) => {
    //   if (loggedIn) {
    //     this.email = this.authService.getEmail() || 'Guest';
    //   } else {
    //     this.email = 'Guest';
    //   }
    // });

  ngOnDestroy(): void {
    if (this.emailSubscription) {
    this.emailSubscription.unsubscribe();
  }
}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
