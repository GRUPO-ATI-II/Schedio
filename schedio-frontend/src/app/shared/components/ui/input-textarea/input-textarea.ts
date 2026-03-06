import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-textarea.html',
  styleUrl: './input-textarea.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextarea),
      multi: true
    }
  ]
})
export class InputTextarea implements ControlValueAccessor {
    @Input() placeholder: string = '';

    value: string = '';

    // Function placeholders (Angular will override these)
    onChange: any = () => {};
    onTouched: any = () => {};

    // 1. Sets the value from the Model (Class) to the View (UI)
    writeValue(val: string): void {
      this.value = val;
    }

    // 2. Registers the callback for when the UI changes
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }

    // 3. Registers the callback for when the UI is touched/blurred
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }

    // Handle local input changes
    handleInput(event: Event): void {
      const target = event.target as HTMLTextAreaElement;
      this.value = target.value;
      this.onChange(this.value); // Notify Angular of the change
    }
}
