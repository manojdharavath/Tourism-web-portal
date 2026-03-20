import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all.html',
  styleUrl: './all.css',
})
export class AllComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService // 🔥 Needs to be public so HTML can read it
  ) {}

  searchText = '';
  selectedType = 'All';
  selectedPopularitySort = '';
  selectedRatingFilter = '';
  selectedPriceFilter = '';
  
  // 🔥 Toast Notification Variables
  toastMessage: string = '';
  toastTimeout: any;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchText = params['search'];
      }
    });
  }

  // 🔥 NEW: Function to show the floating pop-up
  showToast(message: string) {
    this.toastMessage = message;
    
    // Clear any existing timer so it doesn't disappear too quickly
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    // Auto-hide after 3 seconds
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  // 🔥 UPGRADED WISHLIST LOGIC (Now uses Toast)
  toggleWishlist(place: any) {
    if (!this.authService.isLoggedIn) {
      this.showToast('⚠️ Please Sign In to save trips!');
      // Wait 1.5 seconds so they can read the message, then redirect
      setTimeout(() => this.router.navigate(['/signin']), 1500); 
      return;
    }
    
    this.authService.toggleWishlist(place);
    
    // Show dynamic message based on action
    if (this.authService.isInWishlist(place)) {
      this.showToast(`❤️ ${place.name} added to Wishlist!`);
    } else {
      this.showToast(`🤍 ${place.name} removed from Wishlist`);
    }
  }

  // 🔥 UPGRADED BOOK TOUR LOGIC (Now uses Toast)
  bookTour(place: any) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/booking'], {
        queryParams: { destination: place.name }
      });
    } else {
      this.showToast('⚠️ Please sign in to book a tour!');
      this.authService.pendingDestination = place.name;
      // Wait 1.5 seconds so they can read the message, then redirect
      setTimeout(() => this.router.navigate(['/signin']), 1500);
    }
  }

  // Add/Update this in your AllComponent class
  viewOnMap(place: any) {
    const query = encodeURIComponent(`${place.name}, ${place.location}`);
    // This is the correct URL format for opening in a new tab
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  }
  getNearbyPlaces(place: any): string[] {
    return [
      `Nearby attractions in ${place.location}`,
      `Popular spots near ${place.name}`,
      `Local markets around ${place.name}`
    ];
  }
  destinations = [
    /* ================= 🏔 HILL STATIONS ================= */
    { name: 'Manali', location: 'Himachal Pradesh, India', type: 'Hill Station', popularity: 5, price: 15000, image: '/destinations/manali.jpg', short: 'Snow paradise in the Himalayas.', full: 'Manali is a popular hill station known for snow, adventure sports, and honeymoon trips.', history: 'Named after Manu Rishi and rooted in Hindu mythology.', famousFor: 'Snowfall, adventure sports, honeymoon destination.', nearbyPlaces: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple'], bestTime: 'October – February' },
    { name: 'Ooty', location: 'Tamil Nadu, India', type: 'Hill Station', popularity: 4, price: 9000, image: '/destinations/ooty.jpg', short: 'Queen of Hill Stations.', full: 'Ooty is famous for tea plantations, cool climate, and scenic landscapes.', history: 'Developed by the British as a summer retreat.', famousFor: 'Tea gardens, toy train.', nearbyPlaces: ['Coonoor', 'Doddabetta Peak'], bestTime: 'April – June' },
    { name: 'Darjeeling', location: 'West Bengal, India', type: 'Hill Station', popularity: 5, price: 12000, image: '/destinations/darjeeling.jpg', short: 'Tea gardens and Himalayan views.', full: 'Darjeeling offers stunning views of Kanchenjunga and world-famous tea.', history: 'British-era hill station.', famousFor: 'Tea, toy train, sunrise views.', nearbyPlaces: ['Tiger Hill', 'Batasia Loop'], bestTime: 'March – May' },
    { name: 'Gangtok', location: 'Sikkim, India', type: 'Hill Station', popularity: 4, price: 13000, image: '/destinations/gangtok.jpg', short: 'Gateway to Eastern Himalayas.', full: 'Gangtok is known for monasteries, scenic beauty, and Tibetan culture.', history: 'Capital of Sikkim with Buddhist heritage.', famousFor: 'Monasteries, ropeway.', nearbyPlaces: ['Tsomgo Lake', 'Nathula Pass'], bestTime: 'March – June' },
    { name: 'Araku Valley', location: 'Andhra Pradesh, India', type: 'Hill Station', popularity: 3, price: 7000, image: '/destinations/araku.jpg', short: 'Coffee plantations and waterfalls.', full: 'Araku Valley is a peaceful destination with lush greenery.', history: 'Home to indigenous tribal communities.', famousFor: 'Coffee plantations.', nearbyPlaces: ['Borra Caves'], bestTime: 'September – February' },
    { name: 'Leh–Ladakh', location: 'Ladakh, India', type: 'Hill Station', popularity: 5, price: 20000, image: '/destinations/ladakh.jpg', short: 'High-altitude cold desert.', full: 'Ladakh is known for monasteries, lakes, and bike expeditions.', history: 'Ancient trade route region.', famousFor: 'Pangong Lake, monasteries.', nearbyPlaces: ['Nubra Valley', 'Magnetic Hill'], bestTime: 'June – September' },
    { name: 'Auli', location: 'Uttarakhand, India', type: 'Hill Station', popularity: 4, price: 11000, image: '/destinations/auli.jpg', short: 'India’s skiing destination.', full: 'Auli is famous for snow skiing and Himalayan views.', history: 'Developed as a ski resort.', famousFor: 'Skiing.', nearbyPlaces: ['Joshimath'], bestTime: 'December – March' },
    { name: 'Mount Abu', location: 'Rajasthan, India', type: 'Hill Station', popularity: 4, price: 8000, image: '/destinations/mountabu.jpg', short: 'Only hill station of Rajasthan.', full: 'Mount Abu offers relief from desert heat.', history: 'Ancient Aravalli range settlement.', famousFor: 'Dilwara Temples.', nearbyPlaces: ['Nakki Lake'], bestTime: 'October – March' },
    { name: 'Spiti Valley', location: 'Himachal Pradesh, India', type: 'Hill Station', popularity: 4, price: 18000, image: '/destinations/spiti.jpg', short: 'Remote Himalayan valley.', full: 'Spiti Valley is known for monasteries and rugged terrain.', history: 'Ancient Buddhist culture.', famousFor: 'Monasteries, landscapes.', nearbyPlaces: ['Key Monastery'], bestTime: 'June – September' },
    { name: 'Kodaikanal', location: 'Tamil Nadu, India', type: 'Hill Station', popularity: 4, price: 9000, image: '/destinations/kodaikanal.jpg', short: 'Princess of Hill Stations.', full: 'Kodaikanal is famous for lakes and misty hills.', history: 'Developed during British rule.', famousFor: 'Kodai Lake.', nearbyPlaces: ['Coaker’s Walk'], bestTime: 'April – June' },
    { name: 'Tawang', location: 'Arunachal Pradesh, India', type: 'Hill Station', popularity: 4, price: 16000, image: '/destinations/tawang.jpg', short: 'Buddhist mountain town.', full: 'Tawang is known for monasteries and snow-capped peaks.', history: 'Important Buddhist center.', famousFor: 'Tawang Monastery.', nearbyPlaces: ['Sela Pass'], bestTime: 'March – October' },
    { name: 'Kerala', location: 'Kerala, India', type: 'Nature & Hill Station', popularity: 5, price: 8500, image: '/destinations/kerala.jpg', short: 'Rolling tea gardens and misty peaks.', full: 'A serene hill station famous for its vast tea plantations, diverse flora, and the Eravikulam National Park.', history: 'Originally a summer resort for the British Government in South India.', famousFor: 'Neelakurinji flowers and tea museums.', nearbyPlaces: ['Mattupetty Dam', 'Anamudi Peak'], bestTime: 'September – March' },
    /* ================= 🏖 BEACHES ================= */
    { name: 'Goa', location: 'Goa, India', type: 'Beach', popularity: 5, price: 18000, image: '/destinations/goa.jpg', short: 'India’s beach capital.', full: 'Goa is famous for beaches, nightlife, and Portuguese heritage.', history: 'Former Portuguese colony.', famousFor: 'Beaches, nightlife.', nearbyPlaces: ['Baga Beach', 'Calangute'], bestTime: 'November – February' },
    { name: 'Visakhapatnam', location: 'Andhra Pradesh, India', type: 'Beach', popularity: 4, price: 10000, image: '/destinations/vizag.jpg', short: 'Jewel of East Coast.', full: 'Vizag is a coastal city with beaches and hills.', history: 'Major naval base.', famousFor: 'RK Beach.', nearbyPlaces: ['Araku Valley'], bestTime: 'October – March' },
    { name: 'Gokarna', location: 'Karnataka, India', type: 'Beach', popularity: 3, price: 8000, image: '/destinations/gokarna.jpg', short: 'Peaceful beach town.', full: 'Gokarna blends spirituality with beaches.', history: 'Ancient pilgrimage town.', famousFor: 'Om Beach.', nearbyPlaces: ['Kudle Beach'], bestTime: 'October – March' },
    { name: 'Digha', location: 'West Bengal, India', type: 'Beach', popularity: 3, price: 6000, image: '/destinations/digha.jpg', short: 'Popular beach in Bengal.', full: 'Digha is known for shallow beaches.', history: 'Developed as a seaside resort.', famousFor: 'Sea views.', nearbyPlaces: ['Mandarmani'], bestTime: 'October – February' },
    { name: 'Neil Island', location: 'Andaman & Nicobar Islands, India', type: 'Beach', popularity: 4, price: 16000, image: '/destinations/neil.jpg', short: 'Tropical island paradise.', full: 'Neil Island is known for coral reefs and clear waters.', history: 'Part of British Andaman settlements.', famousFor: 'Snorkeling.', nearbyPlaces: ['Bharatpur Beach'], bestTime: 'October – May' },

    /* ================= 🛕 PILGRIMAGE ================= */
    { name: 'Varanasi', location: 'Uttar Pradesh, India', type: 'Pilgrimage', popularity: 5, price: 6000, image: '/destinations/varanasi.jpg', short: 'Spiritual capital of India.', full: 'One of the oldest living cities in the world.', history: 'Founded by Lord Shiva.', famousFor: 'Ganga Aarti.', nearbyPlaces: ['Sarnath'], bestTime: 'November – February' },
    { name: 'Amritsar', location: 'Punjab, India', type: 'Pilgrimage', popularity: 5, price: 7000, image: '/destinations/amritsar.jpg', short: 'Home of Golden Temple.', full: 'Amritsar is the spiritual center of Sikhism.', history: 'Founded by Guru Ram Das.', famousFor: 'Golden Temple.', nearbyPlaces: ['Jallianwala Bagh'], bestTime: 'October – March' },
    { name: 'Rameswaram', location: 'Tamil Nadu, India', type: 'Pilgrimage', popularity: 4, price: 6500, image: '/destinations/rameswaram.jpg', short: 'Sacred Char Dham site.', full: 'Associated with Lord Rama.', history: 'Ancient pilgrimage town.', famousFor: 'Ramanathaswamy Temple.', nearbyPlaces: ['Dhanushkodi'], bestTime: 'October – April' },
    { name: 'Tirupati', location: 'Andhra Pradesh, India', type: 'Pilgrimage', popularity: 5, price: 7000, image: '/destinations/tirupati.jpg', short: 'Major Hindu pilgrimage.', full: 'Home to Lord Venkateswara.', history: 'Ancient temple traditions.', famousFor: 'Balaji Temple.', nearbyPlaces: ['Tirumala'], bestTime: 'September – February' },
    { name: 'Dwarka', location: 'Gujarat, India', type: 'Pilgrimage', popularity: 4, price: 8000, image: '/destinations/dwarka.jpg', short: 'City of Lord Krishna.', full: 'One of the Char Dham sites.', history: 'Ancient Krishna kingdom.', famousFor: 'Dwarkadhish Temple.', nearbyPlaces: ['Bet Dwarka'], bestTime: 'October – March' },
    { name: 'Rishikesh', location: 'Uttarakhand, India', type: 'Pilgrimage', popularity: 5, price: 7500, image: '/destinations/rishikesh.jpg', short: 'Yoga capital of the world.', full: 'Rishikesh is known for spirituality and adventure.', history: 'Ancient meditation center.', famousFor: 'Yoga, Ganga.', nearbyPlaces: ['Haridwar'], bestTime: 'September – April' },
    { name: 'Puri', location: 'Odisha, India', type: 'Pilgrimage', popularity: 4, price: 7000, image: '/destinations/puri.jpg', short: 'Jagannath Temple town.', full: 'One of the Char Dham pilgrimage sites.', history: 'Ancient religious city.', famousFor: 'Jagannath Temple.', nearbyPlaces: ['Konark'], bestTime: 'October – February' },

    /* ================= 🏰 HERITAGE ================= */
    { name: 'Taj Mahal', location: 'Agra, Uttar Pradesh, India', type: 'Heritage', popularity: 5, price: 8000, image: '/destinations/taj.jpg', short: 'Symbol of love.', full: 'Taj Mahal is a UNESCO World Heritage Site.', history: 'Built by Shah Jahan.', famousFor: 'White marble mausoleum.', nearbyPlaces: ['Agra Fort'], bestTime: 'October – March' },
    { name: 'Jaipur', location: 'Rajasthan, India', type: 'Heritage', popularity: 5, price: 11000, image: '/destinations/jaipur.jpg', short: 'The Pink City of India.', full: 'Jaipur is famous for royal palaces, forts, vibrant bazaars, and rich Rajasthani culture.', history: 'Founded in 1727 by Maharaja Sawai Jai Singh II.', famousFor: 'Amber Fort, City Palace, Hawa Mahal.', nearbyPlaces: ['Amber Fort', 'Hawa Mahal', 'Jantar Mantar'], bestTime: 'October – March' },
    { name: 'Mumbai', location: 'Maharashtra, India', type: 'Heritage', popularity: 5, price: 12000, image: '/destinations/mumbai.jpg', short: 'The City That Never Sleeps.', full: 'Mumbai is India’s financial capital, known for Bollywood, beaches, and colonial architecture.', history: 'Originally seven islands under British rule.', famousFor: 'Gateway of India, Marine Drive, Bollywood.', nearbyPlaces: ['Gateway of India', 'Marine Drive', 'Elephanta Caves'], bestTime: 'October – February' },
    { name: 'Udaipur', location: 'Rajasthan, India', type: 'Heritage', popularity: 5, price: 13000, image: '/destinations/udaipur.jpg', short: 'City of Lakes.', full: 'Udaipur is known for royal palaces and lakes.', history: 'Founded by Maharana Udai Singh.', famousFor: 'City Palace.', nearbyPlaces: ['Lake Pichola'], bestTime: 'October – March' },
    { name: 'Jodhpur', location: 'Rajasthan, India', type: 'Heritage', popularity: 4, price: 10000, image: '/destinations/jodhpur.jpg', short: 'The Blue City.', full: 'Jodhpur is famous for Mehrangarh Fort.', history: 'Founded by Rao Jodha.', famousFor: 'Mehrangarh Fort.', nearbyPlaces: ['Jaswant Thada'], bestTime: 'October – March' },
    { name: 'Khajuraho', location: 'Madhya Pradesh, India', type: 'Heritage', popularity: 4, price: 9000, image: '/destinations/khajuraho.jpg', short: 'Famous temple sculptures.', full: 'Khajuraho is known for intricate carvings.', history: 'Built by Chandela dynasty.', famousFor: 'UNESCO temples.', nearbyPlaces: ['Western Temple Group'], bestTime: 'October – March' },
    { name: 'Konark Sun Temple', location: 'Odisha, India', type: 'Heritage', popularity: 4, price: 8500, image: '/destinations/konark.jpg', short: 'Architectural marvel.', full: 'Famous for chariot-shaped temple.', history: 'Built in 13th century.', famousFor: 'Sun Temple.', nearbyPlaces: ['Puri'], bestTime: 'October – February' },
    { name: 'Kolkata', location: 'West Bengal, India', type: 'Heritage', popularity: 4, price: 9000, image: '/destinations/kolkata.jpg', short: 'City of Joy.', full: 'Cultural capital of India.', history: 'Former British capital.', famousFor: 'Colonial architecture.', nearbyPlaces: ['Victoria Memorial'], bestTime: 'October – February' },
    { name: 'Hyderabad', location: 'Telangana, India', type: 'Heritage', popularity: 4, price: 9000, image: '/destinations/hyderabad.jpg', short: 'City of Pearls.', full: 'Blend of history and IT hub.', history: 'Founded by Quli Qutb Shah.', famousFor: 'Charminar.', nearbyPlaces: ['Golconda Fort'], bestTime: 'October – February' },
    { name: 'Warangal', location: 'Telangana, India', type: 'Heritage', popularity: 3, price: 7000, image: '/destinations/warangal.jpg', short: 'Kakatiya heritage city.', full: 'Warangal is famous for temples and forts.', history: 'Capital of Kakatiya dynasty.', famousFor: 'Warangal Fort.', nearbyPlaces: ['Thousand Pillar Temple'], bestTime: 'October – March' },
    { name: 'Nagarjuna Sagar', location: 'Telangana, India', type: 'Heritage', popularity: 3, price: 7500, image: '/destinations/nagarjuna.jpg', short: 'Historic Buddhist site.', full: 'Known for dam and ancient ruins.', history: 'Ancient Buddhist center.', famousFor: 'Buddhist relics.', nearbyPlaces: ['Nagarjuna Konda'], bestTime: 'October – February' },

    /* ================= 🐅 WILDLIFE ================= */
    { name: 'Jim Corbett National Park', location: 'Uttarakhand, India', type: 'Wildlife', popularity: 5, price: 14000, image: '/destinations/corbett.jpg', short: 'India’s oldest national park.', full: 'Famous for tiger safaris.', history: 'Established in 1936.', famousFor: 'Bengal Tigers.', nearbyPlaces: ['Dhikala Zone'], bestTime: 'November – June' },
    { name: 'Bandhavgarh National Park', location: 'Madhya Pradesh, India', type: 'Wildlife', popularity: 4, price: 15000, image: '/destinations/bandhavgarh.jpg', short: 'High tiger density park.', full: 'Bandhavgarh is famous for wildlife safaris.', history: 'Ancient fort area.', famousFor: 'Tiger sightings.', nearbyPlaces: ['Bandhavgarh Fort'], bestTime: 'October – June' },
    { name: 'Kaziranga National Park', location: 'Assam, India', type: 'Wildlife', popularity: 4, price: 13000, image: '/destinations/kaziranga.jpg', short: 'One-horned rhino habitat.', full: 'UNESCO World Heritage Site.', history: 'Protected since 1908.', famousFor: 'Rhinos.', nearbyPlaces: ['Safari Zones'], bestTime: 'November – April' },
    { name: 'Gir National Park', location: 'Gujarat, India', type: 'Wildlife', popularity: 4, price: 12000, image: '/destinations/gir.jpg', short: 'Home of Asiatic lions.', full: 'Only natural habitat of Asiatic lions.', history: 'Lion conservation area.', famousFor: 'Lion safaris.', nearbyPlaces: ['Devalia Park'], bestTime: 'December – March' }
  ];

  get filteredDestinations() {
    let results = [...this.destinations];

    if (this.searchText) {
      results = results.filter(p =>
        p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.location.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.selectedType !== 'All') {
      results = results.filter(p => p.type === this.selectedType);
    }

    if (this.selectedRatingFilter === '4+') {
      results = results.filter(p => p.popularity >= 4);
    }

    if (this.selectedRatingFilter === '5') {
      results = results.filter(p => p.popularity === 5);
    }

    if (this.selectedPriceFilter === 'budget') {
      results = results.filter(p => p.price <= 8000);
    }

    if (this.selectedPriceFilter === 'mid') {
      results = results.filter(p => p.price > 8000 && p.price <= 15000);
    }

    if (this.selectedPriceFilter === 'luxury') {
      results = results.filter(p => p.price > 15000);
    }

    if (this.selectedPopularitySort === 'high') {
      results.sort((a, b) => b.popularity - a.popularity);
    }

    if (this.selectedPopularitySort === 'low') {
      results.sort((a, b) => a.popularity - b.popularity);
    }

    return results;
  }
}