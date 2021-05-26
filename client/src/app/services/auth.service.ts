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
  private isAuthenticated: boolean = false;
  private userId: string;
  private tokenTimer: any;

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

  // Is user auth or not
  getIsAuth() {
    return this.isAuthenticated;
  }

  // User Id
  getUserId() {
    return this.userId;
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
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          this.toastr.success(response.message, 'Success');
          if (token) {
            this.userId = response.userId;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);

            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);

            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate);
            console.log(expirationDate);

          }
          this.router.navigate(['/']);
        },
        (error) => {
          this.toastr.error(error.error.message, 'Error');
        }
      );
  }

  // Logout
  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.toastr.success('Logout successful', 'Success');
  }

  // Auth timer
  private setAuthTimer(duration: number) {
    console.log('Setting timer:' + duration);

    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  // Initialize auth status whenever app starts
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  // Save auth data in local storage
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  // Clear auth data from local storage
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  // get auth data
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
