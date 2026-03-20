import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false; 
  pendingDestination = ''; 

  currentUser = {
    name: '',
    email: '',
    mobile: '',
    city: '',
    role: 'user' 
  };

  myBookings: any[] = [];
  myWishlist: any[] = []; 

  constructor(private router: Router) { // Added router to constructor
    this.loadSession(); 
  }

  saveSession() {
    const sessionData = {
      isLoggedIn: this.isLoggedIn,
      currentUser: this.currentUser,
      myBookings: this.myBookings,
      myWishlist: this.myWishlist
    };
    localStorage.setItem('yatraverse_session', JSON.stringify(sessionData));
  }

  loadSession() {
    const data = localStorage.getItem('yatraverse_session');
    if (data) {
      const parsed = JSON.parse(data);
      this.isLoggedIn = parsed.isLoggedIn;
      this.currentUser = parsed.currentUser;
      this.myBookings = parsed.myBookings || [];
      this.myWishlist = parsed.myWishlist || [];
    }
  }

// Replace your current login function with this one:
login(name: string, email: string, mobile: string = '', city: string = '', role: string = 'user') {
  this.isLoggedIn = true;
  this.currentUser.name = name || 'Traveler';
  this.currentUser.email = email;
  this.currentUser.mobile = mobile || 'Not Provided';
  this.currentUser.city = city || 'Not Provided';

  // 🔥 UPDATED LOGIC: Use the role passed from the Sign In component
  // We also keep the email check as a backup
  if (role === 'admin' || email.toLowerCase().includes('admin')) {
    this.currentUser.role = 'admin';
    this.saveSession();
    // Note: We usually handle navigation in the Component, 
    // but since it's here, we'll keep it:
    this.router.navigate(['/admin-dashboard']); 
  } else {
    this.currentUser.role = 'user';
    this.saveSession();
    this.router.navigate(['/profile']);
  }
}
  logout() {
    this.isLoggedIn = false;
    this.currentUser = { name: '', email: '', mobile: '', city: '', role: 'user' }; 
    this.myBookings = []; 
    this.myWishlist = []; 
    this.saveSession(); 
    this.router.navigate(['/signin']); // Go back to login
  }

  // ... rest of your existing addBooking/Wishlist methods remain the same ...
  updateProfile(updatedData: any) {
    this.currentUser.name = updatedData.name;
    this.currentUser.email = updatedData.email;
    this.currentUser.mobile = updatedData.mobile;
    this.currentUser.city = updatedData.city;
    this.saveSession(); 
  }

  addBooking(bookingDetails: any) {
    this.myBookings.push(bookingDetails);
    this.saveSession(); 
  }

  toggleWishlist(destination: any) {
    const index = this.myWishlist.findIndex(item => item.name === destination.name);
    if (index > -1) {
      this.myWishlist.splice(index, 1); 
    } else {
      this.myWishlist.push(destination); 
    }
    this.saveSession(); 
  }

  isInWishlist(destination: any): boolean {
    return this.myWishlist.some(item => item.name === destination.name);
  }
}