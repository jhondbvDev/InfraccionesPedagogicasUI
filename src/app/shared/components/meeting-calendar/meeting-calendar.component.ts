import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { SalaService } from 'src/app/private/http/sala.service';
import { ISala } from 'src/app/_models/sala.interface';


const HOURS: number[] = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18]

@Component({
  selector: 'app-meeting-calendar',
  templateUrl: './meeting-calendar.component.html',
  styleUrls: ['./meeting-calendar.component.scss']
})
export class MeetingCalendarComponent implements OnInit {
  @Input() default: boolean = false;
  @Output() selectedSala= new EventEmitter<ISala>;
  @Input() inputSala:ISala|null=null;
  selected: Date | null;
  minDate: Date;
  dateFilter = (date: Date): boolean => {return true;}

  // listDates: Array<Date>;
  currentListDate: ({ isActive: boolean, sala: ISala } | undefined)[] = [];
  defaultListSalas: { isActive: boolean, sala: ISala }[];
  listSalas!: ISala[];

  constructor(
    private salaService: SalaService,
    private snackBar : MatSnackBar,
  ) {
    this.selected = null;
    this.minDate = new Date();
    this.selectedSala.emit(undefined);
    // this.listDates = DATA;
    this.defaultListSalas = this.generateSalas(new Date());

  }

  onDateChanged(dateChanged: Date | null): void {

    if (this.default) {
      if(dateChanged===null){
        dateChanged=new Date();
      }
      this.currentListDate = this.generateSalas(dateChanged);
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

  generateSalas(d:Date): { isActive: boolean, sala: ISala }[] {
    const listSalas: { isActive: boolean, sala: ISala }[] = [];
    for (let index = 0; index < HOURS.length; index++) {
      const element = HOURS[index];
      const date = new Date(d.getFullYear(),d.getMonth(),d.getDate(),element,d.getMinutes(),0,0 );
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
      error: (err: any) => { 
        this.snackBar.open('Ocurrio un error consultando las salas , comuniquese con el administrador.')
      }
    });
  }

  ngOnInit(): void {
    if(this.inputSala!==null && this.inputSala!==undefined){
      //Modo edicion
      this.onDateChanged(this.inputSala.fecha);
      const element = 
      this.currentListDate
      .find(x=>x?.sala.fecha.toString().slice(16,21)===this.inputSala?.fecha.toString().slice(16,21));
      this.onSelectDate(element);
      this.selected=this.inputSala.fecha;
    }
    if (!this.default) {
      this.loadSalas();
    }
  }

  // initial filter function always returns true dateFilter = (date: Date): boolean => {return true;} constructor( ... ) { this.myDataObs.subscribe( () => { // set filter function when new data is available this.dateFilter = (date: Date): boolean => { return filterBasedOnDataFromServer(date); }; }); }

}


