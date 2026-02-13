export default () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',  // Change this to RDS endpoint if using AWS
  port: parseInt(process.env.DB_PORT, 10) || 5432,  // Default to 5432 for PostgreSQL
  username: process.env.DB_USER || 'your_db_username',
  password: process.env.DB_PASSWORD || 'your_db_password',
  database: process.env.DB_NAME || 'ecommerce_db',
  synchronize: false,  // Set to 'false' in production
  logging: true,  // Set to 'false' in production
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],  // Automatically find all entities
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],  // Optional: if using migrations
  subscribers: [],
});
