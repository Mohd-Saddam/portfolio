import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { PortfolioData } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private readonly dataUrl = 'assets/data/portfolio-data.json';
  private cache$?: Observable<PortfolioData>;

  constructor(private http: HttpClient) {}

  /**
   * Fetches portfolio data from JSON file
   * Uses caching to avoid multiple HTTP requests
   */
  getPortfolioData(): Observable<PortfolioData> {
    if (!this.cache$) {
      this.cache$ = this.http.get<PortfolioData>(this.dataUrl).pipe(
        shareReplay(1),
        catchError(error => {
          console.error('Error loading portfolio data:', error);
          return of(this.getDefaultData());
        })
      );
    }
    return this.cache$;
  }

  /**
   * Clear cache to force reload of data
   */
  clearCache(): void {
    this.cache$ = undefined;
  }

  /**
   * Returns default/fallback data structure
   */
  private getDefaultData(): PortfolioData {
    return {
      personalInfo: {
        name: 'Your Name',
        title: 'Developer',
        email: 'email@example.com',
        phone: '',
        location: '',
        summary: 'Portfolio summary goes here.',
        about: [],
        quickFacts: []
      },
      experiences: [],
      education: [],
      skills: [],
      skillItems: [],
      productionProjects: [],
      sampleProjects: [],
      testimonials: [],
      socialLinks: []
    };
  }
}
