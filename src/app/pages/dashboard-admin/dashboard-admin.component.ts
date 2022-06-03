import { Component, OnInit } from '@angular/core';
import { PagamentoService } from 'src/app/services/pagamento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioDocumentoService } from 'src/app/services/usuarioDocumento.service';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  inscritos: number;
  pacotes: any;
  pagamentos: any;
  documentosPendentes: number;

  constructor(
    private usuarioService: UsuarioService,
    private pagamentoService: PagamentoService,
    private usuarioDocumentoService: UsuarioDocumentoService
  ) {

  }

  ngOnInit() {

    this.usuarioService.getTotalInscritos().subscribe({
      next: (r) => this.inscritos = r
    })
    this.usuarioService.getTotalPacotes().subscribe({
      next: (r) => this.pacotes = r
    })
    this.pagamentoService.getTotalPagamentos().subscribe({
      next: (r) => this.pagamentos = r,
    })
    this.usuarioDocumentoService.getTotalDocumentosByStatus(1).subscribe({
      next:(r) => this.documentosPendentes = r
    })
  }
}
