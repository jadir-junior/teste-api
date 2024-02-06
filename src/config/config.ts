import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

class Config {
  constructor(private env: { [key: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]): this {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort(): string {
    return this.getValue('PORT', true);
  }

  public isProduction(): boolean {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: ['dist/**/*.entity{.ts,js}'],
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      ssl: this.isProduction(),
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}

const config = new Config(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { config };
