
export interface IVwActa {
  ActaId: number;
  FechaActa: Date;
  NumeroActa: string;
  Comentarios: string;
  Estado: string;
  FechaAprueba: Date;
  UsuarioAprueba: string;
  NumeroActivos: number;
  TotalValor: number;
  FechaIngresa: Date;
  UsuarioIngresa: string;
  EstadoInicialId: number;
  EstadoFinalId: number;
  EstadoFinal: string;
  EstadoInicial: string;
  UsuarioSupervisa: string;
  ActaCompensacion: string;
  ActaIdReferencia: number;
}


