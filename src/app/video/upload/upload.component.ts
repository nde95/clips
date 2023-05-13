import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { SharedModule } from 'src/app/shared/shared.module';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';

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
  user: firebase.User | null = null

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

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService
    ) { 
      auth.user.subscribe(user => this.user = user)
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
    const clipRef = this.storage.ref(clipPath)


    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100;
    });
  
    task.snapshotChanges().pipe(last(), switchMap(() => clipRef.getDownloadURL())).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        }

        this.clipsService.createClip(clip)
        console.log(clip)

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
