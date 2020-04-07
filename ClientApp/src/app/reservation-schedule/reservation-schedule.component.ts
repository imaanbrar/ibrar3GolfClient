import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Subscription } from "rxjs";
import { ReservationService } from "../services/reservation.service";
import { CommonService } from "../services/common.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-reservation-schedule',
  templateUrl: './reservation-schedule.component.html',
  styleUrls: ['./reservation-schedule.component.css'],
  providers: [CommonService, DatePipe]
})
export class ReservationScheduleComponent implements OnInit {
  adaptOptions: any;
  searchingParams: any;

  constructor(private commonService: CommonService) {

    this.searchingParams = commonService.getParams();
    this.adaptOptions = commonService.largeSize;
  }

  ngOnInit() {
  }
}
