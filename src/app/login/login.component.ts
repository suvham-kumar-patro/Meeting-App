import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  registerForm: any;
  activeForm: 'login' | 'register' = 'login';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
  }

  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email || '';
      console.log('Login info:', email);
      this.authService.setEmail(email);  
      this.router.navigate(['/calendar']);
    } else {
      alert('Invalid email or password!');
    }
  }

  register() {
    if (this.registerForm.valid) {
      console.log('Registration info:', this.registerForm.value);
      alert('Registration successful! Please log in.');
      setTimeout(() => {
        window.location.reload();
      }, 10);
      this.router.navigate(['/login']); // After successful registration
    } else {
      alert('Please fill in all fields correctly!');
    }
  }
}