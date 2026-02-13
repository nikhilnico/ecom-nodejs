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

  // Method to search for products in Elasticsearch
  async searchProducts(query: string, filters: any, page: number = 1, size: number = 10) {
    const from = (page - 1) * size;
    const filterQuery = Object.keys(filters).map((key) => ({
      term: { [key]: filters[key] },
    }));

    const body = {
      query: {
        bool: {
          must: [
            { match: { description: query } },
          ],
          filter: filterQuery,
        },
      },
      sort: [{ price: { order: 'asc' } }],
      from,
      size,
    };

    try {
      const result = await this.client.search({
        index: 'products',
        body,
      });
      return result.body.hits.hits;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}
