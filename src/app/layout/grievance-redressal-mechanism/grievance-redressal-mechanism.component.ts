import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-grievance-redressal-mechanism",
  templateUrl: "./grievance-redressal-mechanism.component.html",
  styleUrls: ["./grievance-redressal-mechanism.component.scss"],
})
export class GrievanceRedressalMechanismComponent implements OnInit {
  grievance: any;

  constructor(private ds: DataService) {}

  ngOnInit(): void {
    this.grievanceData();
    window.scroll(0, 0);
  }

  grievanceData() {
    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);
    this.grievance=dataPopup.Website[0].footer_menu.customer[3].text
    // this.ds.faqData().subscribe((data: any) => {
    //   this.grievance = data.Website[0].footer_menu.customer[3].text;
    // });
  }
}
