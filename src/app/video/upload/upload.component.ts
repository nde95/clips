import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  fileUploaded = false
  isDragOver = false
  file: File | null = null

  constructor() {

  }

  storeFile($event: Event) {
   
    this.isDragOver = false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null 

    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }
    this.fileUploaded = true;
    console.log(this.file)
  }

}
