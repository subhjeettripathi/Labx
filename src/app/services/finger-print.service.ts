import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FingerPrintService {
  visitorId = new Subject<any>();
  deviceVisitorId:any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  getFingerPrintDeviceId() {
    if (isPlatformBrowser(this.platformId)) {
      const fpPromise = FingerprintJS.load()
        ; (async () => {
          // Get the visitor identifier when you need it.
          const fp = await fpPromise;
          const result = await fp.get();
          this.visitorId.next(result.visitorId);
          this.deviceVisitorId = result.visitorId;
        })()
    }
  }
}
