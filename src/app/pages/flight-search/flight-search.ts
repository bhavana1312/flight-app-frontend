import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.css',
})
export class FlightSearch {
  searchForm: FormGroup;
  flights: any[] = [];

  constructor(private fb: FormBuilder, private flightService: FlightService) {
    this.searchForm = this.fb.group({
      fromPlace: ['', Validators.required],
      toPlace: ['', Validators.required],
      journeyDate: ['', Validators.required],
    });
  }

  onSearch() {
    const payload = this.searchForm.value;
    this.flightService.searchFlights(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.flights = res;
      },
      error: (err) => {
        console.error(err);
        alert('Flight search failed');
      },
    });
  }
}
