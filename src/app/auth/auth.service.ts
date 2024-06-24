import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({providedIn: 'root'})
export class AuthService {

    private token: string | undefined;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string |   null = "";

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
      return this.token;
    }

    getIsAuth() {
      return this.isAuthenticated;
    }
    
    createUser(email: string, password: string) {
      const authData: AuthData = {email: email, password: password};
      return this.http.post(BACKEND_URL+'/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
    }

    getAuthStatusListener() {
      return this.authStatusListener.asObservable();
    }

    login(email: string, password: string) {
      const authData: AuthData = {email: email, password: password};
      this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + '/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) { 
          const expiresinDuration = response.expiresIn;
          this.setAuthTimer(expiresinDuration);

          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true); //push to the other components
          this.saveAuthData(token, new Date(new Date().getTime() + expiresinDuration * 1000), this.userId);
          this.router.navigate([ '/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
    }

    getUserId() {
      return this.userId;
    }

    autoAuthUser() {
      const authInformation = this.getAuthData();
      if (!authInformation) {
        return;
      }
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }

    private setAuthTimer(duration: number) {
      console.log("Setting timer: " + duration);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    }

    logout() {
      this.token = undefined;
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      this.router.navigate(['/']);
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.userId = "";
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
      localStorage.removeItem('userId');
    }

    private getAuthData() {
      const token = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expiration');
      const userId = localStorage.getItem('userId');
      if (!token || !expirationDate) {
        return;
      }
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId
      }
    }
}