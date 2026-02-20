import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => ({
  
  /** Docker or postgres DB */
  // type: 'postgres',
  // host: process.env.DB_HOST || 'localhost',
  // port: parseInt(process.env.DB_PORT ?? '5432', 10),
  // username: process.env.DB_USER || 'your_db_username',
  // password: process.env.DB_PASSWORD || 'your_db_password',
  // database: process.env.DB_NAME || 'ecommerce_db',
  // synchronize: false,
  // logging: true,
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  // subscribers: [],

   /** Direct Nodejs app for API development only */
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,

});
