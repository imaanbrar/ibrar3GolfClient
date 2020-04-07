import { Component, OnInit } from '@angular/core';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { Router } from '@angular/router';
import { ScoresService } from '../services/scores.service';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-scores-view',
  templateUrl: './scores-view.component.html',
  styleUrls: ['./scores-view.component.css']
})
export class ScoresViewComponent implements OnInit {

  url: any;
  dataSource: any;
  user: any;
  handicap: any;
  users: any;
  isAdmin: boolean;

  constructor(private _service: ScoresService, private _reservationService: ReservationService) {
    this.url = _service.url;
    this.user = JSON.parse(localStorage.getItem('user'))[0];
    this.isAdmin = this.user.typeCode === 'A';
  }

  newRowEvent(e) {
    e.data.userId = this.isAdmin ? 2 : this.user.id;
  }

  onRowInserted(e) {
    this.setHandicap();
  }

  onRowUpdated(e) {
    this.setHandicap();
  }

  onRowRemoved(e) {
    this.setHandicap();
  }

  setHandicap() {
    this._service.getHandicap(this.user.id).subscribe(x => { this.handicap = x; });
  }

  ngOnInit() {
    this.setHandicap();
    if (this.isAdmin) {
      this.dataSource = AspNetData.createStore({
        key: "id",
        loadUrl: this.url + "/GetScoresView",
        insertUrl: this.url + "/PostScore",
        updateUrl: this.url + "/PutScore",
        deleteUrl: this.url + "/DeleteScore",
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.headers = { "Authorization": "Bearer " + localStorage.getItem("adal.idtoken") };

        }
      });
    }
    else {
      this.dataSource = AspNetData.createStore({
        key: "id",
        loadUrl: this.url + "/GetScoresViewByUserId",
        loadParams: { userId: this.user.id },
        insertUrl: this.url + "/PostScore",
        updateUrl: this.url + "/PutScore",
        deleteUrl: this.url + "/DeleteScore",
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.headers = { "Authorization": "Bearer " + localStorage.getItem("adal.idtoken") };

        }
      });
    }
    this.users = this._reservationService.getUsers();
    
  }

}
