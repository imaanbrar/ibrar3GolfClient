import { Component } from '@angular/core';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  user: any = [{
    id: 0,
    name: '',
    typeCode: 'm'
  }];

  adminLogin() {
    localStorage.removeItem('user');
    this.user = [{
      id: 4,
      name: 'Admin',
      typeCode: 'A'
    }];
    localStorage.setItem('user', JSON.stringify(this.user));
    notify("Logged in as Admin", "success", 3000);
  }

  memberLogin() {
    localStorage.removeItem('user');
    this.user = [{
      id: 2,
      name: 'John Doe',
      typeCode: 'M'
    }];
    localStorage.setItem('user', JSON.stringify(this.user));
    notify("Logged in as Member", "success", 3000);

  }

  shareholderLogin() {
    localStorage.removeItem('user');
    this.user = [{
      id: 3,
      name: 'Matt Smith',
      typeCode: 'S'
    }];
    localStorage.setItem('user', JSON.stringify(this.user));
    notify("Logged in as Shareholder Member", "success", 3000);

  }
}
