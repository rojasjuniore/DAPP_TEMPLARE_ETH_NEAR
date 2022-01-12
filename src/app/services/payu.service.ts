import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class PayuService {
  payuConfig: any
  paymentString: any
  currency_symbol = "USD"
  constructor() { }


  buyTokens(inviter, mplusMATIC, mplusUSD) {


  


    // this.paymentString = `
    // <html>
    //   <body>
    //         <form id="payu_form" method="post" action="${this.payuConfig.action}">
    //           <input name="merchantId" type="hidden" value="${this.payuConfig.merchantId}" />
    //           <input name="referenceCode" type="hidden" value="${this.payuConfig.referenceCode}" />
    //           <input name="amount" type="hidden" value="${this.payuConfig.amount}" />
    //           <input name="currency" type="hidden" value="${this.payuConfig.currency}" />
    //           <input name="signature" type="hidden" value="${this.payuConfig.signature}" />
    //           <input name="accountId" type="hidden" value="${this.payuConfig.accountId}" />
    //           <input name="test" type="hidden" value="${this.payuConfig.test}" />
    //           <input name="responseUrl" type="hidden" value="${this.payuConfig.responseUrl}" />
    //           <input name="confirmationUrl" type="hidden" value="${this.payuConfig.confirmationUrl}" />
    //           <button type="submit" value="submit" #submitBtn></button>
    //         </form>
    //         <script type="text/javascript">document.getElementById("payu_form").submit();</script>
    //     </body>
    // </html>
    // `;

    document.forms["cartpage"].submit();

    console.log("paymentString", this.paymentString)
  }


  md5(signature: string): any {
    const md5 = new Md5();
    return md5.appendStr(signature).end();
  }
}
