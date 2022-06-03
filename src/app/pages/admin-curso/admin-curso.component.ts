import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CursoModel } from 'src/app/models/CursoModel';
import { UnidadeModel } from 'src/app/models/UnidadeModel';
import { CursoService } from 'src/app/services/curso.service';
import { UnidadeService } from 'src/app/services/unidade.service';

@Component({
  selector: 'app-admin-curso',
  templateUrl: './admin-curso.component.html',
  styleUrls: ['./admin-curso.component.scss']
})
export class AdminCursoComponent implements OnInit {

  cursoForm: FormGroup;
  unidades: UnidadeModel[];
  curso: CursoModel;
  cursos: CursoModel[];
  modalRef?: BsModalRef;
  cursoId: number;

  constructor(
    public cursoService: CursoService,
    private unidadeService: UnidadeService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.Validation();
    this.GetUnidades();
    this.GetCursos();
  }

  Validation(): void {
    this.cursoForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      unidadeId: ['', Validators.required,]
    });
  }

  private GetUnidades() {
    this.unidadeService.getAllUnidade().subscribe({
      next: (result) => this.unidades = result,
      error: (e) => this.toastr.error(`Falha ao buscar as unidades`, '',
        {
          timeOut: 2000,
          progressBar: true,
        }),
    });
  }

  Registrar() {
    if (this.cursoForm.valid) {
      this.curso = new CursoModel();
      Object.assign(this.curso, this.cursoForm.value)

      this.cursoService.postCurso(this.curso).subscribe({
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
            })
            this.cursoForm.get('nome').setValue('');
            this.cursoForm.get('nome').markAsUntouched();
            this.GetCursos();
        }
      })

    } else {
      this.toastr.warning('Preencha todos os campos', '', {
        timeOut: 2000,
        progressBar: true,
      });
      this.cursoForm.markAllAsTouched();
    }
  }

  GetCursos() {
    this.cursoService.getAllCurso().subscribe({
      next: (result) => this.cursos = result,
      error: (e) => this.toastr.error(`Falha ao buscar os cursos`, '',
        {
          timeOut: 2000,
          progressBar: true,
        })
    });
  }

  openModalExcluir(template: TemplateRef<any>, cursoId: number) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.cursoId = cursoId;
  }

  confirm(): void {
    this.modalRef?.hide();
    this.cursoService.deleteCurso(this.cursoId).subscribe({
      error: (e) => this.toastr.error('erro ao excluir: ', e.error),
      complete: () => {
        this.cursoId = null;
        this.GetCursos()
      }
    });
  }

  decline(): void {
    this.modalRef?.hide();
    this.cursoId = null
  }

}
