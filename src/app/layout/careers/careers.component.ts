import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent implements OnInit {
 shipping:any;

  constructor(private ds: DataService,private location:Location,private router: Router) { }

  ngOnInit(): void {
    window.scroll(0,0)
    this.careerData()
  }

  careerData() {
     var data: any = localStorage.getItem('innerJson')
    data = JSON.parse(data)
    this.shipping = data.Website[0].footer_menu.footer_term.shipping_policy
  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }
}
