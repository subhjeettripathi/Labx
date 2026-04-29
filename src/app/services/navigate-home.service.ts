import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigateHomeService {

  constructor(private router:Router) { }

  navigateToHome(): Promise<boolean> {
    return this.router.navigate(['/']);
  }
}
