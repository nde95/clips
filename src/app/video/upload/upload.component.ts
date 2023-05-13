import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { SharedModule } from 'src/app/shared/shared.module';
import { last } from 'rxjs/operators';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  fileUploaded = false
  isDragOver = false
  file: File | null = null
  showAlert = false
  alertMsg = 'Uploading clip, please wait...'
  alertColor = 'blue'
  inSubmission = false 
  percentage = 0
  showPercentage = false

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
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Uploading clip, please wait...';
    this.inSubmission = true;
    this.showPercentage = true;
  
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
  
    const task = this.storage.upload(clipPath, this.file);
  
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100;
    });
  
    task.snapshotChanges().pipe(last()).subscribe({
      next: (snapshot) => {
        this.alertColor = 'green';
        this.alertMsg = 'Success! Your clip has been uploaded and is ready to share!';
        this.showPercentage = false;
      },
      error: (error) => {
        this.alertColor = 'red';
        this.inSubmission = false;
        this.showPercentage = false;
        
        if (error.code === 'storage/unauthorized') {
          this.alertMsg = 'File too big! Maximum video size is 25MB.';
        } else {
          this.alertMsg = 'Upload failed, please try again later.';
          console.error(error);
        }
      }
    });
  }
}
