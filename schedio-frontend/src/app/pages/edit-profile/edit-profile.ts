import { Component, inject } from '@angular/core';
import { ButtonBox } from '../../shared/components/ui/button-box/button-box';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';
import { Pfp } from '../../shared/components/ui/pfp/pfp'
import { UploadImage } from '../../shared/components/ui/upload-image/upload-image'
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ButtonBox, InputField, RectBaseButton, Pfp, UploadImage],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  private router = inject(Router);

  sendTicket() {
    this.router.navigate(['/ticket']);
  }

  reportError() {
    this.router.navigate(['/error']);
  }
}
