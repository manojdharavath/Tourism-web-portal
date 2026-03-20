import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class SigninComponent {
  // Upgraded state management
  viewState: 'signin' | 'signup' | 'mobile' = 'signin'; 
  userRole: 'user' | 'admin' = 'user';

  authEmail = '';
  authPassword = '';
  authConfirmPassword = ''; // 🔥 Confirm Password State
  authName = '';
  authMobile = '';
  authCity = '';
  acceptTerms = false;

  // Mobile OTP state
  otpPhone = '';
  otpCode = '';
  otpSent = false;

  constructor(private authService: AuthService, private router: Router) {}
  setRole(role: 'user' | 'admin') {
    this.userRole = role;
  }

  switchView(view: 'signin' | 'signup' | 'mobile') {
    this.viewState = view;
    this.resetForm();
  }

  resetForm() {
    this.authEmail = '';
    this.authPassword = '';
    this.authConfirmPassword = ''; 
    this.authName = '';
    this.authMobile = '';
    this.authCity = '';
    this.acceptTerms = false;
    this.otpPhone = '';
    this.otpCode = '';
    this.otpSent = false;
  }

  onAuthenticate() {
  // Pass this.userRole here
  let displayName = this.viewState === 'signup' ? this.authName : 
                   (this.userRole === 'admin' ? 'System Administrator' : 'Awesome Traveler');
  
  this.proceedToLogin(displayName, this.authEmail, this.authMobile, this.authCity);
}

  // Interactive Mock Social Logins
  loginWithSocial(platform: string) {
    alert(`Securely redirecting to ${platform} for authentication...`);
    this.proceedToLogin(`${platform} User`, `user@${platform.toLowerCase()}.com`, 'Not Provided', 'Unknown');
  }

  // Interactive Mobile OTP Flow
  sendOtp() {
    if (this.otpPhone.length === 10) {
      this.otpSent = true;
      alert(`✅ Mock OTP sent to +91 ${this.otpPhone}. Please enter "1234" to verify.`);
    }
  }

  verifyOtp() {
    if (this.otpCode === '1234') { 
      this.proceedToLogin('Mobile Traveler', 'mobile@user.com', this.otpPhone, 'Unknown');
    } else {
      alert('❌ Invalid OTP! Please enter "1234".');
    }
  }

proceedToLogin(name: string, email: string, mobile: string, city: string) {
  this.authService.login(name, email, mobile, city, this.userRole);
  
  const isEmailAdmin = email.toLowerCase().includes('admin');

  // CHANGE THE REDIRECT HERE
  if (this.userRole === 'admin' || isEmailAdmin) {
    console.log("Admin detected, redirecting to Home...");
    this.router.navigate(['/']); // <--- Change this to '/' to go to Home Page
  } 
  else if (this.authService.pendingDestination) {
    this.router.navigate(['/booking'], { 
      queryParams: { destination: this.authService.pendingDestination } 
    });
    this.authService.pendingDestination = ''; 
  } 
  else {
    this.router.navigate(['/']); // <--- Also change this to '/' for regular users
  }
}
}