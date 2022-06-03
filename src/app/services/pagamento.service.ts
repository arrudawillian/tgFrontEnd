import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagamentoModel } from '../models/PagamentoModel';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router : Router) { }

  getTotalPagamentos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pagamento/totalPagamentos`);
  }
  
  postPagamento(pagamento: PagamentoModel): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/pagamento`, pagamento);
  }
}
