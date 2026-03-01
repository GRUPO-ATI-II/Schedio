import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputField),
      multi: true
    }
  ]
})
export class InputField{
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() pattern: string = ''

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void { this.value = value; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value;

    if (this.pattern) {

      const regex = new RegExp(`^${this.pattern}$`);

      if (newValue !== '' && !regex.test(newValue)) {
         inputElement.value = this.value;
         return;
       }
    }

    this.value = newValue;
    this.onChange(this.value);
  }
}
