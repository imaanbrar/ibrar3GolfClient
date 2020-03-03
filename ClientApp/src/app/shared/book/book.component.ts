import { Component, Input, ViewChild, OnDestroy, ViewEncapsulation, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { DxFormComponent } from "devextreme-angular";
import { ReservationService } from "../../services/reservation.service";
import { CommonService } from "../../services/common.service";
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Router } from "@angular/router";

const MIN_START_TIME = 9,
  MAX_END_TIME = 20,
  MAX_TIME_GAME = 2;

@Component({
  selector: "book",
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  providers: [CommonService, DatePipe]
})

export class BookComponent implements OnInit {

  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  @Input() isNew: boolean;
  user: any;
  users: any;
  isAdmin: boolean;
  isShareholder: boolean;
  @Input() data: any;
  @Input() bookVisible = false;
  @Input() adaptOptions: any;
  minStartDate: Date = new Date();
  reservations: any;
  bookData: any = {};
  clickBook = false;
  days: any = [{
    "code": "MO",
    "description": "Monday"
  },
  {
    "code": "TU",
    "description": "Tuesday"
  },
  {
    "code": "WE",
    "description": "Wednesday"
  },
  {
    "code": "TH",
    "description": "Thursday"
  },
  {
    "code": "FR",
    "description": "Friday"
  },
  {
    "code": "SA",
    "description": "Saturday"
  },
  {
    "code": "SU",
    "description": "Sunday"
  }];
  typeCodes: any = [{
    "code": "O",
    "description": "One Time Reservation"
  },
  {
    "code": "S",
    "description": "Standing Reservation (Recurring)"
  }];
  playersDropdown = [1, 2, 3, 4];

  constructor(private commonService: CommonService, private reservationService: ReservationService, private router: Router) {
    //this.reservationService.reservations$.subscribe(reserv => {
    //  this.reservations = reserv;
    //});
    this.user = JSON.parse(localStorage.getItem('user'))[0];
    this.isAdmin = this.user.typeCode === 'A';
    this.isShareholder = this.user.typeCode === 'S';
    this.reservations = this.reservationService.allReservations;
  }

  dateChanged(e: any) {
    if (e.dataField === "startDateTime") {
      this.bookData.endDateTime = this.commonService.addTime(e.value, MAX_TIME_GAME);
      this.bookData.startDateTime = e.value;
      if (this.bookData.typeCode == 'S') {
        this.bookData.recurringDay = this.getRecurringDayByDate(new Date(e.value));
      }
    }
  }

  GetIsStadingReservation() {
    return this.bookData.typeCode === 'S';
  }

  initBook() {
    this.bookData.userId = this.user.id;
    if (!this.isNew) {
      this.bookData = this.data;
    } else {
      let date = new Date();
      this.bookData.typeCode = 'O';
      this.bookData.startDateTime = new Date(date.setHours(MIN_START_TIME, 0, 0, 0));
      this.bookData.endDateTime = this.commonService.addTime(this.bookData.startDateTime, MAX_TIME_GAME);
      this.bookData.players = 4;
      this.bookData.notes = "";
    }
  }

  timeValidation = (data: any) => {
    if (this.clickBook) {
      let time = (new Date(data.value)).getHours();
      if (MIN_START_TIME > time || MAX_END_TIME < time) {
        data.rule.message = "This time is unavailable. Opening hours 09:00 AM - 7:00 PM";
        return false;
      } else {
        let result = this.validateBook();
        data.rule.message = "This time is booked";
        return !result;
      }
    } else {
      return true;
    }
  }

  getRecurringDayByDate(date: Date) {
    var n = date.getDay()
    switch (n) {
      case 0: {
        return "SU";
      }
      case 1: {
        return "MO";
      }
      case 2: {
        return "TU";
      }
      case 3: {
        return "WE";
      }
      case 4: {
        return "TH";
      }
      case 5: {
        return "FR";
      }
      case 6: {
        return "SA";
      }
      default: {
        return "SU";
      }
    }
  }

  validateBook() {
    let that = this;
    if (this.isNew) {
      this.reservations.splice(this.reservations.indexOf(this.data), 1);
    }
    return this.reservations.some(function (item) {
      
      //if (!item.id === that.data.id) {
        return (((item.startDateTime <= that.bookData.startDateTime) && (that.bookData.startDateTime < item.endDateTime))
          || ((that.bookData.endDateTime > item.startDateTime) && (that.bookData.endDateTime <= item.endDateTime)));
      //} else {
      //  return false;
      //}
    });
  }

  delete() {
    confirm("<i>Are you sure you want to want to Cancel (Delete) the Reservation?</i>", "Confirm changes").then(res => {
      if (res) {
        this.reservationService.deleteReservation(this.bookData.id).subscribe(x => {
          notify("Delete Successful", "success", 3000);
          this.router.navigate(['/reservation-list'] );
        })
      }
    });
  }

  booking() {
    let formInstance = this.form.instance,
      result: any;
    this.clickBook = true;
    result = formInstance.validate();
    if (result.isValid) {
      let data = formInstance.option("formData");
      this.reservations.push(this.bookData);
      this.reservationService.setReservation(this.bookData, this.isNew);
      this.bookVisible = !this.bookVisible;
    }
  }

  ngOnInit() {
    this.initBook();
    this.users = this.reservationService.getUsers();
  }
}
