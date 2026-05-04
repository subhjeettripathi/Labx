import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-country-restriction',
  templateUrl: './country-restriction.component.html',
  styleUrls: ['./country-restriction.component.scss']
})
export class CountryRestrictionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CountryRestrictionComponent>) { }

  ngOnInit(): void {
  }

}
