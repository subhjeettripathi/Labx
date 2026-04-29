import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>,private analyticsService:AnalyticsService    ,private mat: MatDialog, private router: Router) { 
    dialogRef.disableClose = true;  
  }

  ngOnInit(): void {
  }
  goToHome(){
    const eventParams = {
      action_name : 'signup cancelled',
    };
    this.analyticsService.logEvent('sign_up_interaction', eventParams);
    this.mat.closeAll();
    this.router.navigateByUrl('/')
  }
  close(){
    const eventParams = {
      action_name : 'signup continue',
    };
    this.analyticsService.logEvent('sign_up_interaction', eventParams);
    this.dialogRef.close()
  }
}
