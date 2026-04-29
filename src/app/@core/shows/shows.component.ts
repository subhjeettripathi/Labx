import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-shows",
  templateUrl: "./shows.component.html",
  styleUrls: ["./shows.component.scss"],
})
export class ShowsComponent implements OnInit {
  contact:any
  constructor(
 private ds:DataService,private location:Location, private router: Router
  ) {

  }

  ngOnInit(): void {
    this.aboutData()
  }
  aboutData() {
    var res:any=localStorage.getItem('faqData')
    res=JSON.parse(res)
    // this.ds.faqData().subscribe((res: any) => {
      this.contact=res.Form[0].contactus.heading2.text
      console.log(this.contact)
    // })
  }

  back(){
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }
}