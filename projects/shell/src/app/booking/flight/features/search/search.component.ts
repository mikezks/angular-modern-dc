import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { injectBookingFeature } from '../../../+state/booking.state';
import { FlightFilter } from '../../logic/model/flight-filter';
import { CardComponent } from '../../ui/card.component';
import { FilterComponent } from "../../ui/filter.component";

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './search.component.html',
  imports: [
    NgIf, NgFor, DatePipe, JsonPipe,
    RouterLink,
    FormsModule,
    CardComponent, FilterComponent
  ]
})
export class SearchComponent {
  filter = signal<FlightFilter>({
    from: 'Paris',
    to: 'London',
    urgent: false
  });
  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });
  bookingFeature = injectBookingFeature();

  updateBasket(id: number, selected: boolean): void {
    this.basket.update(basket => ({
      ...basket,
      [id]: selected
    }));
  }
}
