import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookingsComponent implements OnInit {
  
  selectedTicket: any = null;

  constructor(
    public authService: AuthService, 
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.refreshBookings();
  }

  refreshBookings() {
    // 1. Ask the JSON server for all bookings
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        // 2. Filter them so you only see tickets matching your login email
        const myTickets = data.filter(b => 
          b.contactEmail.toLowerCase() === this.authService.currentUser.email.toLowerCase()
        );
        
        // 3. Update the list the HTML is using
        this.authService.myBookings = myTickets;
      },
      error: (err) => {
        console.error("Database fetch failed", err);
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  viewTicket(trip: any) {
    this.selectedTicket = trip;
  }

  closeTicket() {
    this.selectedTicket = null;
  }

  printTicket() {
    window.print(); 
  }
}