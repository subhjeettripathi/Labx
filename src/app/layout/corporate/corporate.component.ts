import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss']
})
export class CorporateComponent implements OnInit {
  cancellation: any;

   constructor(private ds: DataService,private location:Location,private router: Router) { }

  ngOnInit(): void {
    this.corporateData()
    window.scroll(0, 0)
  }

  corporateData() {
      var data: any = localStorage.getItem('innerJson')
    data = JSON.parse(data)
    this.cancellation = data.Website[0].footer_menu.footer_term.cancellation_policy
  }
  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }
}
