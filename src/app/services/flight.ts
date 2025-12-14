import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private baseUrl = 'http://localhost:9090/flight';

  constructor(private http: HttpClient) {}

  searchFlights(payload: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/search`, payload);
  }
}
