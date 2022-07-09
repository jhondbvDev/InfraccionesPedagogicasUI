import { Component, Input, OnInit, Output } from '@angular/core';

const DATA: Date[] = [
  new Date("2022-07-14 11:20:00"),
  new Date("2022-07-13 12:00:00"),
  new Date("2022-07-12 13:30:00"),
  new Date("2022-07-14 09:45:00"),
  new Date("2022-07-13 09:45:00"),
  new Date("2022-07-14 014:45:00")
];

const HOURS: number[] = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18]

@Component({
  selector: 'app-meeting-calendar',
  templateUrl: './meeting-calendar.component.html',
  styleUrls: ['./meeting-calendar.component.scss']
})
export class MeetingCalendarComponent implements OnInit {
  @Input() default: boolean = false;
  @Output() selectedDate: Date | null;
  selected: Date | null;
  minDate: Date;
  listDates: Array<Date>;
  currentListDate: ({ isActive: boolean, date: Date } | undefined)[] = [];
  hourList: { isActive: boolean, date: Date }[];

  constructor() {
    this.selected = new Date();
    this.selectedDate = null;
    this.minDate = new Date();
    this.listDates = DATA;
    this.hourList = this.generateHours();
  }

  onDateChanged(dateChanged: Date | null): void {

    if (this.default) {
      this.currentListDate = this.hourList;
    }
    else {
      this.currentListDate = [];
      this.currentListDate = this.listDates.map(function (obj) {
        const element = { "isActive": false, date: obj };
        return element!;
      });
      this.currentListDate = this.currentListDate.filter((obj) => obj?.date.getDate() === dateChanged?.getDate());
    }
  }

  onAvailableDates = (d: Date): boolean => {
    if (this.default) {
      return true;
    }
    return this.listDates.some(x => x.toISOString().slice(0, 10) === d.toISOString().slice(0, 10));

  }
  onSelectDate(d: ({ isActive: boolean, date: Date } | undefined)): void {
    this.clearSelectedItems();
    const hour = d?.date.getHours();
    const minute = d?.date.getMinutes();
    const year = this.selected?.getFullYear();
    const month = this.selected?.getMonth();
    const day = this.selected?.getDate();
    const date = new Date(year!, month!, day, hour, minute);
    d!.isActive = true;
    console.log(date);
  }

  generateHours(): { isActive: boolean, date: Date }[] {
    const listHours: { isActive: boolean, date: Date }[] = [];
    for (let index = 0; index < HOURS.length; index++) {
      const element = HOURS[index];
      const date = new Date();
      date.setHours(element);
      date.setMinutes(0);
      listHours.push({ "isActive": false, "date": date });
    }
    return listHours;
  }



  clearSelectedItems(): void {
    this.currentListDate.forEach(element => {
      element!.isActive = false;
    });
  }

  ngOnInit(): void {
  }

}


