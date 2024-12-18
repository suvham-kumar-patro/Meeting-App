import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, ICredentials} from '../common/auth/auth.service';
 
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  credentials: ICredentials = {
    username: 'skp@gmail.com',
    password: 'Skp@123!',
  };
  registerCredentials: ICredentials = {
    username: 'skp1@gmail.com',
    password: 'Skp@123!',
    roles: ['Writer'],
  };
  isRegisterMode = false; // Default to Login mode
  returnUrl!: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
 
  authData = {
    username: '', 
    email: '',
    password: '',
  };
 
  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }
 
  ngOnInit(): void {
    // if (this.authenticationService.isLoggedIn()) {
    //   this.router.navigate([this.returnUrl || '/']);
    // }
    // this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/calendar';
    // this.activatedRoute.url.subscribe(url => {
    //   if (url[0].path === '' || url[0].path === 'login') {
    //     this.isRegisterMode = false;
    //   } else {
    //     this.isRegisterMode = true;
    //   }
    // });
  }
 
 
  onSubmit() {
    if (this.isRegisterMode) {
      // Handle registration logic
      console.log('Registered with:', this.registerCredentials);
      this.authenticationService.register(this.registerCredentials).subscribe({
        next: (data) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      console.log('Logging in with:', this.credentials);
      this.authenticationService.login(this.credentials).subscribe({
        next: (data) => {
          this.router.navigate(['/calendar']);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}