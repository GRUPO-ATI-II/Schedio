import { Component } from '@angular/core';
import { InputField } from '../../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../../shared/components/ui/rect-base-button/rect-base-button';
import { Ticket } from '../../../shared/components/ui/ticket/ticket';
import { UploadImage } from '../../../shared/components/ui/upload-image/upload-image';

@Component({
  selector: 'app-edit-specific-user-credentials',
  imports: [InputField, UploadImage, RectBaseButton, Ticket],
  templateUrl: './edit-specific-user-credentials.html',
  styleUrl: './edit-specific-user-credentials.css',
})
export class EditSpecificUserCredentials {
  viewMoreInfo() {}
}
