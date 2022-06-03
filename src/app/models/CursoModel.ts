import { UnidadeModel } from "./UnidadeModel";

export class CursoModel {
    id: number;
    nome: string;
    unidadeId: number;
    unidade: UnidadeModel;
}
