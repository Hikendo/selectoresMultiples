import { Injectable } from '@angular/core';
import { Country, Region, resumeCountry } from '../interfaces/country';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl:string= 'https://restcountries.com/v3.1';


  private _regions: Region[]=[Region.Africa,Region.Americas,Region.Antarctic,Region.Asia,Region.Europe,Region.Oceania];
  constructor(
    private http:HttpClient
  ) { }

  get regions():Region[]{
    return [...this._regions];
  }
  getCountriesByRegion(region:Region): Observable <resumeCountry[]>{
    if (!region) return of([]);

    const url: string= `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;
    return this.http.get<Country[]>(url)
    .pipe(
      map(countries => countries.map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      })))
    )

  }

  getCountryByAlphaCode(cca3:string): Observable <resumeCountry>{
   // if (!cca3) return of();

    const url: string= `${this.baseUrl}/alpha/${cca3}?fields=name,cca3,borders`;
    return this.http.get<Country>(url)
    .pipe(
      map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      }))
    )

  }
  getCountriesBordersByCodes(borders: string[]): Observable<resumeCountry[]>{
    if (!borders || borders.length === 0)  return of([]);

    const countriesRequest: Observable<resumeCountry>[] = [];
    borders.forEach(code => {
      const request = this.getCountryByAlphaCode(code);
      countriesRequest.push(request);
    });
    //se envía hasta que todos los observables de nuestro array están listos
    return combineLatest(countriesRequest);
  }




}
