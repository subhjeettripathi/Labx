import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseUrl = environment.baseUrl;
  // constructor(private socket: Socket) { }

  // sendMessage(msg: any) {
  //   this.socket.emit('message', msg);
  // }
  // getMessage() {
  //   return this.socket.fromEvent('message').pipe(map((data:any) => data.msg));
  // }


  token = 'aol';
  constructor(private socket: Socket, private http: HttpClient) { }
  public socketConnection() {
    this.socket.emit('bigboyget', {
      token: this.token,      
    });
    console.log(this.socket,'connection');

  }

  public getSocketMessages = ()=>{
    return Observable.create((observer:any)=>{
      this.socket.on(this.token, (message:any)=>{
 
        observer.next(message);
        console.log(this.socket)
      });
    });
  }  

  sendMessage(msg:any){
    return this.http.post(`https://api.artofliving.app/artoflivingapi/v10/send/message`, msg);
  }
  getMessages(chat:any){
    return this.http.get(`https://api.artofliving.app/artoflivingapi/v10/message/reply/get/user_id/${chat}`)
  }
}
