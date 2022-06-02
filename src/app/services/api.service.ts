import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public apiURL = environment.API_URL;

  constructor(
    private http: HttpClient,
  ) { }


  /**
   * Verifica si un código accesos es válido o no
   * @param code 
   * @returns 
   */
  async verifyCode(code: string){
    return new Promise(async (resolve, reject) => {

      const url = `${this.apiURL}core/code/${code}`;
      console.log('url', url);

      this.http.get(url).subscribe(
        (res) => { resolve(res); },
        (err) => { reject(err); }
      );
    });
  }


  /**
   * Crea registro de wallets en la whitelist
   * @param params 
   * @returns 
   */
  async registreOnWhitelist(params: any){
    return new Promise(async (resolve, reject) => {

      const url = `${this.apiURL}core/whitelist/store`;
      console.log('url', url);

      this.http.post(url, params).subscribe(
        (res) => { resolve(res); },
        (err) => { reject(err); }
      );
    });
  }

}
