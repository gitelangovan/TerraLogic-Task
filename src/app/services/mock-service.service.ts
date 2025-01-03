import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainForm } from '../models/main-form';

@Injectable({
  providedIn: 'root'
})
export class MockServiceService {

  private apiUrl = "http://localhost:3000/applicantData"; 

  constructor(public http: HttpClient) { }

  // Post call
  addData(appData:MainForm): Observable<any>{
    return this.http.post(this.apiUrl, appData);
  }
 
  // Fetch All Data
  getData(): Observable<any>{
    return this.http.get(this.apiUrl);
  }

  // Fetch Based on the ID
  geOneData(id:any): Observable<any>{
    debugger
    return this.http.get(this.apiUrl + '/' + id)
  }
}
