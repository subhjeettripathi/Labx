import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-gatewayloader',
  templateUrl: './gatewayloader.component.html',
  styleUrls: ['./gatewayloader.component.scss']
})
export class GatewayloaderComponent implements OnInit {

  isLoading: Subject<boolean> = this.loaderService.isLoadingSubject;
  constructor(private loaderService: LoaderService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  
    this.spinner.show();
   
  }
}
