import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent
  ]
})
export class SignUpComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.postRegister(this.email, this.password, this.username).subscribe({
      next: (response) => {
        // Handle successful registration
        this.authService.postLogin(this.email, this.password).subscribe({
          next: (loginResponse) => {
            console.log('Login Response:', loginResponse);  // Agrega esta línea para depurar
            this.authService.setToken(loginResponse.access_token);
            this.authService.setId(loginResponse.user.id);
            this.router.navigate(['/profile/readonly']);
          },
          error: (loginError) => {
            this.errorMessage = 'Login failed. Please try again.';
          }
        });
      },
      error: (error) => {
        // Handle registration error
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
  redirectToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }
}
