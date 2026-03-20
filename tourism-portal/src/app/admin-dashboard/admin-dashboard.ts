import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  isVisible: boolean = false;

  // FINANCIAL & REVENUE DATA
  revenueMetrics = {
    total: 1575400,
    monthlyTotal: 425000,
    avgBookingValue: 12500,
    destinations: [
      { name: 'Goa', revenue: 650000, bookings: 52, color: '#00ff88' },
      { name: 'Manali', revenue: 480000, bookings: 38, color: '#00d4ff' },
      { name: 'Leh Ladakh', revenue: 245000, bookings: 15, color: '#ffcc00' },
      { name: 'Kerala', revenue: 200400, bookings: 12, color: '#ff4b2b' }
    ],
    monthlySummary: [
      { month: 'Oct', amt: 210000 }, { month: 'Nov', amt: 280000 },
      { month: 'Dec', amt: 450000 }, { month: 'Jan', amt: 390000 },
      { month: 'Feb', amt: 410000 }, { month: 'Mar', amt: 425000 }
    ]
  };

  // ADMIN ANALYTICS HUB DATA
  smartRecommendation = {
    type: 'urgent',
    title: 'Fleet Expansion Alert',
    desc: 'Manali occupancy has hit 85% for 3 weeks. Increase vehicle allocation to avoid booking loss.',
    action: 'Reallocate Fleet'
  };

  popInsights = [
    { name: 'Goa', growth: '+12% Yield', trend: [30, 45, 60, 85, 95], color: '#00ff88', desc: 'Surge pricing recommended for weekend slots.' },
    { name: 'Manali', growth: '+8% Volume', trend: [20, 35, 55, 75, 82], color: '#00d4ff', desc: 'Maintain current inventory; peak stable.' }
  ];

  bookingStatus = [
    { place: 'Manali', current: 85, total: 100, icon: '🏔️', type: 'High Occupancy' },
    { place: 'Goa', current: 40, total: 100, icon: '🏝️', type: 'Available' }
  ];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      const sessionStr = localStorage.getItem('yatraverse_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      const role = session?.currentUser?.role || this.authService.currentUser?.role;

      if (role === 'admin') {
        this.isVisible = true; 
      } else {
        this.router.navigate(['/signin']);
      }
    }, 50);
  }
}