import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+$/),
          Validators.minLength(5)
        ])
      ),
      password: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])
      ),
    });
  }

  login(loginBody: { username: string; password: string }) {
    this.loginService.login(loginBody).subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message || 'Unknown Error';
        } else {
          this.errorMessage = 'Unknown Error';
        }
        // console.log(this.errorMessage);
      },
      next: () => {
        this.router.navigate(['/dashboard']);
      },
    });
  }
}
