// services/authService.ts - CORREGIDO
interface LoginRequest {
    username: string;
    password: string;
}

interface TokenResponseDto {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    usuario?: UsuarioResponseDto;
}

interface UsuarioResponseDto {
    id: number;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    activo: boolean;
    roles: string[];
}

interface LoginResponse {
    success: boolean;
    data?: TokenResponseDto;
    message?: string;
}

interface UsuarioInfo {
    id?: number;
    username: string;
    email?: string;
    nombre?: string;
    apellido?: string;
    rol: string;
}

class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user_info';
    private readonly API_URL = 'http://localhost:8080/api/auth';

    async login(username: string, password: string): Promise<LoginResponse> {
        try {
            const loginRequest: LoginRequest = { username, password };
            
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginRequest),
            });

            if (response.ok) {
                const data: TokenResponseDto = await response.json();
                
                // Guardar token
                this.setToken(data.accessToken);
                
                // Procesar información del usuario desde la respuesta
                if (data.usuario) {
                    const userInfo: UsuarioInfo = {
                        id: data.usuario.id,
                        username: data.usuario.username,
                        email: data.usuario.email,
                        nombre: data.usuario.nombre,
                        apellido: data.usuario.apellido,
                        rol: this.extractPrimaryRole(data.usuario.roles || [])
                    };
                    
                    this.setUserInfo(userInfo);
                } else {
                    console.warn('⚠️ No se recibió información del usuario en la respuesta');
                    const basicUserInfo: UsuarioInfo = {
                        username: username,
                        rol: 'ROLE_USER'
                    };
                    this.setUserInfo(basicUserInfo);
                }
                
                return {
                    success: true,
                    data: data
                };
            } else {
                let errorMessage = 'Credenciales incorrectas';
                
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    if (response.status === 401) {
                        errorMessage = 'Usuario o contraseña incorrectos';
                    } else if (response.status === 500) {
                        errorMessage = 'Error interno del servidor';
                    } else {
                        errorMessage = `Error ${response.status}: ${response.statusText}`;
                    }
                }
                
                return {
                    success: false,
                    message: errorMessage
                };
            }
        } catch (error) {
            console.error('🚨 Error de conexión:', error);
            return {
                success: false,
                message: 'Error de conexión. Verifica que el microservicio esté corriendo en http://localhost:8080'
            };
        }
    }

    // ✅ CORREGIDO: Usar ROLE_EMP como está en la BD
    private extractPrimaryRole(roles: string[]): string {
        console.log('🔍 Roles recibidos del backend:', roles);
        
        if (roles.includes('ROLE_ADMIN')) {
            return 'ROLE_ADMIN';
        }
        // ✅ CORREGIDO: Usar ROLE_EMP (como está en la BD)
        if (roles.includes('ROLE_EMP')) {
            return 'ROLE_EMP';
        }
        if (roles.includes('ROLE_USER')) {
            return 'ROLE_USER';
        }
        
        return 'ROLE_USER'; // Por defecto
    }

    async register(userData: any): Promise<any> {
        try {
            const response = await fetch(`${this.API_URL}/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            return await response.json();
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    setUserInfo(userInfo: UsuarioInfo): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
            console.log('💾 Usuario guardado:', userInfo);
        }
    }

    getUserInfo(): UsuarioInfo | null {
        if (typeof window !== 'undefined') {
            const userInfo = localStorage.getItem(this.USER_KEY);
            const parsed = userInfo ? JSON.parse(userInfo) : null;
            return parsed;
        }
        return null;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        const userInfo = this.getUserInfo();
        
        const isAuth = !!(token && userInfo);
        
        if (!isAuth) {
            return false;
        }

        // Verificar si el token no ha expirado
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                const currentTime = Date.now() / 1000;
                
                if (payload.exp && payload.exp < currentTime) {
                    console.log('🔓 Token expirado, limpiando sesión');
                    // ✅ CORREGIDO: Solo limpiar, sin redirección automática
                    this.clearSession();
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error verificando token:', error);
            return true;
        }
    }

    hasRole(role: string): boolean {
        const userInfo = this.getUserInfo();
        const hasRole = userInfo?.rol === role;
        console.log(`🔍 Verificando rol ${role}:`, hasRole, 'Usuario actual:', userInfo?.rol);
        return hasRole;
    }

    isUser(): boolean {
        return this.hasRole('ROLE_USER');
    }

    // ✅ CORREGIDO: Usar ROLE_EMP
    isEmployee(): boolean {
        return this.hasRole('ROLE_EMP') || this.hasRole('ROLE_ADMIN');
    }

    isAdmin(): boolean {
        return this.hasRole('ROLE_ADMIN');
    }

    canViewPrices(): boolean {
        return this.isUser() || this.isEmployee();
    }

    // ✅ CORREGIDO: Usar ROLE_EMP
    getUserType(): 'customer' | 'employee' | 'admin' {
        const userInfo = this.getUserInfo();
        if (!userInfo) {
            return 'customer';
        }
        
        let userType: 'customer' | 'employee' | 'admin';
        
        if (userInfo.rol === 'ROLE_ADMIN') {
            userType = 'admin';
        } else if (userInfo.rol === 'ROLE_EMP') {
            userType = 'employee';
        } else {
            userType = 'customer';
        }
        
        console.log('👤 Tipo de usuario determinado:', userType, 'para rol:', userInfo.rol);
        return userType;
    }

    getRedirectPath(): string {
        const userType = this.getUserType();
        
        let redirectPath: string;
        switch (userType) {
            case 'admin':
                redirectPath = '/administrador';
                break;
            case 'employee':
                redirectPath = '/emprendedor';
                break;
            case 'customer':
            default:
                redirectPath = '/landing';
                break;
        }
        
        console.log('🔀 Ruta de redirección:', redirectPath);
        return redirectPath;
    }

    // ✅ CORREGIDO: Logout sin redirección automática
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
            console.log('🔓 Sesión cerrada');
            
            // ✅ CORREGIDO: Redirigir al login morado correcto
            window.location.href = '/auth/login2';
        }
    }

    // ✅ NUEVO: Limpiar sesión sin redirección (para token expirado)
    clearSession(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
            console.log('🔓 Sesión limpiada (sin redirección)');
        }
    }

    // ✅ NUEVO: Método específico para logout desde componentes
    logoutAndRedirect(): void {
        this.logout();
    }

    getAuthHeaders(): HeadersInit {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    }

    async testConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'OPTIONS',
            });
            return response.ok;
        } catch (error) {
            console.error('No se puede conectar al servidor:', error);
            return false;
        }
    }
}

const authService = new AuthService();
export default authService;