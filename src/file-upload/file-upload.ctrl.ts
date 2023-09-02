import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.ctrl.html',
  styleUrls: ['./file-upload.ctrl.scss'],
})
export class FileUploadComponent {
  @Output()
  public fileSelected: EventEmitter<File> = new EventEmitter<File>();

  onFileSelected(event: any): void {
    this.fileSelected.emit(event.target.files[0]);
  }
}
