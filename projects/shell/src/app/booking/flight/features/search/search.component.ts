import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { injectBookingFeature } from '../../../+state/booking.state';
import { CardComponent } from '../../ui/card.component';
import { zoneless } from '@angular-architects/demo/signals-zoneless';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    NgIf, NgFor, DatePipe, JsonPipe, AsyncPipe,
    RouterLink,
    FormsModule,
    CardComponent
  ],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  from = zoneless.signal('Paris');
  to = zoneless.signal('London');
  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };
  bookingFeature = injectBookingFeature();
  flights = zoneless.toSignal(
    this.bookingFeature.flights$
  );
  cd = inject(ChangeDetectorRef);

  constructor() {
    zoneless.effect(() => {
      this.from();
      this.to();
      this.flights();

      this.cd.detectChanges();
    });
  }
}
