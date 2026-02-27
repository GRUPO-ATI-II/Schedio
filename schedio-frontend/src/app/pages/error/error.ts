import { Component } from '@angular/core';
import { InputField } from '../../components/ui/input-field/input-field';
import { RectBaseButton } from '../../components/ui/rect-base-button/rect-base-button';
import { UploadImage } from '../../components/ui/upload-image/upload-image';

@Component({
  selector: 'app-error',
  imports: [RectBaseButton, UploadImage],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error {}
