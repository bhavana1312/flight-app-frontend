import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-flight.html',
  styleUrl: './book-flight.css',
})
export class BookFlight implements OnInit {
  bookingForm!: FormGroup;
  flightId = '';
  flight: any;
  seats: any[] = [];
  selectedSeats: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.flightId = this.route.snapshot.paramMap.get('flightId')!;
    const user = this.authService.getLoggedInUser();

    this.bookingForm = this.fb.group({
      userName: [user?.username, Validators.required],
      userEmail: [user?.email, Validators.required],
      numberOfSeats: [1, [Validators.required, Validators.min(1)]],
      mealPreference: ['veg', Validators.required],
      selectedSeats: ['', Validators.required],
      passengers: this.fb.array([]),
    });

    this.addPassenger();

    this.bookingForm.get('numberOfSeats')!.valueChanges.subscribe((n: number) => {
      while (this.passengers.length < n) this.addPassenger();
      while (this.passengers.length > n) this.removePassenger(this.passengers.length - 1);
      if (this.selectedSeats.length > n) {
        this.selectedSeats = this.selectedSeats.slice(0, n);
        this.bookingForm.patchValue({ selectedSeats: this.selectedSeats.join(',') });
      }
    });

    this.http.get<any>(`http://localhost:9090/flight/${this.flightId}`).subscribe((res) => {
      this.flight = res;
      this.seats = [...res.seats];
    });
  }

  get passengers() {
    return this.bookingForm.get('passengers') as FormArray;
  }

  addPassenger() {
    this.passengers.push(
      this.fb.group({
        name: ['', Validators.required],
        gender: ['', Validators.required],
        age: ['', [Validators.required, Validators.min(1)]],
      })
    );
  }

  removePassenger(i: number) {
    this.passengers.removeAt(i);
  }

  toggleSeat(seat: any) {
    if (seat.reserved) return;
    const limit = this.bookingForm.value.numberOfSeats;
    const index = this.selectedSeats.indexOf(seat.seatNumber);

    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      if (this.selectedSeats.length >= limit) return;
      this.selectedSeats.push(seat.seatNumber);
    }

    this.bookingForm.patchValue({
      selectedSeats: this.selectedSeats.join(','),
    });
  }

  submit() {
    const v = this.bookingForm.value;
    const payload = {
      userName: v.userName,
      userEmail: v.userEmail,
      numberOfSeats: v.numberOfSeats,
      mealPreference: v.mealPreference,
      selectedSeats: v.selectedSeats.split(','),
      passengers: v.passengers,
    };

    this.http.post(`http://localhost:9090/booking/${this.flightId}`, payload).subscribe({
      next: () => this.router.navigate(['/booking']),
      error: () => alert('Booking failed'),
    });
  }
}
