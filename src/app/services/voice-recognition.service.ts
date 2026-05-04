import { Injectable } from '@angular/core';


declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

 recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords:any;

  constructor() { }

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.addEventListener('result', (e:any) => {
     const transcript = Array.from(e.results)
        .map((result:any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
    
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
   
    this.recognition.addEventListener('end', (condition: any) => {
 
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      
      } else {
        this.wordConcat()
        this.recognition.start();
      }
    });
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
  
  }

  wordConcat() {
    this.text =this.text+this.tempWords;
    this.tempWords = '';
  
  }
}
