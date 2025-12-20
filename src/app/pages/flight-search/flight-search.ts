// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { FlightService } from '../../services/flight';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-flight-search',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule, RouterModule],
//   templateUrl: './flight-search.html',
//   styleUrl: './flight-search.css',
// })
// export class FlightSearch {
//   searchForm: FormGroup;
//   flights: any[] = [];
//   today = new Date().toISOString().split('T')[0];
//   cities = [
//     'HYD - Hyderabad',
//     'BLR - Bengaluru',
//     'MAA - Chennai',
//     'BOM - Mumbai',
//     'DEL - Delhi',
//     'CCU - Kolkata',
//     'PNQ - Pune',
//     'COK - Kochi',
//     'TRV - Trivandrum',
//     'AMD - Ahmedabad',
//   ];

//   filteredFrom: string[] = [];
//   filteredTo: string[] = [];

//   constructor(private fb: FormBuilder, private flightService: FlightService) {
//     this.searchForm = this.fb.group({
//       fromPlace: ['', Validators.required],
//       toPlace: ['', Validators.required],
//       journeyDate: ['', Validators.required],
//     });
//   }

//   onSearch() {
//     const payload = this.searchForm.value;
//     this.flightService.searchFlights(payload).subscribe({
//       next: (res) => {
//         console.log(res);
//         this.flights = res;
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Flight search failed');
//       },
//     });
//   }

//   filterCities(value: string, type: 'from' | 'to') {
//     const v = value.toLowerCase();
//     const result = this.cities.filter((c) => c.toLowerCase().includes(v));
//     if (type === 'from') this.filteredFrom = result;
//     else this.filteredTo = result;
//   }

//   selectCity(city: string, type: 'from' | 'to') {
//     if (type === 'from') {
//       this.searchForm.patchValue({ fromPlace: city });
//       this.filteredFrom = [];
//     } else {
//       this.searchForm.patchValue({ toPlace: city });
//       this.filteredTo = [];
//     }
//   }
// }

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlightService } from '../../services/flight';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.css',
})
export class FlightSearch {
  searchForm: FormGroup;
  flights: any[] = [];
  today = new Date().toISOString().split('T')[0];

  cities = [
    'HYD - Hyderabad',
    'BLR - Bengaluru',
    'MAA - Chennai',
    'BOM - Mumbai',
    'DEL - Delhi',
    'CCU - Kolkata',
    'PNQ - Pune',
    'COK - Kochi',
    'TRV - Trivandrum',
    'AMD - Ahmedabad',
  ];

  filteredFrom: string[] = [];
  filteredTo: string[] = [];
  activeFromIndex = -1;
  activeToIndex = -1;

  constructor(private fb: FormBuilder, private flightService: FlightService) {
    this.searchForm = this.fb.group({
      fromPlace: ['', Validators.required],
      toPlace: ['', Validators.required],
      journeyDate: ['', Validators.required],
    });
  }

  onSearch() {
    this.flightService
      .searchFlights(this.searchForm.value)
      .subscribe((res) => (this.flights = res));
  }

  filterCities(value: string, type: 'from' | 'to') {
    const v = value.toLowerCase();
    const other = type === 'from' ? this.searchForm.value.toPlace : this.searchForm.value.fromPlace;
    const result = this.cities.filter((c) => c.toLowerCase().includes(v) && c !== other);
    if (type === 'from') {
      this.filteredFrom = result;
      this.activeFromIndex = -1;
    } else {
      this.filteredTo = result;
      this.activeToIndex = -1;
    }
  }

  handleKey(e: KeyboardEvent, type: 'from' | 'to') {
    const list = type === 'from' ? this.filteredFrom : this.filteredTo;
    if (!list.length) return;
    let i = type === 'from' ? this.activeFromIndex : this.activeToIndex;

    if (e.key === 'ArrowDown') i = (i + 1) % list.length;
    else if (e.key === 'ArrowUp') i = (i - 1 + list.length) % list.length;
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (i >= 0) this.selectCity(list[i], type);
      return;
    } else return;

    type === 'from' ? (this.activeFromIndex = i) : (this.activeToIndex = i);
  }

  selectCity(city: string, type: 'from' | 'to') {
    type === 'from'
      ? this.searchForm.patchValue({ fromPlace: city })
      : this.searchForm.patchValue({ toPlace: city });
    this.filteredFrom = [];
    this.filteredTo = [];
  }

  onFocus(type: 'from' | 'to') {}

  onBlur(type: 'from' | 'to') {
    setTimeout(() => {
      if (type === 'from') this.filteredFrom = [];
      else this.filteredTo = [];
    }, 100);
  }
}
