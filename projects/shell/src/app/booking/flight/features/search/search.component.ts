import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Flight } from '../../logic/model/flight';
import { FlightFilter } from '../../logic/model/flight-filter';
import { CardComponent } from '../../ui/card.component';
import { FilterComponent } from "../../ui/filter.component";
import { FlightService } from './../../logic/data-access/flight.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './search.component.html',
  imports: [
    NgIf, NgFor, DatePipe, JsonPipe, AsyncPipe,
    RouterLink,
    FormsModule,
    CardComponent, FilterComponent
  ]
})
export class SearchComponent {
  filter: FlightFilter = {
    from: 'Paris',
    to: 'London',
    urgent: false
  };
  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };
  #flightService = inject(FlightService);
  flights: Flight[] = [];

  search(filter: FlightFilter) {
    this.#flightService.find(
      filter.from,
      filter.to,
      filter.urgent
    ).subscribe(
      flights => this.flights = flights
    );
  }
}
