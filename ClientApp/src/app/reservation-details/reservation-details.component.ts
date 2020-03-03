import { Component, Input, ViewChild, OnDestroy, OnInit, ChangeDetectorRef } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { BookComponent } from '../shared/book/book.component';
import { ReservationService } from "../services/reservation.service";
import { CommonService } from "../services/common.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css'],
  providers: [CommonService, DatePipe]
})

export class ReservationDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(BookComponent, { static: false }) book: BookComponent;
  adaptOptions: any;
  loading: boolean = true;
  isNew: boolean = true;
  id: number;
  club: any[] = [];
  bookData: any;
  searchingParams: any;
  buttonTemplate = "buttonLoadingTemplate";
  descriptionVisible = false;
  clubsDataSubscription: Subscription;
  reservationSubscription: Subscription;

  constructor(private reservationService: ReservationService, private commonService: CommonService, private datePipe: DatePipe, private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {

    let init = false;
    this.searchingParams = commonService.getParams();
    this.clubsDataSubscription = this.reservationService.reservationData$.subscribe(items => {
      for (let value of items) {
        this.club.push(value);
      }
      this.descriptionVisible = true;
      this.buttonTemplate = "buttonTemplate";
      this.setDataForService(this.club);
    });
    this.reservationService.getReservations().subscribe(x => {
      this.reservationService.allReservations = x;
    });
    this.adaptOptions = commonService.largeSize;
  }

  setDataForService(value: any) {
    let date = new Date(this.searchingParams.startDate);
    this.reservationService.setSchedulerData(value, date);
  }

  getBookData() {
    this.reservationService.getBookDataById(this.id).subscribe(x => {
      this.bookData = x;
      this.loading = false;
      this.cd.detectChanges();
    })
  }

  ngOnDestroy() {
    this.clubsDataSubscription.unsubscribe();
    //this.reservationSubscription.unsubscribe();
    this.club = [];
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = Number(+params['id'] || 0);
        this.isNew = !(this.id > 0);
        this.getBookData();
      });
  }

}
