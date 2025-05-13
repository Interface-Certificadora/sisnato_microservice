import { IsArray, IsString } from 'class-validator';
import { SolicitacaoEventDto } from './solicitacao.envent.dto';

export class DataEventDto {
  @IsArray()
  solicitacao: Array<SolicitacaoEventDto>;

  @IsString()
  tipo: string;
}
