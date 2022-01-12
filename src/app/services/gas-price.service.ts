import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const urlGas = 'https://ethgasstation.info/json/ethgasAPI.json'

@Injectable({
  providedIn: 'root'
})
export class GasPriceService {


  constructor(private http: HttpClient) { }

  useGasPrice() {
    this.http.get<any>(urlGas)
      .subscribe((response: any) => {
        return response;
      })
  }


}
