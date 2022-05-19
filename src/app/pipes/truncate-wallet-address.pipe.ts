import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({
  name: 'truncateWalletAddress'
})
export class TruncateWalletAddressPipe implements PipeTransform {

  constructor(
    private commonSrv: CommonService
  ){}

  transform(value: any): any{
    return this.commonSrv.getAddress(value);
  }

}
