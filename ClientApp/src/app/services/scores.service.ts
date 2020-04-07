import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from "rxjs";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {

  url: string = environment.baseUrl + 'Scores';

  public getHandicap(userId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/GetHandicap?userId=${userId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.message);
        })
      )
  }

  constructor(private http: HttpClient) { }
}
