import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
declare var $: any
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})

export class AboutUsComponent implements OnInit {
  about: any;
  imageurl: any;
  constructor(private ds: DataService,private location:Location,private router: Router) { }

  ngOnInit(): void {
    window.scroll(0, 0)
    this.aboutData()
  }

  aboutData() {
    var data: any = localStorage.getItem('innerJson')
    data = JSON.parse(data)
    // this.ds.json2().subscribe((data: any) => {    
    this.about = data.Website[0].footer_menu.company.about_us
    this.imageurl = this.about.background_image;
    // })
  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }

}