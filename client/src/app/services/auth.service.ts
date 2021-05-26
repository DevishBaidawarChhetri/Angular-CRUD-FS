import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SignupData } from '../models/signup.model';
import { ToastrService } from 'ngx-toastr';
import { LoginData } from '../models/login.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.apiUrl + '/user';
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  // Getting Token
  getToken() {
    return this.token;
  }

  // Auth Listener
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  //
  getIsAuth() {
    return this.isAuthenticated;
  }

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
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(this.baseUrl + '/login', loginData)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        this.toastr.success(response.message, 'Success');
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
        this.router.navigate(['/']);
      }, (error) => {
        this.toastr.error(error.error.message, 'Error');
      });
  }
}
