import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
  passwordTextType = false;
  errorMessage: string = '';
  successMessage: string = ''; // Nueva propiedad para el mensaje de éxito
  isRegistered: boolean = false;


  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Suscribirse a los cambios en los campos de email y contraseña
    this.form.get('email')?.valueChanges.subscribe(() => {
      this.clearMessages();
    });
    this.form.get('password')?.valueChanges.subscribe(() => {
      this.clearMessages();
    });

    this.checkUserRegistration();
  }

  checkUserRegistration(): void {
    this.http.get<any[]>('http://localhost:5000/api/v1/users').subscribe(users => {
      this.isRegistered = users.length > 0;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  get f() {
    return this.form.controls;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    if (this.form.invalid) {
      return;
    }

    this.authService.postLogin(email, password).subscribe(
      (response) => {
        if (response && response.access_token) {
          // Almacenar el token recibido
          this.authService.setToken(response.access_token);
          this.successMessage = 'Login successful!';
          console.log('Token:', response.access_token);
          this.authService.setId(response.user.id);
          // Redirigir a una página protegida
          this._router.navigate(['/profile']);
        }
      },
      (error) => {
        if (error.status === 404) {
          this._router.navigate(['/auth/sign-up']);
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid credentials';
        }
      }
    );
  }

  onClick() {
    console.log('Button clicked');
  }
}
