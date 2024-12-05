import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router'; // For navigation after logout

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() logout = new EventEmitter<void>(); // Event to notify parent about logout

  constructor(private router: Router) {}

  // Logout functionality
  onLogout(): void {
    this.logout.emit(); // Emit logout event
    this.router.navigate(['/login']); // Navigate back to login page after logout
  }
}
