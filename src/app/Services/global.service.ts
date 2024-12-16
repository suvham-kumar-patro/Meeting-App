import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Imeeting from '../Models/IMeeting';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private apiUrl = "http://localhost:5000"; 
  constructor(private http: HttpClient) {}

  // getCalenderItems(date:string)
  // {
  //   return this.http.get<ICalender[]>(`http://localhost:5000/api/calendar?date=2024-12-13`);
  // }

  getMeetings() {
    return this.http.get<Imeeting[]>(`${this.apiUrl}/api/meetings`);
  }

  addMeeting(meetingData: Omit<Imeeting, 'id'>): Observable<Imeeting> {
    return this.http.post<Imeeting>(
      `${this.apiUrl}/api/meetings`, meetingData, {
        headers:{
          'Content-Type': 'application/json' 
        }
      }
    );
  }

  // getTeams(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/api/teams`);
  // }

  // // Add a new team to the backend
  // addTeam(teamData: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/api/teams`, teamData, {
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  // }

  // getMeetingsById(meetingsId: number) {
  //   return this.http.get<Imeeting>(`${this.apiUrl}/workshops/${workshopId}`);
  // }
}



