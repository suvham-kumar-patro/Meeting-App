import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Imeeting from '../Models/IMeeting';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private apiUrl = "https://localhost:7150"; 
  constructor(private http: HttpClient) {}

  getMeetings() {
    return this.http.get<Imeeting[]>(`${this.apiUrl}/api/Meetings`);
  }

  addMeeting(meetingData: Omit<Imeeting, 'id'>): Observable<Imeeting> {
    return this.http.post<Imeeting>(
      `${this.apiUrl}/api/Meetings`, meetingData, {
        headers:{
          'Content-Type': 'application/json' 
        }
      }
    );
  }

  addAttendee(attendeeData: { email: string, meetingId: number }): Observable<Imeeting> {
    return this.http.post<Imeeting>(`${this.apiUrl}/api/Attendee/Add`, attendeeData, {
      headers:{
        'Content-Type': 'application/json' 
      }
    });
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



