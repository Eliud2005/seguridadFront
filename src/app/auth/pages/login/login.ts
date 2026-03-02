import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Asegúrate de tener esto si es standalone
  imports: [ReactiveFormsModule], // Importamos esto para el formulario
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
errorMessage() {
throw new Error('Method not implemented.');
}
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // Definimos el formulario con validaciones
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3000/auth/login', this.loginForm.value)
        .subscribe({
          next: (res: any) => {
            // Guardamos el JWT y los datos del usuario
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));

            // Redirigimos según el rol
            if (res.user.role === 'ADMIN') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            alert('Error en el login: ' + err.error.message);
          }
        });
    }
  }
}