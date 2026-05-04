import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  terms: any;

  constructor(private ds:DataService,private location:Location) { }

  ngOnInit(): void {
    this.termsData()
    window.scroll(0, 0);
  }

  termsData() {
    this.ds.json2().subscribe((data: any) => {
      this.terms = data.Website[0].footer_menu.footer_term.term_of_use.text   
    })
  }
  
  back(){
    this.location.back();
  }

}
