import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { injectBookingFeature } from '../../../+state/booking.state';
import { effect } from 'projects/shared-util-signals-zoneless/src/lib/angular/core';

@Component({
  selector: 'app-flight-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html'
})
export class EditComponent {
  editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    from: [''],
    to: [''],
    date: [new Date().toISOString()],
    delayed: [false]
  });
  #bookingFeature = injectBookingFeature();

  constructor() {
    effect(() => this.editForm.patchValue(
      this.#bookingFeature.activeFlight()
    ));
  }

  save(): void {
    this.#bookingFeature.save(this.editForm.getRawValue());
  }
}
