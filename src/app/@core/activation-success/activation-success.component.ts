import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activation-success',
  templateUrl: './activation-success.component.html',
  styleUrls: ['./activation-success.component.scss']
})
export class ActivationSuccessComponent implements OnInit {
  basesignin: any;

  constructor() { }

  ngOnInit(): void {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.basesignin = dataPopup.PopupList[0]
  }


}
