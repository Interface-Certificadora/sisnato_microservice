import { Injectable } from '@nestjs/common';
import { Fcweb } from './sequelize/models/fcweb.model';

@Injectable()
export class AppService {
 
  processarRelatorio(data: any) {
    try {
      // const status = data.tipo;

      data.data.forEach((item: any) => {
        const solicitacao = item.solicitacoes;
        solicitacao.forEach((solicitacao: any) => {
          const fichas = solicitacao.fichas;
          fichas.forEach((ficha: any) => {
            console.log('Event received ficha', ficha);
          });
        });
      });
    } catch (error) {
      console.log('Error processing event', error);
    }
  }

  async ChangeStatusOfTheSheet(id: number, status: string){
    try {
      const shearchAndUpdate = await Fcweb.update(
        {
          estatos_pgto:
            status === 'relatorio'
              ? 'Falta pgto'
              : status === 'aprovado'
                ? 'Pago'
                : null,
        },
        { where: { id } },
      );
    } catch (error) {
      console.log('Error changing status of the sheet', error);
    }
  }

}
