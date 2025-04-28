import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  public static readonly API_URL = "http://localhost:8000/api";

  public static readonly STRONG_PASSWORD_REGEX = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
}
