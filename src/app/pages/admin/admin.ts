import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  successMsg = '';
  errorMsg = '';

  inventory = {
    airlineName: '',
    airlineLogoUrl: 'https://example.com/logo.png',
    fromPlace: '',
    toPlace: '',
    departureDateTime: '',
    arrivalDateTime: '',
    aircraftModel: 'A320',
    businessSeats: 0,
    businessSeatPrice: 0,
    economySeats: 0,
    economySeatPrice: 0,
  };

  constructor(private http: HttpClient) {}

  addInventory() {
    this.successMsg = '';
    this.errorMsg = '';

    this.http.post('http://localhost:9090/flight/airline/inventory/add', this.inventory).subscribe({
      next: () => {
        this.successMsg = 'Flight inventory added successfully';
        this.resetForm();
      },
      error: (err) => {
        if (err.error) {
          if (typeof err.error === 'string') {
            this.errorMsg = err.error;
          } else if (err.error.message) {
            this.errorMsg = err.error.message;
          } else {
            this.errorMsg = 'Invalid request. Please check inputs.';
          }
        } else {
          this.errorMsg = 'Server error. Please try again later.';
        }
      },
    });
  }

  resetForm() {
    this.inventory = {
      airlineName: '',
      airlineLogoUrl: 'https://example.com/logo.png',
      fromPlace: '',
      toPlace: '',
      departureDateTime: '',
      arrivalDateTime: '',
      aircraftModel: 'A320',
      businessSeats: 0,
      businessSeatPrice: 0,
      economySeats: 0,
      economySeatPrice: 0,
    };
  }
  isFormValid() {
    return (
      this.inventory.airlineName &&
      this.inventory.fromPlace &&
      this.inventory.toPlace &&
      this.inventory.departureDateTime &&
      this.inventory.arrivalDateTime &&
      this.inventory.businessSeats > 0 &&
      this.inventory.businessSeatPrice > 0 &&
      this.inventory.economySeats > 0 &&
      this.inventory.economySeatPrice > 0
    );
  }
}
