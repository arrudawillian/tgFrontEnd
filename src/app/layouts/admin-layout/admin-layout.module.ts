import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileRegisterComponent } from 'src/app/pages/user-profile-register/user-profile-register.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { UserPacotesComponent } from 'src/app/pages/user-pacotes/user-pacotes.component';
import { UserDocumentsComponent } from 'src/app/pages/user-documents/user-documents.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DashboardAdminComponent } from 'src/app/pages/dashboard-admin/dashboard-admin.component';
import { AdminAtestadosComponent } from 'src/app/pages/admin-atestados/admin-atestados.component';
import { AdminPagamentosComponent } from 'src/app/pages/admin-pagamentos/admin-pagamentos.component';
import { AdminConsultaComponent } from 'src/app/pages/admin-consulta/admin-consulta.component';
import { AdminCheckinComponent } from 'src/app/pages/admin-checkin/admin-checkin.component';
import { AdminCursoComponent } from 'src/app/pages/admin-curso/admin-curso.component';
import { AdminUnidadeComponent } from 'src/app/pages/admin-unidade/admin-unidade.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    NgxMaskModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    UserProfileRegisterComponent,
    UserProfileComponent,
    UserPacotesComponent,
    UserDocumentsComponent,
    DashboardComponent,
    DashboardAdminComponent,
    AdminAtestadosComponent,
    AdminPagamentosComponent,
    AdminConsultaComponent,
    AdminCheckinComponent,
    AdminCursoComponent,
    AdminUnidadeComponent
  ]
})

export class AdminLayoutModule {}
