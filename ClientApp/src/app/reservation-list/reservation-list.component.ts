import { Component, OnInit } from '@angular/core';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { ReservationService } from '../services/reservation.service';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  dataSource: any;
  user: any
  url: string;
  constructor(private _service: ReservationService, private router: Router) {
    this.url = _service.getReservationUrl();
  }

  itemSelected(e) {
    this.router.navigate(['/reservation-details'], { queryParams: { id: e.key } });
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'))[0];

    if (this.user.typeCode === 'A') {
      this.dataSource = AspNetData.createStore({
        key: "id",
        loadUrl: this.url + "/GetReservationView"
      });
    }
    else {
      this.dataSource = AspNetData.createStore({
        key: "id",
        loadUrl: this.url + "/GetReservationsByUserId",
        loadParams: { id: this.user.id }
      });
    }
  }

}
