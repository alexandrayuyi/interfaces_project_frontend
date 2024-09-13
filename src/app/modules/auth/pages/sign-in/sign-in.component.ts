import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  errorMessage: string = '';


  constructor(private readonly _formBuilder: FormBuilder, private readonly _router: Router, private authService: AuthService) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.authService.getProducts().subscribe((data) => {
      console.log(data);
    });
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }



  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    this.authService.postLogin(email, password).subscribe((response) => {
      if (response.succes){
        this._router.navigate(['/']);
      }
    },
    (error) => {
      if (error.status === 404) {
        this._router.navigate(['/auth/sign-up']);
      }
    });
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this._router.navigate(['/']);
  }
}
