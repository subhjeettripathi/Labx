import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-investor-relations',
  templateUrl: './investor-relations.component.html',
  styleUrls: ['./investor-relations.component.scss']
})
export class InvestorRelationsComponent implements OnInit {
  refundPolicy:any;
  constructor(private ds: DataService,private location:Location,private router: Router) { }


  ngOnInit(): void {
    this.investerData()
    window.scroll(0, 0)
  }

  investerData() {
    var data: any = localStorage.getItem('innerJson')
    data = JSON.parse(data) 
    console.log(data.Website[0].footer_menu);
    this.refundPolicy = data.Website[0].footer_menu.footer_term.refund_policy

  }
  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }
}
