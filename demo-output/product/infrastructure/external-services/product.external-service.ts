/**
 * External Service: ProductExternalService
 * Comunicação com serviços externos
 */
export class ProductExternalService {
  constructor(
    private readonly httpClient: HttpClient
  ) {}

  /**
   * Sincroniza dados com serviço externo
   */
  public async syncWithExternalService(productId: string): Promise<void> {
    try {
      const response = await this.httpClient.get(`/external/products/${productId}`);

      // Processar resposta e atualizar dados locais
      console.log('🔄 Sincronizado com serviço externo:', response.data);

    } catch (error) {
      console.error('❌ Erro ao sincronizar com serviço externo:', error);
      throw error;
    }
  }

  /**
   * Envia notificações para serviço externo
   */
  public async sendNotification(productId: string, event: string): Promise<void> {
    try {
      await this.httpClient.post('/external/notifications', {
        productId,
        event,
        timestamp: new Date()
      });

      console.log('📤 Notificação enviada para serviço externo');

    } catch (error) {
      console.error('❌ Erro ao enviar notificação:', error);
      // Não lançar erro para não quebrar fluxo principal
    }
  }
}

// Interface para cliente HTTP
export interface HttpClient {
  get(url: string): Promise<{ data: any }>;
  post(url: string, data: any): Promise<{ data: any }>;
}