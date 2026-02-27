import { Component } from '@angular/core';
import { InputField } from '../input-field/input-field';

@Component({
  selector: 'app-upload-image',
  imports: [InputField],
  templateUrl: './upload-image.html',
  styleUrl: './upload-image.css',
})
export class UploadImage {}
