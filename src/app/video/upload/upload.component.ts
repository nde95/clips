import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { v4 as uuid } from 'uuid'


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  fileUploaded = false
  isDragOver = false
  file: File | null = null

  title = new FormControl('',{
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })
  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(private storage: AngularFireStorage) {

  }

  storeFile($event: Event) {
   
    this.isDragOver = false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null 

    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.fileUploaded = true;
  }

  uploadFile() {
    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    this.storage.upload(clipPath, this.file)
  }

}
