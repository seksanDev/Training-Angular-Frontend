import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AppCookieService } from '../../services/app-cookie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)

  })
  constructor(private userService: UserService, private appCookieService: AppCookieService, private router: Router) {

  }

  onSubmit(): void {
    if (this.loginFormGroup.invalid) {
      return;
    }
    let email = this.loginFormGroup.controls['email'].value;
    let password = this.loginFormGroup.controls['password'].value;
    this.userService.login(email, password).subscribe(
      {
        next: response => { this.appCookieService.setAccessToken(response.token); this.router.navigate(['/dashboard']); },
        error: error => alert(error.error.error)
      }
    )

  }
}
