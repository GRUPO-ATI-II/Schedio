import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-date-field',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './date-field.html',
    styleUrl: './date-field.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateField),
            multi: true
        }
    ]
})
export class DateField implements ControlValueAccessor {
    @Input() label: string = '';

    value: string = '';
      onChange: any = () => {};
      onTouched: any = () => {};

      writeValue(val: string): void {
          this.value = val;
      }

      registerOnChange(fn: any): void {
          this.onChange = fn;
      }

      registerOnTouched(fn: any): void {
          this.onTouched = fn;
      }

      onInput(event: Event) {
          const val = (event.target as HTMLInputElement).value;
          this.value = val;
          this.onChange(val);
      }
}
