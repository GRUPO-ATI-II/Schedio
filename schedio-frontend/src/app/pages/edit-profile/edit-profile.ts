import { Component, inject } from '@angular/core';
import { ButtonBox } from '../../shared/components/ui/button-box/button-box';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';
import { Pfp } from '../../shared/components/ui/pfp/pfp'
import { UploadImage } from '../../shared/components/ui/upload-image/upload-image'
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ButtonBox, InputField, RectBaseButton, Pfp, UploadImage],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  private router = inject(Router);
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onGuardar(selectedLang: string) {
    if (selectedLang) {

      const segments = window.location.pathname.split('/');
      const currentPath = segments.slice(2).join('/');

      window.location.href = `/${selectedLang}/${currentPath}`;
    } else {
      console.log("No language change");
    }
  }

  sendTicket() {
    this.router.navigate(['/ticket']);
  }

  reportError() {
    this.router.navigate(['/error']);
  }
}
