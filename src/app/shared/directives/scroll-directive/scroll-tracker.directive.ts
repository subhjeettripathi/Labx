
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollTracker]'
})
export class ScrollTrackerDirective {

 
  @Output() scrollingFinished = new EventEmitter<void>();

  emitted = false;
  constructor() { }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if(window.innerWidth>992){
      if ((window.innerHeight + (window.scrollY+600)) >= document.body.scrollHeight && !this.emitted) {
        this.emitted = true;
        this.scrollingFinished.emit();
        
      } else if ((window.innerHeight + (window.scrollY+600)) < document.body.scrollHeight) {
        this.emitted = false;
      }
    }
    else {
      if ((window.innerHeight + (window.scrollY+1200)) >= document.body.scrollHeight && !this.emitted) {
        this.emitted = true;
        this.scrollingFinished.emit();
        
      } else if ((window.innerHeight + (window.scrollY+1200)) < document.body.scrollHeight) {
        this.emitted = false;
      }
    }
   
  }
}
