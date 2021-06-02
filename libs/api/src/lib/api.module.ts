import { ModuleWithProviders, NgModule } from '@angular/core';
import { ApiModuleConfig } from './models/config.model';
import { GOOGLE_API_URL } from './tokens/api-url.token';

@NgModule()
export class ApiModule {
  static forRoot({
    baseUrl,
  }: ApiModuleConfig = {}): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: GOOGLE_API_URL,
          useValue: baseUrl || 'https://www.googleapis.com',
        },
      ],
    };
  }
}
