import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  terms: any;

  constructor(private ds: DataService, private location: Location,private router: Router) { }

  ngOnInit(): void {
    this.termsData()
    window.scroll(0, 0);
  }

  termsData() {
    var data: any = localStorage.getItem('innerJson')
    data = JSON.parse(data)
    // this.ds.json2().subscribe((data: any) => {
    this.terms = data.Website[0].footer_menu.footer_term.term_of_use.text
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
