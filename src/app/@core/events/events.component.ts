import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  watchingList: any[] = [];
  constructor(private _dd:DataService, private DEC_SER:DecryptService) { }

  ngOnInit(): void {
    this.getWatchlistData( )
 
  }
  getWatchlistData() {
    this._dd.getLiveData().subscribe((res:any) => {
      if (res["code"] == 1) {
        this.DEC_SER.getDecryptedData(res.result);
        const data: any = JSON.parse(this.DEC_SER.decryptData);
        this.watchingList=data
        console.log(this.watchingList);
      } 
    });
  }
}
