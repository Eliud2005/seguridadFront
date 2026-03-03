// auth-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  template: '<p>Verificando credenciales, por favor espera...</p>'
})
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Leemos el token de la URL: .../auth-callback?token=XYZ
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('access_token', token); // Guardamos para tu authGuard
        this.router.navigate(['/home']); // Mandamos al usuario adentro
      } else {
        this.router.navigate(['/login']); // Algo salió mal, regresa al login
      }
    });
  }
}