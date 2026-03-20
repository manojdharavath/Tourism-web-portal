import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/bookings';

  constructor(private http: HttpClient) { }

  // POST: Save to db.json
  submitBookingRequest(bookingPayload: any): Observable<any> {
    return this.http.post(this.apiUrl, bookingPayload);
  }

  // GET: Read from db.json
  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // DELETE: (Optional) Remove a booking
  cancelBooking(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}