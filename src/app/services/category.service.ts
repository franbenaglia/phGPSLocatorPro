import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { catchError, from, mergeMap, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private CATEGORY: string = 'categories';

  constructor() {

    let categories = ['General', 'Building', 'Street', 'People'];

    this.getCategories().subscribe(c => {
      if (!c.value) {
        this.setCategories(categories);
      }
    });

  }

  public addCategory(category: string) {

    let categories: string[] = []

    this.getCategories().subscribe(c => {
      let cs: string[] = JSON.parse(c.value);
      categories.push(...cs);
      categories.push(category);
      Preferences.set({
        key: this.CATEGORY,
        value: JSON.stringify(categories),
      });
    });
  }

  public getCategories() {

    return from(Preferences.get({
      key: this.CATEGORY
    }));

  }

  public categoryExist(category: string): Observable<any> {
    /*
        this.getCategories().subscribe(cs => {
          let cats: string[] = JSON.parse(cs.value);
          let i = cats.findIndex(c => c === category)
          return i !== -1
        });
        */

    return this.getCategories().pipe(
      mergeMap(cs => {
        let cats: string[] = JSON.parse(cs.value);
        let i = cats.findIndex(c => c === category)
        return of(i !== -1);
      }),
      catchError(err => {
        console.log(err);
        return err;
      }
      ));

  }

  private setCategories(categories: string[]) {

    Preferences.set({
      key: this.CATEGORY,
      value: JSON.stringify(categories),
    });

  }

}
