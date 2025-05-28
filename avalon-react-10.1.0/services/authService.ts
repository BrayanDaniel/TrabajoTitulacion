// URL de tu microservicio de autenticación
const API_BASE_URL = 'http://localhost:8080/api/auth';

export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface TokenResponseDto {
    accessToken: string;  // Cambiado de 'token' a 'accessToken' según tu API
    tokenType: string;
    expiresIn: number;
    usuario?: any;
}

export interface UsuarioResponseDto {
    id: number;
    username: string;
    email: string;
    nombre?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
}

class AuthService {
    /**
     * Realizar login con el microservicio
     */
    async login(loginRequest: LoginRequestDto): Promise<ApiResponse<TokenResponseDto>> {
        try {
            console.log('Intentando login con:', { username: loginRequest.username });
            console.log('URL del API:', `${API_BASE_URL}/login`);
            
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginRequest)
            });

            console.log('Respuesta del servidor:', response.status, response.statusText);

            if (response.ok) {
                const tokenResponse: TokenResponseDto = await response.json();
                console.log('Login exitoso:', tokenResponse);
                return {
                    success: true,
                    data: tokenResponse,
                    message: 'Login exitoso'
                };
            } else {
                const errorText = await response.text();
                console.error('Error del servidor:', errorText);
                return {
                    success: false,
                    message: response.status === 401 ? 'Credenciales inválidas' : 'Error en el servidor'
                };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                message: 'Error de conexión con el servidor. Verifica que el microservicio esté ejecutándose en puerto 8080.'
            };
        }
    }

    /**
     * Guardar token y datos del usuario en localStorage y cookies
     */
    saveAuthData(tokenResponse: TokenResponseDto): void {
        if (typeof window !== 'undefined') {
            // Guardar en localStorage usando accessToken
            localStorage.setItem('authToken', tokenResponse.accessToken);
            if (tokenResponse.usuario) {
                localStorage.setItem('userInfo', JSON.stringify(tokenResponse.usuario));
            }
            if (tokenResponse.expiresIn) {
                const expirationTime = Date.now() + (tokenResponse.expiresIn * 1000);
                localStorage.setItem('tokenExpiration', expirationTime.toString());
            }

            // Guardar en cookies - configurar para que expiren más rápido
            const expires = tokenResponse.expiresIn 
                ? new Date(Date.now() + (tokenResponse.expiresIn * 1000))
                : new Date(Date.now() + (2 * 60 * 60 * 1000)); // Solo 2 horas por defecto

            document.cookie = `authToken=${tokenResponse.accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        }
    }

    /**
     * Obtener token guardado
     */
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    /**
     * Obtener información del usuario
     */
    getUserInfo(): any | null {
        if (typeof window !== 'undefined') {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo ? JSON.parse(userInfo) : null;
        }
        return null;
    }

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Verificar si el token no ha expirado
        if (typeof window !== 'undefined') {
            const expiration = localStorage.getItem('tokenExpiration');
            if (expiration && Date.now() > parseInt(expiration)) {
                this.logout();
                return false;
            }
        }

        return true;
    }

    /**
     * Cerrar sesión
     */
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('tokenExpiration');
            
            // Limpiar cookie
            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }

    /**
     * Obtener headers con autorización para otras peticiones
     */
    getAuthHeaders(): HeadersInit {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }
}

export default new AuthService();