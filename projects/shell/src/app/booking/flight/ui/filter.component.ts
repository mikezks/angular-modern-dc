import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Injector, Input, Output, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { FlightFilter } from '../logic/model/flight-filter';
import { Observable, map, tap } from 'rxjs';


export interface LocalState {
  filters: FlightFilter[]
}

export const initialLocalState: LocalState = {
  filters: []
};


@Component({
  selector: 'app-flight-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    ComponentStore
  ],
  template: `
    <div class="form-group">
      <label for="filterSelect">Previous Filters:</label>
      <select [formControl]="selectedFilter" class="form-control" id="filterSelect">
        <option
          *ngFor="let filter of selectFilters()"
          [ngValue]="filter">
          {{filter?.from}} - {{filter?.to}}
        </option>
      </select>
    </div>

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
        <button (click)="triggerSearch()" [disabled]="!filterForm.valid"
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
  #injector = inject(Injector);

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

  localStore = inject(ComponentStore<LocalState>);

  /**
   * Updater
   */

  addFilter = this.localStore.updater(
    (state, filter: FlightFilter) => ({
      ...state,
      filters: [
        ...state.filters.filter(f => !(
          f.from === filter.from &&
          f.to === filter.to
        )),
        filter
      ]
    })
  );

  /**
   * Selector
   */

  selectFilters = this.localStore.selectSignal(
    // Selectors

    // Projector
    state => state.filters
  );

  selectLatestFilters = this.localStore.selectSignal(
    // Selectors
    this.selectFilters,
    // Projector
    filters => filters.slice(-1)[0]
  );

  /**
   * Effect
   */

  triggerSearch = this.localStore.effect(
    (trigger$: Observable<void>) =>
      trigger$.pipe(
        map(() => this.filterForm.getRawValue()),
        tap((filter: FlightFilter) => {
          this.addFilter(filter);
          this.searchTrigger.next(filter);
        })
      )
  );

  updateFilterForm = this.localStore.effect(
    (filter$: Observable<FlightFilter>) =>
      filter$.pipe(
        tap(filter => this.filterForm.patchValue(filter))
      )
  );

  updateSelectedFilter = this.localStore.effect(
    (filter$: Observable<FlightFilter>) =>
      filter$.pipe(
        tap((filter: FlightFilter) => this.selectedFilter.setValue(filter))
      )
  );

  constructor() {
    this.localStore.setState(initialLocalState);
    this.updateFilterForm(this.selectedFilter.valueChanges);
    this.updateSelectedFilter(toObservable(
      this.selectLatestFilters,
      { injector: this.#injector }
    ));
  }
}
