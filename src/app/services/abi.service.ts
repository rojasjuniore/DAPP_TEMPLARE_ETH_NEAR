import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbiService {

  constructor(private http: HttpClient) { }

  // getABI loads the ABI of the contract
  // This is an async function so we can wait for it to finish executing
  getABI() {
    return new Promise((resolve, reject) => {
      try {
        this.http.get<any>(environment.configUrlAbi)
          .subscribe((res: any) => {
            resolve(res.abi);
          })
      } catch (error) {
        alert(JSON.stringify(error))
        reject(error)
      }
    })
  }
}
