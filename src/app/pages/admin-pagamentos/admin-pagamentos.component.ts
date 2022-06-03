import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PagamentoModel } from 'src/app/models/PagamentoModel';
import { UsuarioDocumentoModel } from 'src/app/models/UsuarioDocumentoModel';
import { PagamentoService } from 'src/app/services/pagamento.service';
import { UsuarioDocumentoService } from 'src/app/services/usuarioDocumento.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-pagamentos',
  templateUrl: './admin-pagamentos.component.html',
  styleUrls: ['./admin-pagamentos.component.scss']
})
export class AdminPagamentosComponent implements OnInit {

  documento: UsuarioDocumentoModel;
  documentos: UsuarioDocumentoModel[];
  modalRef?: BsModalRef;
  modalRefView?: BsModalRef;
  path: string;
  imgURL = environment.imgURL;
  production = environment.production;
  pagamentoForm: FormGroup;
  pagamento: PagamentoModel;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private usuarioDocumentoService: UsuarioDocumentoService,
    private pagamentoService: PagamentoService
  ) { }

  ngOnInit() {
    this.BuscarDocumentos();
    this.Validation();
  }

  Validation(): void {
    this.pagamentoForm = this.formBuilder.group({
      valor: ['', Validators.required],
    });
  }

  BuscarDocumentos() {
    this.usuarioDocumentoService.getDocumentosByStatus(2, 1).subscribe({
      next: (result) => {
        this.documentos = result;
      }
    })
  }

  openModalView(template: TemplateRef<any>, path: string, documento: UsuarioDocumentoModel) {
    this.path = path;
    this.documento = documento;
    this.modalRefView = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(aprovar: boolean): void {
    if (aprovar) {
      if (this.pagamentoForm.valid) {
        this.modalRef?.hide();
        this.pagamento = new PagamentoModel();
        this.pagamento.valor = this.pagamentoForm.value.valor;
        let valor: string = this.pagamentoForm.value.valor;
        let cents = valor.substring(valor.length - 2)
        let valorFinal = valor.substring(valor.length - 2, 0)
        this.pagamento.valor = parseFloat(valorFinal + '.' + cents);
        this.pagamento.usuarioId = this.documento.usuarioId;
        this.documento.statusId = 3;
        this.pagamentoService.postPagamento(this.pagamento).subscribe({
          error: (e) => this.toastr.error('Erro ao confirmar pagamento: ', e),
          complete: () => {
            this.usuarioDocumentoService.putUsuarioDocumento(this.documento).subscribe({
              error: (e) => this.toastr.error('Erro ao aprovar o documento'),
              complete: () => {
                this.BuscarDocumentos();
                this.modalRefView?.hide();
              }
            })
          }
        })
      } else {
        this.toastr.warning('Preencha o valor do pagamento', '', {
          timeOut: 2000,
          progressBar: true,
        });
        this.pagamentoForm.markAllAsTouched();
      }
    } else {
      this.documento.statusId = 2;
      this.usuarioDocumentoService.putUsuarioDocumento(this.documento).subscribe({
        error: (e) => this.toastr.error('Erro ao reprovar o documento'),
        complete: () => {
          this.BuscarDocumentos();
          this.modalRefView?.hide();
        }
      })
    }
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
