import { Component, inject, OnInit } from '@angular/core';
import { ButtonBox } from '../../shared/components/ui/button-box/button-box';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';
import { Pfp } from '../../shared/components/ui/pfp/pfp'
import { UploadImage } from '../../shared/components/ui/upload-image/upload-image'
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ButtonBox, InputField, RectBaseButton, Pfp, UploadImage, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  // User form fields
  firstName = '';
  lastName = '';
  preferredLanguage = '';
  password = '';
  confirmPassword = '';
  isSubmitting = false;
  username = '';

  isEditingUsername = false; // Flag for UI toggle
  tempUsername = '';
  
  ngOnInit() {
    // Load current user info
    const user = this.authService.getCurrentUser();
    if (user) {
      this.firstName = user.firstName || '';
      this.lastName = user.lastName || '';
      this.preferredLanguage = user.preferredLanguage || '';
      this.password = '';
      this.confirmPassword = '';
      this.username = user.username || 'Nombre de Usuario';
      this.tempUsername = this.username;
    } else {
      alert('No user logged in');
    }
  }
  toggleEditUsername() {
    this.isEditingUsername = !this.isEditingUsername;
    if (this.isEditingUsername) {
      this.tempUsername = this.username; // Reset temp when opening
    }
  }

  confirmUsername() {
    if (this.tempUsername.trim()) {
      this.username = this.tempUsername;
      this.isEditingUsername = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onGuardar() {
    // Save name, language, and password if provided
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    if (this.password && this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      this.isSubmitting = false;
      return;
    }

    const user = this.authService.getCurrentUser();
    const id = user?._id || user?.id;
    if (!id) {
      alert('No user ID found');
      this.isSubmitting = false;
      return;
    }
    
    const fields: any = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      preferredLanguage: this.preferredLanguage,
    };
    if (this.password) {
      fields.password = this.password;
    }
    
    this.authService.updateUserById(id, fields).subscribe({
      next: (res: any) => {
        // Store the updated user object directly
        const updatedUser = res.user || res;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.authService.currentUser.set(updatedUser);
        }
        alert('Perfil actualizado');
        this.isSubmitting = false;
        // Optionally reload page for language change
        if (this.preferredLanguage) {
        const segments = window.location.pathname.split('/');
        const currentPath = segments.slice(2).join('/');
        window.location.href = `/${this.preferredLanguage}/${currentPath}`;
        }
      },
      error: (err: any) => {
        alert('Error al actualizar: ' + (err.error?.message || err.message));
        this.isSubmitting = false;
      }
      
    });
    
  }

  sendTicket() {
    this.router.navigate(['/ticket']);
  }

  reportError() {
    this.router.navigate(['/error']);
  }
}
