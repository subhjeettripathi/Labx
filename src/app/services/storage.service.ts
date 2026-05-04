import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  setData(key: string, data: any) {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(key, jsonData);
  }
  getData(key: string) {
    return localStorage.getItem(key);
  }
  removeData(key: any) {
    localStorage.removeItem(key)
  }

  loginInfoData(){
    const userAccount:any = localStorage.getItem('taploginInfo')
    return JSON.parse(userAccount);
  }
}
