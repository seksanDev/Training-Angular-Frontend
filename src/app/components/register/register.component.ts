import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),

  })
  constructor(private userService: UserService, private router: Router) {

  }
  onSubmit(): void {
    if (this.registerFormGroup.invalid) {
      return;
    }
    let email = this.registerFormGroup.controls['email'].value;
    let password = this.registerFormGroup.controls['password'].value;
    let name = this.registerFormGroup.controls['name'].value;
    this.userService.register(email, password, name).subscribe(
      {
        next: () => { this.router.navigate(['/login']); },
        error: error => alert(error.error.error)
      }
    )
  }
}
