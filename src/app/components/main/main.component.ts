import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public code: string = 'ABCD123';

  constructor(
    private router: Router,
    private apiSrv: ApiService
  ) {}

  ngOnInit(): void {}


  /**
   * Enviar formulario del código
   * TODO: Realizar validación y captura de errores
   */
  async setCode(): Promise<void> {
    try {
      // await this.apiSrv.verifyCode(this.code);
      this.apiSrv.userCode = this.code;
      this.router.navigate([`/white-list`]);
    } catch (err) {
      console.log('Error on MainComponent@setCode', err);
    }
  }
}
