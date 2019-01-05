import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { EpicResp } from '../models/epicResp';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
//  title = 'epic';
  dates: string[] = [];
  resp: EpicResp[] = [];
  _isEnhanced = false;

  public get isEnhanced(): boolean {
    return this._isEnhanced;
  }
  public set isEnhanced(v: boolean) {
    this._isEnhanced = v;
    this.resp.length = 0;
    this.getImagesByDate(this.formatImagesDate(this._selectedDate));
  }

  _selectedDate: Date = new Date();
  public get selectedDate(): Date {
    return this._selectedDate;
  }
  public set selectedDate(v: Date) {
    this._selectedDate = v;
    this.resp.length = 0;
    this.getImagesByDate(this.formatImagesDate(this._selectedDate));
  }

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    // this.title = 'EPIC';
    // this.httpClient.get<string[]>('https://epic.gsfc.nasa.gov/api/natural').subscribe(d => {
    //   this.dates = d;
    // });

    this.selectedDate = new Date(new Date().setDate(new Date().getDate() - 1));
  }

  getImagesByDate(date: string) {
    this.httpClient.get<EpicResp[]>(`https://epic.gsfc.nasa.gov/api/${this.isEnhanced ? 'enhanced' : 'natural'}/date/${date}`)
    .subscribe(respMappedItems => {
      // console.log(respMappedItems);
      this.resp = respMappedItems;
    });
  }

  getImageUrl(image: string) {
    // console.log('getImageUrl ' + image);
    return `https://epic.gsfc.nasa.gov/archive/${this.isEnhanced ? 'enhanced' : 'natural'}/${this.formatImageDateForUrl(this.selectedDate)}/png/${image}.png`
  }

  formatImagesDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  formatImageDateForUrl(date: Date) {
    const yyyy = this.datePipe.transform(date, 'yyyy');
    const MM = this.datePipe.transform(date, 'MM');
    const dd = this.datePipe.transform(date, 'dd');
    return `${yyyy}/${MM}/${dd}`;
  }

  setDate(year: number, month: number, day: number) {
    this.selectedDate = new Date(year, month - 1, day);
  }
}
