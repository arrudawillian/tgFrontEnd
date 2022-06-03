import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UnidadeModel } from 'src/app/models/UnidadeModel';
import { UnidadeService } from 'src/app/services/unidade.service';

@Component({
  selector: 'app-admin-unidade',
  templateUrl: './admin-unidade.component.html',
  styleUrls: ['./admin-unidade.component.scss']
})
export class AdminUnidadeComponent implements OnInit {

  unidadeForm: FormGroup;
  unidade: UnidadeModel;
  unidadeId: number;
  modalRef?: BsModalRef;
  unidades: UnidadeModel[];

  constructor(
    private unidadeService: UnidadeService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.Validation();
    this.GetUnidades();
  }

  Validation(): void {
    this.unidadeForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  Registrar() {
    if (this.unidadeForm.valid) {
      this.unidade = new UnidadeModel();
      Object.assign(this.unidade, this.unidadeForm.value)

      this.unidadeService.postUnidade(this.unidade).subscribe({
        error: (e) => {
          this.toastr.error(`Falha ao tentar salvar: ${e.error}`, '',
            {
              timeOut: 2000,
              progressBar: true,
            })
        },
        complete: () => {
          this.toastr.success(`Salvo com sucesso`, '',
            {
              timeOut: 2000,
              progressBar: true,
            });
            this.unidadeForm.get('nome').setValue('');
            this.unidadeForm.get('nome').markAsUntouched();
            this.GetUnidades();
        }
      })

    } else {
      this.toastr.warning('Preencha todos os campos', '', {
        timeOut: 2000,
        progressBar: true,
      });
      this.unidadeForm.markAllAsTouched();
    }
  }

  openModalExcluir(template: TemplateRef<any>, unidadeId: number) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.unidadeId = unidadeId;
  }

  private GetUnidades() {
    this.unidadeService.getAllUnidade().subscribe({
      next: (result) => this.unidades = result,
      error: (e) => this.toastr.error(`Falha ao buscar unidades`, '',
        {
          timeOut: 2000,
          progressBar: true,
        }),
    });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.unidadeService.deleteUnidade(this.unidadeId).subscribe({
      error: (e) => this.toastr.error('erro ao excluir: ', e),
      complete: () => {
        this.unidadeId = null;
        this.GetUnidades()
      }
    });
  }

  decline(): void {
    this.modalRef?.hide();
    this.unidadeId = null
  }

}
