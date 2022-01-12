import { Pipe, PipeTransform } from '@angular/core';
import { toWei, fromWei, getDateFromBlock } from '../helpers/utils';
@Pipe({
  name: 'web3Utils'
})
export class Web3UtilsPipe implements PipeTransform {


  constructor() { }

  transform(value: string, type: string) {
    if (type == "toWei") {
      return toWei(value);
    } else if (type == "fromWei") {
      return fromWei(value);
    } else if (type == 'dateFromBlock') {
      return getDateFromBlock(value)
    }
    else {
      return 0
    }
  }
}

