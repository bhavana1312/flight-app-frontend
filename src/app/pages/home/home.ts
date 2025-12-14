import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private http: HttpClient) {}

  testProtected() {
    this.http
      .get('http://localhost:9090/booking/history/bhavana13sree@gmail.com')
      .subscribe((res) => console.log(res));
  }
}
