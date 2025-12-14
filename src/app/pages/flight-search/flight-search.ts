import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.css',
})
export class FlightSearch {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      fromPlace: ['', Validators.required],
      toPlace: ['', Validators.required],
      journeyDate: ['', Validators.required],
    });
  }

  onSearch() {
    console.log(this.searchForm.value);
  }
}
