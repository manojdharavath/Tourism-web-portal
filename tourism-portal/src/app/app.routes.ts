import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { BookingComponent } from './booking/booking';
import { ContactComponent } from './contact/contact';
import { SigninComponent } from './signin/signin';
import { AllComponent } from './destinations/all/all';
import { NorthComponent } from './destinations/north/north';
import { SouthComponent } from './destinations/south/south';
import { WestComponent } from './destinations/west/west';
import { EastComponent } from './destinations/east/east';
import { MyBookingsComponent } from './my-bookings/my-bookings';
import { ProfileComponent } from './profile/profile';
import { WishlistComponent } from './wishlist/wishlist';
// 🔥 NEW: Import your Admin Dashboard
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'destinations', component: AllComponent },
  { path: 'destinations/north', component: NorthComponent },
  { path: 'destinations/south', component: SouthComponent },
  { path: 'destinations/west', component: WestComponent },
  { path: 'destinations/east', component: EastComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' } 
];