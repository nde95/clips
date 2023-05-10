import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  }

  showAlert = false 
  alertMsg = 'Please wait, we are logging you in!'
  alertColor = 'blue'
  inSubmission = false 

  public emailPattern = '[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

  constructor(private auth: AngularFireAuth) {  }

  async login() {
    this.showAlert = true
    this.alertMsg = "Logging in, please wait..."
    this.alertColor = "blue"
    this.inSubmission = true
    try {
      await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password)
        this.alertMsg = 'Login successful!';
        this.alertColor = 'green';
        this.inSubmission = true
    } catch(e) {
      console.log(e);

      if (e instanceof FirebaseError) {
        const firebaseError: FirebaseError = e;

        if (firebaseError.code === 'auth/user-not-found') {
          this.alertMsg = 'Invalid user, please check your login information and try again. ';
          this.inSubmission = false;
        } else {
          this.alertMsg = 'Error logging in. Please try again later.';
          this.inSubmission = false;
        }
      }
      this.alertColor = 'red';
    }
  }
}
