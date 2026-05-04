import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  device: any;

  constructor(private ds:DataService) { }

  ngOnInit(): void {
    window.scroll(0, 0)
    this.deviceData()
  }

  deviceData() {
    this.ds.json2().subscribe((data: any) => {
      this.device = data.Form[0].devices   
    })
  }
}
