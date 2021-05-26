import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SignupData } from '../models/signup.model';
import { ToastrService } from 'ngx-toastr';
import { LoginData } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.apiUrl + '/user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  // Signup
  createUser(fullName: string, email: string, password: string) {
    const signupData: SignupData = {
      fullName: fullName,
      email: email,
      password: password,
    };
    return this.http.post(this.baseUrl + '/signup', signupData).subscribe(
      (response: any) => {
        this.toastr.success(response.message, 'Success');
        this.router.navigate(['/']);
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error');
      }
    );
  }

  // Login
  loginUser(email: string, password: string) {
    const loginData: LoginData = {
      email: email,
      password: password,
    };
    this.http
      .post < {
      message: string;
      token: string;
      expiresIn: number;
      userId: string;
    } > (this.baseUrl + '/login', loginData)
      .subscribe((response) => {
        this.toastr.success(response.message, 'Success');
        this.router.navigate(['/']);
      }, (error) => {
        this.toastr.error(error.error.message, 'Error');
      });
  }
}
