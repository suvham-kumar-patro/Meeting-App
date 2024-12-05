import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() loginEvent = new EventEmitter<void>();  // Event emitter for login
  loginForm: any;
  registerForm: any;
  activeForm: 'login' | 'register' = 'login';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize login and register forms with validations
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
    // Update the URL when the form switches
    if (form === 'login') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  login() {
    if (this.loginForm.valid) {
      console.log('Login info:', this.loginForm.value);
      this.router.navigate(['/calendar']);
      this.loginEvent.emit();  // Emit login event to parent component
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
      }, 2000);
      this.router.navigate(['/login']); // After successful registration
    } else {
      alert('Please fill in all fields correctly!');
    }
  }
}
