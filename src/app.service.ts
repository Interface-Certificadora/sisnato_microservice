import { Injectable } from '@nestjs/common';
import { DataEventDto } from './dto/data.event.dto';
import { PrismaService } from './prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name, { timestamp: true });
  constructor(private readonly prisma: PrismaService) {}

  private readonly discordWebhookUrl =
    'https://discord.com/api/webhooks/1371646006059471001/_ox683BfWiC6pIl0CbEJe_5DFtFsywZt_9nCkSIlZ0P4fn9WIHtJ0mV9e6IvoCfVAG70';

  async processarEvent(data: DataEventDto): Promise<void> {
    try {
      // Exemplo didático: lança um erro proposital para testar o filtro global
      if (data.tipo === 'erro-teste') {
        // O filtro DiscordExceptionFilter será acionado!
        throw new RpcException(
          'Erro de teste lançado propositalmente para acionar o filtro global do Discord.',
        );
      }
      switch (data.tipo) {
        case 'relatorio':
          this.processarInit(data);
          break;
        case 'aprovado':
          this.processarAprovado(data);
          break;
        default:
          this.processarClear(data);
          break;
      }
    } catch (error) {
      this.logger.error('Error processing event', error);
    }
  }

  async processarAprovado(data: DataEventDto): Promise<void> {
    try {
      data.solicitacao.forEach((solicitacao) => {
        solicitacao.solicitacoes.forEach((lista: any) => {
          lista.fichas.forEach(async (ficha: any) => {
            const id = +ficha.id;
            try {
              const resp = await this.prisma.fcweb.update({
                where: { id },
                data: {
                  estatos_pgto: 'Pago',
                },
                select: {
                  id: true,
                  estatos_pgto: true,
                },
              });
              this.logger.log('Event received clear', resp);
            } catch (error: any) {
              if (error.code && error.meta) {
                this.logger.error(
                  `Erro Prisma ao atualizar fcweb: code=${error.code}, meta=${JSON.stringify(error.meta)}, mensagem=${error.message}`,
                );
                this.discordLog({
                  tipo: 'Erro Prisma ao atualizar fcweb',
                  meta: error.meta,
                  id: id,
                });
              } else {
                this.logger.error('Erro inesperado ao atualizar fcweb', error);
                throw new RpcException(
                  'Erro inesperado ao atualizar registro.',
                );
              }
            }
          });
        });
      });
    } catch (error) {
      this.logger.error('Error processarAprovado', error);
    }
  }

  async processarInit(data: DataEventDto): Promise<void> {
    try {
      data.solicitacao.forEach((solicitacao) => {
        solicitacao.solicitacoes.forEach((lista: any) => {
          lista.fichas.forEach(async (ficha: any) => {
            const id = +ficha.id;
            try {
              const resp = await this.prisma.fcweb.update({
                where: { id },
                data: {
                  estatos_pgto: 'Falta pgto',
                },
                select: {
                  id: true,
                  estatos_pgto: true,
                },
              });
              this.logger.log('Event received clear', resp);
            } catch (error: any) {
              // Captura e trata erros específicos do Prisma
              if (error.code && error.meta) {
                this.discordLog({
                  tipo: 'Erro Prisma ao atualizar fcweb',
                  meta: error.meta,
                  id: id,
                });
                this.logger.error(
                  `Erro Prisma ao atualizar fcweb: code=${error.code}, meta=${JSON.stringify(error.meta)}, mensagem=${error.message}`,
                );
              } else {
                this.logger.error('Erro inesperado ao atualizar fcweb', error);
                throw new RpcException(
                  'Erro inesperado ao atualizar registro.',
                );
              }
            }
          });
        });
      });
    } catch (error) {
      this.logger.error('Error processarInit', error);
    }
  }

  async processarClear(data: DataEventDto): Promise<void> {
    try {
      data.solicitacao.forEach((solicitacao) => {
        solicitacao.solicitacoes.forEach((lista: any) => {
          lista.fichas.forEach(async (ficha: any) => {
            const id = +ficha.id;
            try {
              const resp = await this.prisma.fcweb.update({
                where: { id },
                data: {
                  estatos_pgto: null,
                },
                select: {
                  id: true,
                  estatos_pgto: true,
                },
              });
              this.logger.log('Event received clear', resp);
            } catch (error: any) {
              if (error.code && error.meta) {
                this.discordLog({
                  tipo: 'Erro Prisma ao atualizar fcweb',
                  meta: error.meta,
                  id: id,
                });
                this.logger.error(
                  `Erro Prisma ao atualizar fcweb: code=${error.code}, meta=${JSON.stringify(error.meta)}, mensagem=${error.message}`,
                );
              } else {
                // Outros erros genéricos
                this.logger.error('Erro inesperado ao atualizar fcweb', error);
              }
            }
          });
        });
      });
    } catch (error: any) {
      this.logger.error('Error processarClear', error);
    }
  }

  async discordLog(data: any): Promise<void> {
    try {
      const discordMessage = {
        content: `
        🚨 **Erro capturado no Microservice** 🚨\n**Status:** ${data.tipo}\n**Meta:** ${data.meta.details}\n**Id:** ${data.id}\n**Data:** ${new Date().toLocaleString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      };
      await fetch(this.discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordMessage),
      });
    } catch (error: any) {
      this.logger.error('Error processarClear', error);
    }
  }
}
