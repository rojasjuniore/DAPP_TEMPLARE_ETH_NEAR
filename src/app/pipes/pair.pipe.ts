import { Pipe, PipeTransform } from '@angular/core';
import { ContractService } from '../services/contract.service';

@Pipe({
  name: 'pair'
})
export class PairPipe implements PipeTransform {

  constructor(
    private contractSrv: ContractService
  ){}

  async transform(pair: any, idx: number): Promise<any> {
    return await this.contractSrv.getTokenName(pair, idx);
  }

}
