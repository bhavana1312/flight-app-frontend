import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ConfirmModal],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  bookings: any[] = [];
  userName = '';
  userEmail = '';
  loading = true;
  showModal = false;
  selectedPnr = '';
  errorMessage = '';
  cancelLoading = false;
  showErrorDialog = false;
  dialogErrorMessage = '';
  filteredBookings: any[] = [];
  filter = 'ALL';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getLoggedInUser();
    this.userName = user?.username;
    this.userEmail = user?.email;

    this.http.get<any[]>(`http://localhost:9090/booking/history/${this.userEmail}`).subscribe({
      next: (res) => {
        this.bookings = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openCancelModal(pnr: string) {
    console.log('PNR selected:', pnr);
    this.selectedPnr = pnr;
    console.log('PNR:', this.selectedPnr);

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPnr = '';
  }

  confirmCancel() {
    this.cancelLoading = true;
    this.errorMessage = '';

    this.http.delete(`http://localhost:9090/booking/cancel/${this.selectedPnr}`, {}).subscribe({
      next: () => {
        this.bookings = this.bookings.map((b) =>
          b.id === this.selectedPnr ? { ...b, bookingStatus: 'CANCELLED' } : b
        );
        this.sortBookings();
        this.cancelLoading = false;
        this.closeModal();
      },
      error: (err) => {
        this.cancelLoading = false;
        this.closeModal();
        this.dialogErrorMessage = err?.error?.error || 'Cancellation failed';
        this.showErrorDialog = true;
      },
    });
  }
  sortBookings() {
    this.bookings = this.bookings.sort((a, b) => {
      const aCancelled = a.bookingStatus === 'CANCELLED';
      const bCancelled = b.bookingStatus === 'CANCELLED';

      if (aCancelled && !bCancelled) return 1;
      if (!aCancelled && bCancelled) return -1;

      return new Date(a.journeyDate).getTime() - new Date(b.journeyDate).getTime();
    });
  }

  setFilter(type: string) {
    this.filter = type;
    this.applyFilter();
  }

  applyFilter() {
    if (this.filter === 'ALL') {
      this.filteredBookings = [...this.bookings];
    } else if (this.filter === 'ACTIVE') {
      this.filteredBookings = this.bookings.filter((b) => b.bookingStatus !== 'CANCELLED');
    } else {
      this.filteredBookings = this.bookings.filter((b) => b.bookingStatus === 'CANCELLED');
    }
    this.sortBookings();
  }
}
