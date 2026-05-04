import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  privacy: any;

  constructor(private ds:DataService, private location:Location) { }

  ngOnInit(): void {
    this.privacyData()
    window.scroll(0, 0)
  }


  privacyData() {
    this.ds.json2().subscribe((data: any) => {    
      this.privacy = data.Website[0].footer_menu.footer_term.privacy_policy.text
    })
  }
  @HostListener('window:scroll', ['$event']) getScrollHeight(event: any) {
    const n = event.srcElement.scrollingElement.scrollTop;
 }

   
 back(){
  this.location.back();
}

}
