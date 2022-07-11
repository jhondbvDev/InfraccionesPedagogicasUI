import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SalaService } from 'src/app/private/http/sala.service';
import { ISala } from 'src/app/_models/sala.interface';

// const DATA: Date[] = [
//   new Date("2022-07-14 11:20:00"),
//   new Date("2022-07-13 12:00:00"),
//   new Date("2022-07-12 13:30:00"),
//   new Date("2022-07-14 09:45:00"),
//   new Date("2022-07-13 09:45:00"),
//   new Date("2022-07-14 014:45:00")
// ];

const HOURS: number[] = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18]

@Component({
  selector: 'app-meeting-calendar',
  templateUrl: './meeting-calendar.component.html',
  styleUrls: ['./meeting-calendar.component.scss']
})
export class MeetingCalendarComponent implements OnInit {
  @Input() default: boolean = false;
  @Output() selectedSala= new EventEmitter<ISala>;
  selected: Date | null;
  minDate: Date;
  dateFilter = (date: Date): boolean => {return true;}

  // listDates: Array<Date>;
  currentListDate: ({ isActive: boolean, sala: ISala } | undefined)[] = [];
  defaultListSalas: { isActive: boolean, sala: ISala }[];
  listSalas!: ISala[];

  constructor(
    private salaService: SalaService
  ) {
    this.selected = new Date();
    this.minDate = new Date();
    this.selectedSala.emit(undefined);
    // this.listDates = DATA;
    this.defaultListSalas = this.generateSalas();

  }

  onDateChanged(dateChanged: Date | null): void {

    if (this.default) {
      this.currentListDate = this.defaultListSalas;
    }
    else {
      this.currentListDate = [];
      this.selectedSala.emit(undefined);
      this.currentListDate = this.listSalas.map(function (obj) {
        const element = { "isActive": false, sala: obj };
        return element!;
      });
      this.currentListDate = this.currentListDate.filter((obj) => new Date(obj?.sala.fecha!).getDate() === dateChanged?.getDate());
    }
  }

  
  onSelectDate(d: ({ isActive: boolean, sala: ISala } | undefined)): void {
    this.clearSelectedItems();
    d!.isActive = true;
    this.selectedSala.emit(d?.sala);
  }

  generateSalas(): { isActive: boolean, sala: ISala }[] {
    const listSalas: { isActive: boolean, sala: ISala }[] = [];
    for (let index = 0; index < HOURS.length; index++) {
      const element = HOURS[index];
      const date = new Date();
      date.setHours(element);
      date.setMinutes(0);
      let newSala: ISala = {
        id: 0,
        fecha: date,
        cupo: 0,
        link: '',
        usuarioId: '',
        nombreUsuario:''
      }
      listSalas.push({ "isActive": false, "sala": newSala });
    }
    return listSalas;
  }



  clearSelectedItems(): void {
    this.currentListDate.forEach(element => {
      element!.isActive = false;
    });
    this.selectedSala.emit(undefined);
  }

  loadSalas(): void {
    this.salaService.getSalas().subscribe({
      next: (data: ISala[]) => {
        this.listSalas = data;
        this.dateFilter=(date:Date):boolean=>{
          return this.listSalas.some(x => x.fecha.toString().slice(0, 10) === date.toISOString().slice(0, 10));
        }
      },
      error: (err: any) => { }
    });
  }

  ngOnInit(): void {
    if (!this.default) {
      this.loadSalas();
    }
  }

  // initial filter function always returns true dateFilter = (date: Date): boolean => {return true;} constructor( ... ) { this.myDataObs.subscribe( () => { // set filter function when new data is available this.dateFilter = (date: Date): boolean => { return filterBasedOnDataFromServer(date); }; }); }

}


