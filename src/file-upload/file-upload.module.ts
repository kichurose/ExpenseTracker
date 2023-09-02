import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload.ctrl';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}
