import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent implements OnInit {
  career: any;

  constructor(private ds:DataService) { }

  ngOnInit(): void {
    window.scroll(0,0)
    this.careerData()
  }

  careerData() {
    this.ds.json2().subscribe((data: any) => {
      this.career = data.Form[0].careers
    })
  }

}
