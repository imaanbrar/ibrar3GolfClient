import { Injectable } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DatePipe } from "@angular/common";

@Injectable()
export class CommonService {

  constructor(private datePipe: DatePipe, private route: ActivatedRoute) { }

  largeSize: any = {
    largeScreen: true,
    showTitle: true,
    searchLabelLocation: "top",
    heightBookPopup: 440,
    pickerType: "",
    heightLoginPopup: 325,
    views: ["day", "week", "month"],
    currentView: "week",
    position: {
      offset: "-116 195",
      of: ".change-search-btn"
    }
  };

  addDays(date: Date, days: number) {
    let result = new Date(date.toString());
    result.setDate(result.getDate() + days);
    return result;
  }

  addTime(value: Date, time: number) {
    var date = new Date(value.toString());
    return new Date(date.setHours(date.getHours() + time));
  }

  getFormatDate(value: Date) {
    return this.datePipe.transform(value, 'MM/dd/yyyy');
  }

  getParams() {
    let result: any;
    this.route.params.forEach(function (params: Params) {
      result = params;
    });
    return {
      players: Number(result.players),
      startDateTime: new Date(result.startDateTime),
      endDateTime: new Date(result.endDateTime)
    };
  }

  setCookie(name: string, value: string) {
    let cookieValue = name + "=" + encodeURIComponent(value) + ";",
      cookiesFinishDate = new Date();
    cookiesFinishDate.setMonth(cookiesFinishDate.getMonth() + 1);
    cookieValue += "expires=" + cookiesFinishDate.toUTCString() + ";";
    cookieValue += "path=/";

    document.cookie = cookieValue;
  }

  getCookie(name: string) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  deleteCookie(name: string) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
}
