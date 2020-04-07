import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservation-view',
  templateUrl: './reservation-view.component.html',
  styleUrls: ['./reservation-view.component.css']
})
export class ReservationViewComponent implements OnInit {
  
  tabs: any = ['Reservations', 'Schedule'];

  constructor() { }

  ngOnInit() {
  }

}
