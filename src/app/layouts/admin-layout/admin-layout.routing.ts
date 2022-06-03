import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { UserProfileRegisterComponent } from 'src/app/pages/user-profile-register/user-profile-register.component';
import { UserPacotesComponent } from 'src/app/pages/user-pacotes/user-pacotes.component';
import { UserDocumentsComponent } from 'src/app/pages/user-documents/user-documents.component';
import { DashboardAdminComponent } from 'src/app/pages/dashboard-admin/dashboard-admin.component';
import { AdminAtestadosComponent } from 'src/app/pages/admin-atestados/admin-atestados.component';
import { AdminPagamentosComponent } from 'src/app/pages/admin-pagamentos/admin-pagamentos.component';
import { AdminConsultaComponent } from 'src/app/pages/admin-consulta/admin-consulta.component';
import { AdminCheckinComponent } from 'src/app/pages/admin-checkin/admin-checkin.component';
import { AdminCursoComponent } from 'src/app/pages/admin-curso/admin-curso.component';
import { AdminUnidadeComponent } from 'src/app/pages/admin-unidade/admin-unidade.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate: [AuthGuard], data: { role: 1 }  },
    { path: 'dashboard-admin',      component: DashboardAdminComponent, canActivate: [AuthGuard], data: { role: 3 }  },
    { path: 'user-profile',   component: UserProfileComponent, canActivate: [AuthGuard], data: { role: 1 }  },
    { path: 'user-pacote',   component: UserPacotesComponent, canActivate: [AuthGuard], data: { role: 1 }  },
    { path: 'user-documents',   component: UserDocumentsComponent, canActivate: [AuthGuard], data: { role: 1 }  },
    { path: 'admin-atestados',   component: AdminAtestadosComponent, canActivate: [AuthGuard], data: { role: 3 }  },
    { path: 'admin-curso',   component: AdminCursoComponent, canActivate: [AuthGuard], data: { role: 3 }  },
    { path: 'admin-unidade',   component: AdminUnidadeComponent, canActivate: [AuthGuard], data: { role: 3 }  },
    { path: 'admin-pagamentos',   component: AdminPagamentosComponent, canActivate: [AuthGuard], data: { role: 3 }  },
    { path: 'admin-consulta',   component: AdminConsultaComponent, canActivate: [AuthGuard], data: { role: 3 }  },
    { path: 'admin-checkin',   component: AdminCheckinComponent, canActivate: [AuthGuard], data: { role: 3 }  },
    { path: 'user-profile-register',   component: UserProfileRegisterComponent, canActivate: [AuthGuard], data: { role: 1 } },
];
