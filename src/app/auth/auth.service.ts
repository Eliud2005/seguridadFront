import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

// Definimos qué esperamos que nos responda el NestJS
interface AuthResponse {
  access_token: string;
  user: {
    email: string;
    name: string;
    role: 'ADMIN' | 'MEDICO';
  };
}

@Injectable({
  providedIn: 'root' // Esto lo hace disponible en toda la app
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:3000/auth';

  // 1. Estados Privados (Signals)
  // Intentamos leer del localStorage para que si el usuario refresca, no pierda la sesión
  #token = signal<string | null>(localStorage.getItem('token'));
  #user = signal<AuthResponse['user'] | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // 2. Selectores Públicos (Lo que los componentes verán)
  // Usamos computed para que se actualicen automáticamente si el estado cambia
  currentUser = computed(() => this.#user());
  isAuthenticated = computed(() => !!this.#token());
  isAdmin = computed(() => this.#user()?.role === 'ADMIN');

  /**
   * Método para iniciar sesión
   */
  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => {
        // Guardar físicamente en el navegador
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        // Notificar a las señales (esto actualiza la UI al instante)
        this.#token.set(res.access_token);
        this.#user.set(res.user);
      })
    );
  }

  /**
   * Método para cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpiamos el estado
    this.#token.set(null);
    this.#user.set(null);
    
    // Mandamos al usuario de patitas a la calle (al login)
    this.router.navigate(['/login']);
  }

  /**
   * Método útil para obtener el token rápidamente (lo usaremos en el Interceptor)
   */
  getToken(): string | null {
    return this.#token();
  }
}