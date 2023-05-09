import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightFilter } from '../logic/model/flight-filter';

@Component({
  selector: 'app-flight-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <!-- <div class="form-group">
      <label for="filterSelect">Previous Filters:</label>
      <select [formControl]="selectedFilter" class="form-control" id="filterSelect">
        <option
          *ngFor="let filter of selectFilters$ | async"
          [ngValue]="filter">
          {{filter?.from}} - {{filter?.to}}
        </option>
      </select>
    </div> -->

    <form [formGroup]="filterForm">
      <div class="form-group">
        <label>From:</label>
        <input formControlName="from" class="form-control">
      </div>
      <div class="form-group">
        <label>To:</label>
        <input formControlName="to" class="form-control">
      </div>
      <div class="form-group">
        <label>
          <input formControlName="urgent" type="checkbox">
          Urgent (When it's urgent it fails -- like in real life ;-))
        </label>
      </div>

      <div class="form-group">
        <button (click)="search()" [disabled]="!filterForm.valid"
          class="btn btn-default">
          Search
        </button>

        <ng-content select=".flight-filter-button"></ng-content>
        <ng-content select=".flight-filter-info"></ng-content>
      </div>
    </form>
  `
})
export class FilterComponent {
  @Input() set filter(filter: FlightFilter) {
    this.filterForm.setValue(filter);
  }

  @Output() searchTrigger = new EventEmitter<FlightFilter>();

  #fb = inject(FormBuilder);

  filterForm = this.#fb.nonNullable.group({
    from: ['', [Validators.required]],
    to: ['', [Validators.required]],
    urgent: [false]
  });

  selectedFilter = new FormControl<FlightFilter>({
    from: '',
    to: '',
    urgent: false
  }, { nonNullable: true });

  search(): void {
    this.searchTrigger.next(this.filterForm.getRawValue());
  }
}
