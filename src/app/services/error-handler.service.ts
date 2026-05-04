import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if(chunkFailedMessage.test(error.message)) {
      window.location.reload();
      
    }
  }
}
