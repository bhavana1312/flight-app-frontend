import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  flights = [
    {
      flightNumber: '6E-131',
      airline: 'Indigo',
      from: 'Hyderabad',
      to: 'Bengaluru',
      date: '20-12-2025',
      departure: '10:30 AM',
      arrival: '12:00 PM',
      seats: 60,
      price: 3500,
    },
    {
      flightNumber: 'AI-258',
      airline: 'Air India',
      from: 'Hyderabad',
      to: 'Bengaluru',
      date: '20-12-2025',
      departure: '13:15 AM',
      arrival: '14:45 PM',
      seats: 90,
      price: 4500,
    },
    {
      flightNumber: 'AI-203',
      airline: 'Air India',
      from: 'Bengaluru',
      to: 'Hyderabad',
      date: '20-12-2025',
      departure: '10:30 AM',
      arrival: '11:45 AM',
      seats: 120,
      price: 4599,
    },
    {
      flightNumber: '6E-512',
      airline: 'IndiGo',
      from: 'Chennai',
      to: 'Delhi',
      date: '20-12-2025',
      departure: '02:15 PM',
      arrival: '05:10 PM',
      seats: 90,
      price: 5299,
    },
    {
      flightNumber: 'SG-889',
      airline: 'SpiceJet',
      from: 'Mumbai',
      to: 'Goa',
      date: '20-12-2025',
      departure: '08:00 AM',
      arrival: '09:10 AM',
      seats: 60,
      price: 3499,
    },
  ];
}
