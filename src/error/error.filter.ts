import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Filtro global para capturar exceções e enviar para Discord via webhook.
 * Ideal para monitoramento de erros em produção.
 */
@Catch()
export class DiscordExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DiscordExceptionFilter.name);
  private readonly discordWebhookUrl =
    'https://discord.com/api/webhooks/1371646006059471001/_ox683BfWiC6pIl0CbEJe_5DFtFsywZt_9nCkSIlZ0P4fn9WIHtJ0mV9e6IvoCfVAG70';

  /**
   * Método principal que captura qualquer exceção lançada na aplicação.
   * Envia o erro para o Discord e registra no console.
   */
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : String(exception);

    // Monta a mensagem para o Discord
    const discordMessage = {
      content: `🚨 **Erro capturado no Microservice** 🚨\n**Status:** ${status}\n**Rota:** ${(request as any)?.url}\n**Mensagem:** ${typeof message === 'string' ? message : JSON.stringify(message, null, 2)}\n**Data:** ${new Date().toLocaleString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    };

    // Envia para o Discord usando https nativo
    await this.sendToDiscord(discordMessage);

    // Loga no console (opcional)
    this.logger.error(
      `Erro: ${JSON.stringify(message)} | Rota: ${(request as any)?.url}`,
    );
  }

  /**
   * Envia a mensagem de erro para o Discord via webhook usando https nativo.
   * @param message Objeto com a propriedade 'content' (texto a ser enviado)
   */
  /**
   * Envia a mensagem de erro para o Discord via webhook usando fetch.
   * O fetch é mais simples e moderno para requisições HTTP.
   * @param message Objeto com a propriedade 'content' (texto a ser enviado)
   */
  async sendToDiscord(message: { content: string }) {
    try {
      console.log('Enviando mensagem para Discord...');
      // O fetch já está disponível no Node.js 18+ ou pode ser instalado via 'node-fetch'
      const response = await fetch(this.discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      if (!response.ok) {
        this.logger.error(
          `Falha ao enviar mensagem para Discord: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      this.logger.error('Erro ao enviar mensagem para Discord (fetch):', error);
    }
  }

  // /**
  //  * Envia a mensagem para o Discord usando o módulo https nativo do Node.js
  //  * Não depende de bibliotecas externas.
  //  */
  // private sendToDiscord(message: any) {
  //   const data = JSON.stringify(message);
  //   const url = new URL(this.discordWebhookUrl);

  //   const options = {
  //     hostname: url.hostname,
  //     path: url.pathname + url.search,
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Content-Length': Buffer.byteLength(data),
  //     },
  //   };

  //   const req = https.request(options, (res) => {
  //     // Opcional: pode tratar resposta, se necessário
  //     res.on('data', () => {});
  //   });

  //   req.on('error', (error: any) => {
  //     this.logger.error('Erro ao enviar log para Discord:', error);
  //   });

  //   req.write(data);
  //   req.end();
  // }
}
