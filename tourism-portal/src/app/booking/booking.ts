import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit, AfterViewInit {

  // 1. Added ViewChild and isVisible properties
  @ViewChild('statsSection') statsSection!: ElementRef;
  isVisible = false;

  step = 1;
  isLoading = false; 

  travelMode = '';
  tripType = 'oneway';

  fromLocation = '';
  toDestination = '';
  travelDate = '';
  returnDate = '';
  travelClass = '';

  hotelType = '';
  checkIn = '';
  checkOut = '';

  packageName = '';
  packageDays = 3;

  adults = 1;
  children = 0;

  passengers: { name: string; age: number | null }[] = [];

  contactName = '';
  email = '';
  mobile = '';

  results: any[] = [];
  selectedOption: any;

  today = new Date().toISOString().split('T')[0];
  cameFromDestination = false;

  notificationMessage = '';
  notificationType = 'info'; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private bookingService: BookingService 
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['destination']) {
        this.toDestination = params['destination'];
        this.cameFromDestination = true;
      }
    });
  }

  // 2. Integrated AfterViewInit to trigger animations on scroll
  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.isVisible = true;
        observer.unobserve(entries[0].target);
      }
    }, { threshold: 0.1 });
    
    if (this.statsSection) {
      observer.observe(this.statsSection.nativeElement);
    }
  }

  selectMode(mode: string) {
    this.travelMode = mode;
    this.step = 2;
  }

  backToModes() {
    this.step = 1;
    this.travelMode = '';
  }

  backToSearch() {
    this.step = 2;
  }

  backToResults() {
    this.step = 3;
  }

  searchOptions() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.results = [
        { name: `${this.travelMode} Express`, time: '08:00 AM', price: 2500 },
        { name: `${this.travelMode} Superfast`, time: '01:30 PM', price: 3200 },
        { name: `${this.travelMode} Night Rider`, time: '07:45 PM', price: 4100 }
      ];
      this.isLoading = false;
      this.step = 3;
      this.showNotification(`🎒 Pack your bags! We tracked down ${this.results.length} perfect options for your trip.`, 'info');
    }, 1000); 
  }

  selectOption(option: any) {
    if (!this.authService.isLoggedIn) {
      this.authService.pendingDestination = this.toDestination || this.packageName;
      this.router.navigate(['/signin']);
      return;
    }
    this.proceedToPassengerDetails(option);
  }

  proceedToPassengerDetails(option: any) {
    const total = this.adults + this.children;
    this.selectedOption = option;
    this.passengers = [];

    for (let i = 0; i < total; i++) {
      this.passengers.push({ name: '', age: null });
    }

    this.contactName = this.authService.currentUser.name !== 'Traveler' ? this.authService.currentUser.name : '';
    this.email = this.authService.currentUser.email !== 'user@yatraverse.com' ? this.authService.currentUser.email : '';
    this.mobile = this.authService.currentUser.mobile !== 'Not Provided' ? this.authService.currentUser.mobile : '';

    this.step = 4;
  }

  confirmPassengers() {
    const bookingPayload: any = {
      bookingId: 'YATRA-' + (Math.floor(Math.random() * 90000) + 10000), 
      travelMode: this.travelMode,
      provider: this.selectedOption ? this.selectedOption.name : 'YatraVerse Standard',
      fromLocation: this.fromLocation || 'Origin Point',
      destination: this.toDestination || this.packageName || 'Destination',
      date: this.travelDate || this.checkIn || 'Flexible Date',
      time: this.selectedOption ? this.selectedOption.time : '10:00 AM',
      passengersCount: this.adults + this.children,
      passengerDetails: [...this.passengers],
      contactName: this.contactName,
      contactEmail: this.email,
      contactMobile: this.mobile,
      price: this.selectedOption ? this.selectedOption.price : 5000
    };

    this.isLoading = true;

    this.bookingService.submitBookingRequest(bookingPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showNotification('🎉 Booking Confirmed and Saved!', 'success');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Server Error:', error);
        this.showNotification('⚠️ Database Error: Is your JSON Server running?', 'error');
      }
    });
  }

  showNotification(message: string, type: string) {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  closeNotification() {
    this.notificationMessage = '';
    if (this.notificationType === 'success') {
      this.router.navigate(['/my-bookings']); 
    }
  }
}