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

  fieldDataChanged(e: any) {
    if (e.dataField === "startDateTime") {
      this.bookData.endDateTime = this.commonService.addTime(e.value, MAX_TIME_GAME);
      this.bookData.startDateTime = e.value;
    }
    if (e.dataField === "typeCode") {
      if (e.value === "S") {
        this.bookData.players = 1;
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
      this.bookData.players = 1;
      this.bookData.notes = "";
    }
  }

  getRecurringDay() {
    if (this.bookData.typeCode == 'S') {
      return this.getRecurringDayByDate(new Date(this.bookData.startDateTime));
    }
    else {
      return null;
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

  timeValidation = (data: any) => {
    if (this.clickBook) {
      let time = (new Date(data.value)).getHours();
      if (MIN_START_TIME > time || MAX_END_TIME < time) {
        data.rule.message = "This time is unavailable. Opening hours 09:00 AM - 7:00 PM";
        return false;
      } else {
        let result = this.validateBook();
        data.rule.message = "No Available slot - Maximum of players are allowed";
        return !result;
      }
    } else {
      return true;
    }
  }

  validateBook() {
    let that = this;
    if (this.isNew) {
      this.reservations.splice(this.reservations.indexOf(this.data), 1);
    }
    return this.reservations.some(function (item) {
      var thatId = (that.data !== null) ? that.data.id : 0;
      if (!(item.id === thatId)) {

        var check = (((new Date(item.startDateTime) <= new Date(that.bookData.startDateTime)) && (new Date(that.bookData.startDateTime) < new Date(item.endDateTime)))
          || ((new Date(that.bookData.endDateTime) > new Date(item.startDateTime)) && (new Date(that.bookData.endDateTime) <= new Date(item.endDateTime))));

        if (check) {
          var playersCount = 0;
          that.reservations.forEach(x => {
            if (!(x.id === thatId)) {
              var doubleCheck = (((new Date(x.startDateTime) <= new Date(that.bookData.startDateTime)) && (new Date(that.bookData.startDateTime) < new Date(x.endDateTime)))
                || ((new Date(that.bookData.endDateTime) > new Date(x.startDateTime)) && (new Date(that.bookData.endDateTime) <= new Date(x.endDateTime))));
              if (doubleCheck) {
                playersCount = playersCount + item.players;
                console.log(playersCount);
              }
            }
          });
          console.log(playersCount);
          return (playersCount + that.bookData.players > 4);
        }
        else {
          return false;
        }
      } else {
        return false; 
      }
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
      //bookData.startDateTime = this.commonService.convertDateTimeForService(new Date(this.bookData.startDateTime));
      //console.log(this.bookData.startDateTime);
      //console.log(this.bookData.startDateTime);
      //this.bookData.startDateTime = (new Date(this.bookData.startDateTime)).toUTCString();
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
