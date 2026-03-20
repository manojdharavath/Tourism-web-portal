import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class WishlistComponent {
  
  constructor(public authService: AuthService, private router: Router) {}

  goBack() {
    this.router.navigate(['/destinations']);
  }

  removeFromWishlist(item: any) {
    this.authService.toggleWishlist(item);
  }

  bookNow(item: any) {
    this.router.navigate(['/booking'], { queryParams: { destination: item.name } });
  }
}