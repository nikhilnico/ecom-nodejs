// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { Client } from '@elastic/elasticsearch';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class ElasticsearchService extends Client{
//   private client: Client;

//   constructor(private readonly configService: ConfigService) {
    
//     super({
//       // Ensure 'elasticsearch.node' matches your config/env key
//       node: configService.get<string>('ELASTICSEARCH_URL') || 'http://localhost:9200',
//       auth: {
//         username: configService.get<string>('ELASTICSEARCH_USERNAME') || '',
//         password: configService.get<string>('ELASTICSEARCH_PASSWORD') || '',
//       }
//     });

//     const elasticUrl = process.env.ELASTICSEARCH_URL;
    
//     if (!elasticUrl) {
//       throw new Error('ELASTIC_URL is not defined in environment variables');
//     }
//     this.client = new Client({
//       node: elasticUrl,
//     });
//   }

//   // Method to index a product in Elasticsearch
//   async indexProduct(productId: string, productData: any) {
//     try {
//       await this.client.index({
//         index: 'products',
//         id: productId,
//         body: productData,
//       });
//     } catch (error) {
//       console.error('Error indexing product:', error);
//     }
//   }

//   // Search products in Elasticsearch
//   async searchProducts(
//     query: string,
//     filters: Record<string, any> = {},
//     page = 1,
//     size = 10,
//   ) {
//     const from = (page - 1) * size;

//     const filterQuery = Object.keys(filters)
//       .filter((key) => filters[key] !== undefined)
//       .map((key) => ({ term: { [key]: filters[key] } }));

//     try {
//       const result = await this.client.search({
//         index: 'products',
//         query: {
//           bool: {
//             must: [{ match: { description: query } }],
//             filter: filterQuery,
//           },
//         },
//         sort: [{ price: { order: 'asc' } }],
//         from,
//         size,
//       });

//       // v8+: hits are directly on result.hits.hits
//       return result.hits.hits;
//     } catch (error) {
//       console.error('Error searching products:', error);
//       return [];
//     }
//   }
// }
