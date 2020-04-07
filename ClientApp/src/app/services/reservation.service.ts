import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from "rxjs";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import notify from 'devextreme/ui/notify';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private reservationUrl: string = environment.baseUrl + 'Reservations';

  getReservationUrl() {
    return this.reservationUrl;
  }

  constructor(private http: HttpClient, private router: Router) { }

  private reservationData = new Subject<any>();
  private reservations = new Subject<any>();
  reservations$ = this.reservations.asObservable();
  reservationData$ = this.reservationData.asObservable();

  allReservations: any[] = [];

  setReservationData(data: any) {
    this.reservationData.next(data);
  }

  getReservationSubject(): Observable<string> {
    return this.reservations.asObservable();
  }


  setReservation(data: any, isNew: boolean) {
    if (isNew) {
      console.log("Add");
      data.userId = 3;
      this.addReservation(data).subscribe(x => {
        this.reservations.next(data);
        notify("Booking Successful", "success", 3000);
        this.router.navigate(['/reservation-list']);
      });
    }
    else {
      console.log("Update");
      this.updateReservaiton(data).subscribe(x => {
        this.reservations.next(data);
        notify("Update Successful", "success", 3000);
      });
    }
  }


  setSchedulerData(data: any, currentDate: Date) {

    let reservations: any[] = [];
    data.forEach(function (club: any) {
      club.Reservations.forEach(function (item: any) {
        var date = new Date(currentDate.toString());
        reservations.push({
          Id: item.ClubId,
          Name: club.Name,
          startDateTime: new Date(date.setHours(item.Start, 0)),
          endDateTime: new Date(date.setHours(date.getHours() + item.Range, 0))
        });
      });
    });
    //this.setReservation(reservations);
  }

  getResources(data: any) {
    let groups: any[] = [],
      i = 0,
      color = ["#bacb35", "#4aca94", "#49baca"];
    data.forEach(function (club: any) {
      groups.push({
        text: club.Name,
        id: club.Id,
        color: color[i++]
      });
    });
    return [
      {
        field: "Id",
        label: "Club",
        allowMultiple: false,
        dataSource: groups
      }
    ];
  }

  getReservations(): Observable<any> {
    return this.http.get<any>(`${this.reservationUrl}/GetReservations`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message);
        })
      )
  }

  getReservationsByUserId(id: number): Observable<any> {
    return this.http.get<any>(`${this.reservationUrl}/GetReservationsByUserId?id=${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message);
        })
      )
  }

  getBookDataById(id: number): Observable<any> {
    return this.http.get<any>(`${this.reservationUrl}/GetReservationById?id=${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message);
        })
      )
  }

  addReservation(data: any): Observable<any> {
    return this.http.post<any>(`${this.reservationUrl}/PostReservation`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message);
        })
      )
  }

  updateReservaiton(data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(`${this.reservationUrl}/PutReservation`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message);
        })
      )
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.reservationUrl}/DeleteReservation?id=${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message);
        })
      )
  }

  getUsers(): any {
    return AspNetData.createStore({
      key: "value",
      loadUrl: this.reservationUrl + "/GetUsersLookup"
    });
  }
}
