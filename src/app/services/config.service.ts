import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private configData: any = null;

  constructor(private http: HttpClient) { }


  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get(environment.baseUrl2))
      .then((data: any) => {
        this.configData = data;
      })
      .catch((err: any) => {
        this.configData = {};
      });
  }
  getConfig(): any {
    return this.configData?.result || {};
  }

  getIpLocationUrl(): string {
    const base = this.getConfig()['ip_location'];

    if (!base) {
      return '';
    }

    return `${base}/device/web`;
  }

  getApiUrl(key: string): string {
    return (this.getConfig()[key] ?? '');
  }
}
