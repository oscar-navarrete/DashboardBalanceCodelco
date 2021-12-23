import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private router: Router,) { }

  redirectTo(uri) {
    this.router.navigate([uri], { replaceUrl: true });
  }
}
