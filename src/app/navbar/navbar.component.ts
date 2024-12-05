import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; 

@Component({
  selector: 'app-navbar',
  imports:[RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() logout = new EventEmitter<void>(); 

  constructor(private router: Router) {}

  onLogout(): void {
    this.logout.emit(); 
    this.router.navigate(['/login']); 
  }
}
