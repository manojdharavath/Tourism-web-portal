import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  isSent: boolean = false;

  socialLinks = {
    whatsapp: 'https://wa.me/919704692620', 
    instagram: 'https://www.instagram.com/manojjj_dharavath', 
    facebook: 'https://www.facebook.com/share/1Aa5f7X4CW/',
    twitter: 'https://x.com/DharavathManoj9',
    linkedin: 'https://www.linkedin.com/in/dharavath-manoj'
  };

  handleContactSubmit(event: Event) {
    event.preventDefault();
    this.isSent = true;
    (event.target as HTMLFormElement).reset();
  }
}