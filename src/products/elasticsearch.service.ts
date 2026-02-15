import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTIC_URL, // Set this to your Elasticsearch URL
    });
  }

  // Method to index a product in Elasticsearch
  async indexProduct(productId: string, productData: any) {
    try {
      await this.client.index({
        index: 'products',
        id: productId,
        body: productData,
      });
    } catch (error) {
      console.error('Error indexing product:', error);
    }
  }

  // Search products in Elasticsearch
  async searchProducts(
    query: string,
    filters: Record<string, any> = {},
    page = 1,
    size = 10,
  ) {
    const from = (page - 1) * size;

    const filterQuery = Object.keys(filters)
      .filter((key) => filters[key] !== undefined)
      .map((key) => ({ term: { [key]: filters[key] } }));

    try {
      const result = await this.client.search({
        index: 'products',
        query: {
          bool: {
            must: [{ match: { description: query } }],
            filter: filterQuery,
          },
        },
        sort: [{ price: { order: 'asc' } }],
        from,
        size,
      });

      // v8+: hits are directly on result.hits.hits
      return result.hits.hits;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}
