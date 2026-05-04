import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Location } from "@angular/common";
declare var $:any
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})

export class AboutUsComponent implements OnInit {
  about: any;
  imageurl: any;
  constructor(private ds:DataService,private location:Location) { }

  ngOnInit(): void {
    window.scroll(0, 0)
    this.aboutData()
  }

  aboutData() {
    this.ds.json2().subscribe((data: any) => {    
      this.about = data.Website[0].footer_menu.company.about_us
      this.imageurl = this.about.background_image; 
    })
  }

  back() {
    this.location.back();
  }
  
}