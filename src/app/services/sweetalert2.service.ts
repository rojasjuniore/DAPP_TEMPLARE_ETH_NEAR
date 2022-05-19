import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Sweetalert2Service {

  public title = 'MIND';

  constructor() { }

  showError(err, type) {
    try {
      let mess
      if (err.message) {
        mess = err.message
      } else {
        mess = type == 1 ? JSON.parse(err.substring(err.search("{"), err.length)).message : err
      }
      Swal.fire('MIND', mess, 'error');
    } catch (error) {
      console.log("error", error)
      Swal.fire('MIND', 'error', 'error');
    }


  }

  showQuestion(err, type) {
    try {
      let mess
      if (err.message) {
        mess = err.message
      } else {
        mess = type == 1 ? JSON.parse(err.substring(err.search("{"), err.length)).message : err
      }
      Swal.fire('MIND', mess, 'error');
      return
    } catch (error) {
      console.log("error", error)
      Swal.fire('MIND', 'error', 'error');
    }



  }

  showWarning(message, type) {
    try {
      let mess = type == 1 ? JSON.parse(message.substring(message.search("{"), message.length)).message : message
      Swal.fire('MIND', mess, 'warning');
      return
    } catch (error) {
      console.log("error", error)
      Swal.fire('MIND', 'error', 'error');

    }

  }

  showSuccess(message, type = 0, transactionHash?) {
    try {
      let mess;

      if (type == 1) {
        mess = JSON.parse(message.substring(message.search("{"), message.length)).message
      } else if (type == 2) {
        mess = message
      } else if (type == 3) {
        Swal.fire({
          title: 'Transacción Exitosa.',
          icon: 'success',
          html: "<a style='color: #e5e61d !important;' href='" + environment.chain.blockExplorerUrls + transactionHash + "' target='_blank'>Ver Transacción</a>",
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK.'
        })
        //  html:  '<a style='color: #e5e61d !important;' href='//sweetalert2.github.io'>Ver Transacción</a> ',
        // https://polygonscan.com/tx/0x95a28b72079bcd4780eaae8630b9eca5ccb8c02c4008fec1956c8d85a1f46414
        return;

      }
      Swal.fire('MIND', mess, 'success');
      return
    } catch (error) {
      console.log("error", error)
      Swal.fire('MIND', 'error', 'error');
    }

  }


  async askConfirm(message: string){
    const { isConfirmed } = await Swal.fire({
      icon: 'info',
      title: this.title,
      text: message,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    return isConfirmed;
  }
}
