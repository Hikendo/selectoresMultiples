import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, resumeCountry } from '../../interfaces/country';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion:resumeCountry[]= [];
  public borders: resumeCountry[]= []

  public myForm: FormGroup = this.fb.group({
    region: ['',[Validators.required]],
    country: ['',[Validators.required]],
    border: ['',[Validators.required]],
  });

//inyectar servicio en el constructor
  constructor(
    private fb:FormBuilder,
    private countryService: CountriesService
  ) {  }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();

  }

  get regions(): Region[]{
    return this.countryService.regions;
  }
  onRegionChanged():void{
    this.myForm.get('region')!.valueChanges.pipe(
      tap(()=> this.myForm.get('country')!.setValue('') ),
      tap(()=> this.borders=[]),
      switchMap((region) => this.countryService.getCountriesByRegion(region))
    )
    .subscribe(
      countries => this.countriesByRegion= countries
  );
  }
  onCountryChanged():void{
    this.myForm.get('country')!.valueChanges.pipe(
      tap(()=> this.myForm.get('border')!.setValue('') ),
      filter( (value : string) => value.length > 0),
      switchMap((alphaCode) => this.countryService.getCountryByAlphaCode(alphaCode)),
      switchMap((country) => this.countryService.getCountriesBordersByCodes(country.borders))

    )
    .subscribe(
      countries => this.borders= countries
  );
  }


}
