import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Imports all the DevExtreme widgets
import { DevExtremeModule, DxLookupModule } from "devextreme-angular";

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationDetailsComponent } from './reservation-details/reservation-details.component';
import { BookComponent } from './shared/book/book.component';
import { ScheduleComponent } from './shared/schedule/schedule.component';
import { ReservationViewComponent } from './reservation-view/reservation-view.component';
import { ReservationScheduleComponent } from './reservation-schedule/reservation-schedule.component';
import { ScoresViewComponent } from './scores-view/scores-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    ReservationListComponent,
    ReservationDetailsComponent,
    BookComponent,
    ScheduleComponent,
    ReservationViewComponent,
    ReservationScheduleComponent,
    ScoresViewComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    DxLookupModule,
    DevExtremeModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'reservation-list', component: ReservationViewComponent },
      { path: 'reservation-details', component: ReservationDetailsComponent },
      { path: 'scores', component: ScoresViewComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
