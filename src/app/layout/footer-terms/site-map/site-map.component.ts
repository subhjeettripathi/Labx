import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-site-map',
  templateUrl: './site-map.component.html',
  styleUrls: ['./site-map.component.scss']
})
export class SiteMapComponent implements OnInit {
  site: any;

  constructor(private ds:DataService) { }

  ngOnInit(): void {
    window.scroll(0, 0)
    this.siteData()
  }

  siteData() {
    this.ds.json2().subscribe((data: any) => {    
      this.site = data.Website[0].footer_menu.footer_term.site_map.text
    })
  }

}
