import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {

  isScrolled = false;
  hideNavbar = false;
  menuOpen = false;
  showIntro = true; 

  private lastScroll = 0;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.showIntro = false;
    }, 1500);  
  }

  @HostListener('window:scroll')
  onScroll() {
    const currentScroll = window.scrollY;

    this.isScrolled = currentScroll > 60;

    this.hideNavbar =
      currentScroll > this.lastScroll &&
      currentScroll > 120 &&
      !this.menuOpen;

    this.lastScroll = currentScroll;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}