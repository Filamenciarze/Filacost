import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  public static readonly API_URL = "http://localhost:8000/api";
}
