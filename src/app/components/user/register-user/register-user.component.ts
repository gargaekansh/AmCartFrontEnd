import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { RegisterUser } from '../../../models/user.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent {
  user: RegisterUser = {
    fullName: '',
    email: '',
    password: '',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.user.fullName && this.user.email && this.user.password) {
      this.userService.registerUser(this.user).subscribe(
        (response) => {
          console.log('User registered successfully:', response);
          this.authService.setUserInfo(response.token);
          this.router.navigate(['/']);
        },
        (error) => {
          alert('Error during registration');
        }
      );
    }
  }
}
