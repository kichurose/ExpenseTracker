import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isNaN(control.value)) {
        return { 'notANumber': true };
      }
      return null;
    };
  }