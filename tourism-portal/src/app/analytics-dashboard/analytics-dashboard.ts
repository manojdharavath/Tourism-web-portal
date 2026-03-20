import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.css'
})
export class AnalyticsDashboard implements OnInit {
  isAdmin: boolean = false;
  isVisible: boolean = false;

  // Smart Insight State
  smartRecommendation = { title: '', desc: '', type: '', action: '' };

  popInsights = [
    { name: 'Goa', growth: '+12%', trend: [30, 45, 60, 85, 95], color: '#00ff88', desc: 'Peak Season Demand' },
    { name: 'Manali', growth: '+8%', trend: [20, 35, 55, 75, 82], color: '#00d4ff', desc: 'Summer Surge' },
    { name: 'Leh', growth: '+15%', trend: [10, 20, 40, 60, 70], color: '#ffcc00', desc: 'Adventure Interest' },
    { name: 'Ziro', growth: '-2%', trend: [40, 30, 25, 20, 15], color: '#ff4b2b', desc: 'Off-season Drop' }
  ];

  bookingStatus = [
    { place: 'Manali', status: 'Filling Fast', current: 85, total: 100, icon: '🏔️', type: 'Package' },
    { place: 'Goa', status: 'Available', current: 40, total: 100, icon: '🏝️', type: 'Luxury' },
    { place: 'Varanasi', status: 'Sold Out', current: 100, total: 100, icon: '🛕', type: 'Cultural' }
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.authService.currentUser?.role === 'admin';
    this.generateInsights(); // Run brain logic
    setTimeout(() => this.isVisible = true, 300);
  }

  generateInsights() {
    // Finds the destination with the highest trend value
    const topSpot = [...this.popInsights].sort((a, b) => b.trend[4] - a.trend[4])[0];
    
    // Checks if any location is critically low on slots
    const urgentSpot = this.bookingStatus.find(s => s.current >= 85 && s.current < 100);

    if (urgentSpot) {
      this.smartRecommendation = {
        title: `Priority Alert: ${urgentSpot.place} is nearly Full!`,
        desc: `Occupancy reached ${urgentSpot.current}%. Secure one of the last ${urgentSpot.total - urgentSpot.current} slots before they vanish.`,
        type: 'urgent',
        action: 'Book Now'
      };
    } else {
      this.smartRecommendation = {
        title: `Traveler's Choice: ${topSpot.name} is Trending!`,
        desc: `With a ${topSpot.growth} growth rate, travelers are flocking to ${topSpot.name} for the ${topSpot.desc}.`,
        type: 'trending',
        action: 'Explore Now'
      };
    }
  }
}