import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentLoaderService } from '../shared/content-loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-content-loader',
  templateUrl: './content-loader.component.html',
  styleUrls: ['./content-loader.component.scss']
})
export class ContentLoaderComponent implements OnInit {
  isLoading: Subject<boolean> = this.ContentLoaderService.isLoading;
  constructor(private ContentLoaderService: ContentLoaderService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
  }

}
