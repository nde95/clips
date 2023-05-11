import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { FirebaseError } from '@angular/fire/app';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private auth: AuthService) {

  }

  inSubmission = false

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('', [
    Validators.email,
    Validators.required
  ])
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(100)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ])
  confirm_password = new FormControl('', [
    Validators.required,

  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(14),
    Validators.maxLength(14),
  ])

  showAlert = false 
  alertMsg = "Account is being created, please wait!"
  alertColor = "blue"

  registerForm = new FormGroup({
   name: this.name,
   email: this.email,
   age: this.age,
   password: this.password,
   confirm_password: this.confirm_password,
   phoneNumber: this.phoneNumber,
  }, [RegisterValidators.match('password', 'confirm_password')])

  async register() {
    this.showAlert = true
    this.alertMsg = "Account is being created, please wait!"
    this.alertColor = "blue"
    this.inSubmission = true

    try {
      await this.auth.createUser(this.registerForm.value as IUser)
      this.alertMsg = 'Success, your account has been created!';
      this.alertColor = 'green';
      this.inSubmission = true
    } catch (error) {
      console.log(error);

      if (error instanceof FirebaseError) {
        const firebaseError: FirebaseError = error;

        if (firebaseError.code === 'auth/email-already-in-use') {
          this.alertMsg = 'The email address is already in use. Please use a different email.';
          this.inSubmission = false;
        } else {
          this.alertMsg = 'An unexpected Firebase error has occurred. Please try again later.';
          this.inSubmission = false;
        }
      } else {
        this.alertMsg = 'An unexpected error has occurred. Please try again later.';
      }

      this.alertColor = 'red';
    }
  }
}
