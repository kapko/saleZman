import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers } from '@angular/http';

@Injectable()
export class ElasticSearchService {
  url: string;
  elasticConfig: any;
  header: Headers = new Headers();

  constructor(
    private authService: AuthService,
    private http: Http,
  ) {
    this.authService
      .getElasticUrl()
      .subscribe(config => {
        this.elasticConfig = config;
      });
  }

  createAuthorizationHeader() {
    this.header
      .append('Authorization', 'Basic ' +
      btoa(`${this.elasticConfig.username}:${this.elasticConfig.password}`)); 
  }

  getStores(name: string = '', from: number = 0): any {
    this.createAuthorizationHeader();

    return this.http.get(
      `${this.elasticConfig.elasticUrl}stores/_search?size=20&from=${from}&q=_name=${name}`,
      {headers: this.header}
    );
  }

}
