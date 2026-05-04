import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserCheckService {

  constructor() { }
  checkBrowser() {
    let  drmType;
     let agent:any = navigator.userAgent.toLowerCase(),
       name = navigator.appName,
       browser;
   
     if (name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
       browser = 'ie';
       if (name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
         agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
         // browser += parseInt(agent[1]);
       } else if (agent.indexOf('edge/') > -1) { // Edge
         browser = 'Edge';
       }
       drmType = "PlayReady";
     } else if (agent.indexOf('safari') > -1) { // Chrome or Safari
       if (agent.indexOf('opr') > -1) { // Opera
         browser = 'Opera';
         drmType = 'Widevine';
       } else if (agent.indexOf('whale') > -1) { // Chrome
         browser = 'Whale';
         drmType = 'Widevine';
       } else if (agent.indexOf('edg/') > -1 || agent.indexOf('Edge/') > -1) { // Chrome
         browser = 'Edge';
         drmType = "PlayReady";
       } else if (agent.indexOf('chrome') > -1) { // Chrome
         browser = 'Chrome';
         drmType = 'Widevine';
       } else { // Safari
         browser = 'Safari';
         drmType = "FairPlay";
       }
     } else if (agent.indexOf('firefox') > -1) { // Firefox
       browser = 'firefox';
       drmType = 'Widevine';
     }
   
     // The below three lines are for the sample code only. May need to be removed.
     var result = "Running in " + browser + ". " + drmType + " supported.";
     // document.getElementById("browserCheckResult").innerHTML = result;
   
   
     return drmType;
   }
}
