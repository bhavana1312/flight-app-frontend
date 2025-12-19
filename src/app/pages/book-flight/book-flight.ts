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

  submit() {
    const formValue = this.bookingForm.value;

    const payload = {
      userName: formValue.userName,
      userEmail: formValue.userEmail,
      numberOfSeats: formValue.numberOfSeats,
      mealPreference: formValue.mealPreference,
      selectedSeats: formValue.selectedSeats.split(',').map((s: string) => s.trim()),
      passengers: formValue.passengers,
    };

    this.http.post(`http://localhost:9090/booking/${this.flightId}`, payload).subscribe({
      next: () => {
        // alert('Booking successful');
        this.router.navigate(['/booking']);
      },
      error: () => {
        alert('Booking failed');
      },
    });
  }
}
