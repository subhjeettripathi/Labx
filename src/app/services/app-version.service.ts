import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DecryptService } from './decrypt.service';
@Injectable({ providedIn: 'root' })
export class AppVersionService {
  private version: string | null = null;

  constructor(private http: HttpClient, private ds: DecryptService) { }

  loadVersion(): Promise<void> {
    return firstValueFrom(
      this.http.get<{ version: string }>('https://api.artofliving.app/artoflivingapi/v10/content/version/device/web')
    )
      .then((res:any): void => {
        this.ds.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.ds.decryptData);
        this.version = decryptData.web_cache;
        console.log(decryptData);
        
      })
      .catch(() => {
        this.version = 'default';
      });
  }

  getVersion(): string {
    return this.version ?? 'default';
  }
}
