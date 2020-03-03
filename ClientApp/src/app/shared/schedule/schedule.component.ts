import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Subscription } from "rxjs";
import { ReservationService } from "../../services/reservation.service";

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnDestroy, OnInit {
  @Input() searchingParams: any;
  @Input() adaptOptions: any;
  @Output() editBook = new EventEmitter<any>();

  groups: any[];
  groupsHasValue = false;
  schedulerData: any = [];
  schedulerResources: any = [];
  subscription: Subscription;
  reservationSubscription: Subscription;
  currentDate: Date;

  constructor(private reservationService: ReservationService) {
    this.reservationService.getReservationSubject().subscribe(x => {
      this.schedulerData = [];
      this.ngOnInit();
    });
  }

  setSchedulerData() {
    this.reservationService.getReservations().subscribe(x => {
      x.forEach(item => {
        this.schedulerData.push({
          id: item.id,
          text: "",
          startDate: item.startDateTime,
          endDate: item.endDateTime,
          recurrenceRule: item.recurringRule
        });
      })
    })
  }

  openBook(e: any) {
    e.cancel = true;
    if (e.appointmentData.isNew) {
      this.editBook.emit(e.appointmentData);
    }
  }

  optionChanged(e: any) {
    if (e.name === "resources") {
      this.setGroupValue();
      this.groupsHasValue = true;
    }
  }

  setGroupValue() {

  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
    //this.reservationSubscription.unsubscribe();
  }

  ngOnInit() {
    this.setSchedulerData();
    if (!this.groupsHasValue) {
      this.setGroupValue();
    }
    this.currentDate = new Date();
  }
}
