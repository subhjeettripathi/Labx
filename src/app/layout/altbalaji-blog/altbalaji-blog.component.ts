import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-altbalaji-blog',
  templateUrl: './altbalaji-blog.component.html',
  styleUrls: ['./altbalaji-blog.component.scss']
})
export class ALTBalajiBlogComponent implements OnInit {
  altblog: any;

  constructor(private ds:DataService) { }

  ngOnInit(): void {
    this.blogData()
  }

  blogData() {
    
    this.ds.faqData().subscribe((data: any) => {
      this.altblog = data.Website[0].footer_menu.company[5].link    
    })
  }

}
