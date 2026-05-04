import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss']
})
export class CorporateComponent implements OnInit {
  corporate: any;

  constructor(private ds:DataService,private location:Location) { }

  ngOnInit(): void {
    this.corporateData()
    window.scroll(0, 0)
  }

  corporateData() {
    this.ds.json2().subscribe((data: any) => {
      this.corporate = data.Website[0].footer_menu.company.corporate.text
    })
  }
  back() {
    this.location.back();
  }
}
