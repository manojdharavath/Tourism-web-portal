import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  
  toastMessage: string = '';
  isToastVisible: boolean = false; 
  toastTimeout: any;
  
  // Global Dataset
  allDestinations = [
    { name: 'Manali', type: 'Hill Station', popularity: 5, image: '/destinations/manali.jpg' },
    { name: 'Ooty', type: 'Hill Station', popularity: 4, image: '/destinations/ooty.jpg' },
    { name: 'Darjeeling', type: 'Hill Station', popularity: 5, image: '/destinations/darjeeling.jpg' },
    { name: 'Gangtok', type: 'Hill Station', popularity: 4, image: '/destinations/gangtok.jpg' },
    { name: 'Araku Valley', type: 'Hill Station', popularity: 3, image: '/destinations/araku.jpg' },
    { name: 'Leh–Ladakh', type: 'Hill Station', popularity: 5, image: '/destinations/ladakh.jpg' },
    { name: 'Goa', type: 'Beach', popularity: 5, image: '/destinations/goa.jpg' },
    { name: 'Visakhapatnam', type: 'Beach', popularity: 4, image: '/destinations/vizag.jpg' },
    { name: 'Gokarna', type: 'Beach', popularity: 3, image: '/destinations/gokarna.jpg' },
    { name: 'Varanasi', type: 'Pilgrimage', popularity: 5, image: '/destinations/varanasi.jpg' },
    { name: 'Amritsar', type: 'Pilgrimage', popularity: 5, image: '/destinations/amritsar.jpg' },
    { name: 'Tirupati', type: 'Pilgrimage', popularity: 5, image: '/destinations/tirupati.jpg' },
    { name: 'Taj Mahal', type: 'Heritage', popularity: 5, image: '/destinations/taj.jpg' },
    { name: 'Jaipur', type: 'Heritage', popularity: 5, image: '/destinations/jaipur.jpg' },
    { name: 'Udaipur', type: 'Heritage', popularity: 5, image: '/destinations/udaipur.jpg' },
    { name: 'Jodhpur', type: 'Heritage', popularity: 4, image: '/destinations/jodhpur.jpg' },
    { name: 'Hyderabad', type: 'Heritage', popularity: 4, image: '/destinations/hyderabad.jpg' },
    { name: 'Jim Corbett', type: 'Wildlife', popularity: 5, image: '/destinations/corbett.jpg' },
    { name: 'Kaziranga', type: 'Wildlife', popularity: 4, image: '/destinations/kaziranga.jpg' },
    { name: 'Gir National Park', type: 'Wildlife', popularity: 4, image: '/destinations/gir.jpg' }
  ];

  popularPlaces: any[] = [];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Show top 8 high-rated places
    this.popularPlaces = this.allDestinations
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 8);
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.isToastVisible = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.isToastVisible = false, 3000); 
  }

  toggleWishlist(event: Event, place: any) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isLoggedIn) {
      this.showToast('⚠️ Please Sign In to save trips!');
      setTimeout(() => this.router.navigate(['/signin']), 1500);
      return;
    }
    
    this.authService.toggleWishlist(place);
    this.showToast(this.authService.isInWishlist(place) ? 
      `❤️ ${place.name} added to wishlist !` : `🤍 ${place.name} Removed from wishlist !`);
  }
}