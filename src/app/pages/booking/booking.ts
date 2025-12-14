import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  bookings: any[] = [];
  userName = '';
  userEmail = '';
  loading = true;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getLoggedInUser();
    this.userName = user?.username;
    this.userEmail = user?.email;

    this.http.get<any[]>(`http://localhost:9090/booking/history/${this.userEmail}`).subscribe({
      next: (res) => {
        this.bookings = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
