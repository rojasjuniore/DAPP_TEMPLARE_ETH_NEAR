import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }


  getParameterByName(name, url?) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


  /**
   * @name getAddress
   * @param address 
   * @returns 
   */
  getAddress(address: string) {
    if (!address) { return }
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)
  }

}
