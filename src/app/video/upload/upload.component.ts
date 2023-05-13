import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  isDragOver = false

  constructor() {

  }

  storeFile($event: Event) {
    this.isDragOver = false
  }

}
