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
