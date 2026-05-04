import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../shared/loader.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
  }

}
