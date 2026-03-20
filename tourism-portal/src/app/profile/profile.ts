import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BookingService } from '../booking.service';

// 🔥 IMPORT BOTH DASHBOARDS
import { AnalyticsDashboard } from '../analytics-dashboard/analytics-dashboard';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, AnalyticsDashboard, AdminDashboardComponent], 
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  // UI State
  isEditing = false;
  showAnalytics = false; 
  
  // Profile Form Variables
  editName = '';
  editEmail = '';
  editMobile = '';
  editCity = '';

  // Bookings List
  userBookings: any[] = [];

  constructor(
    public authService: AuthService, 
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.resetEditForm();
    this.loadMyTickets();

    
  }

  loadMyTickets() {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        if(this.authService.currentUser) {
          // Filters tickets by matching current user's email
          this.userBookings = data.filter(b => b.contactEmail === this.authService.currentUser.email);
          this.authService.myBookings = this.userBookings;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading tickets:', err)
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.showAnalytics = false; 
      this.resetEditForm();
    }
  }

  resetEditForm() {
    if (this.authService.currentUser) {
      this.editName = this.authService.currentUser.name;
      this.editEmail = this.authService.currentUser.email;
      this.editMobile = this.authService.currentUser.mobile;
      this.editCity = this.authService.currentUser.city || 'Not Provided';
    }
  }

  saveProfile() {
    if (this.authService.currentUser) {
      this.authService.currentUser.name = this.editName;
      this.authService.currentUser.email = this.editEmail;
      this.authService.currentUser.mobile = this.editMobile;
      this.authService.currentUser.city = this.editCity;
      // Ensure the service saves the changes to LocalStorage
      this.authService.saveSession();
    }
    this.isEditing = false;
    alert('Profile updated successfully! ✅');
    this.loadMyTickets();
  }
}