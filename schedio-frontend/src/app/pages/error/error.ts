import { Component } from '@angular/core';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';
import { UploadImage } from '../../shared/components/ui/upload-image/upload-image';

@Component({
  selector: 'app-error',
  imports: [RectBaseButton, UploadImage],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error {}
