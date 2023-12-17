/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService } from "../services/api/auth/AuthService";
import { Api } from "../services/api/axios-config";
import { jwtDecode } from 'jwt-decode';

interface IAuthContextData{
    isAuthenticated: boolean;
    logout: () => void;
    login: (email: string, password: string) => Promise<string | void>;
    username: string | undefined;
    temPermissao: (nomePermissao:string) => boolean;
}

interface IAcessToken {
    unique_name: string;
    role: string[];
    nbf: number;
    exp: number;
    iat: number;
}

interface IAuthProviderProps{
    children: React.ReactNode
}

const AuthContext = createContext({} as IAuthContextData);
const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>();
    const [, setPermissoesContext] = useState<string[]>([]);
    const [usuario, setUsuario] = useState<string>();
    const [userInfo, setUserInfo] = useState<IAcessToken | null>(null);
    //const SESSION_TIMEOUT = 1 * 60 * 60 * 1000; // Tempo limite da sessão em milissegundos, por exemplo, 1 hora
    const SESSION_TIMEOUT = 30 * 60 * 1000; // Tempo limite da sessão em milissegundos, por exemplo, 1 minuto

    useEffect(() => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
        const permissoesContext = localStorage.getItem('PERMISSOES');
        console.log("Stored token:", accessToken);
        if(accessToken){
          setAccessToken(JSON.parse(accessToken));
          const decodedToken = jwtDecode<IAcessToken>(accessToken);
          const { unique_name, role, nbf, exp, iat } = decodedToken;
          setUserInfo({ unique_name, role, nbf, exp, iat });
          Api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        }else{
          setAccessToken(undefined);
          delete Api.defaults.headers.Authorization;
        }
        if(permissoesContext){
          setPermissoesContext(JSON.parse(permissoesContext));
        }else{
          setPermissoesContext([]);  
        }
        checkSessionTimeout();
    },[])

    //Sempre que se usar uma função que está sendo passada por parâmetro em um contexto, deve-se usar o useCallback
    const handleLogin = useCallback(async (email: string, password: string) => {
        try {
          const result = await AuthService.auth(email, password);
          if (result instanceof Error) {
            return result.message;
          } else {
            localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, JSON.stringify(result.token));
            setAccessToken(result.token);
      
            // Configurar o cabeçalho de autorização imediatamente após o login
            Api.defaults.headers.Authorization = `Bearer ${result.token}`;
      
            const decodedToken = jwtDecode<IAcessToken>(result.token);
            const { unique_name, role, nbf, exp, iat } = decodedToken;
            setUserInfo({ unique_name, role, nbf, exp, iat });
      
            const permissoes = result.permissoes.map(permissao => permissao.name);
            setPermissoesContext(permissoes);
            setUsuario(result.username);
      
            localStorage.setItem('PERMISSOES', JSON.stringify(permissoes));
            localStorage.setItem('sessionTimestamp', Date.now().toString());
          }
        } catch (error) {
          // Lida com erros, se necessário
          console.error(error);
          return "Ocorreu um erro durante o login.";
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
        localStorage.removeItem('PERMISSOES');
        localStorage.removeItem('sessionTimestamp');
        setAccessToken(undefined);
    },[]);

    const checkSessionTimeout = useCallback(() => {
        const sessionTimestamp = localStorage.getItem('sessionTimestamp');
        if (!sessionTimestamp) {
          return;
        }  
        const currentTime = Date.now();
        const elapsedTime = currentTime - parseInt(sessionTimestamp, 10);  
        if (elapsedTime >= SESSION_TIMEOUT) {
          handleLogout();
        }
    }, [handleLogout]);

    const handlePermissoes = useCallback((nomePermissao: string) => {
        if (userInfo?.role) {
          return userInfo.role.includes(nomePermissao);
        }
        return false;
    }, [userInfo]);
      
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);
  
    useEffect(() => {
      console.log("isAuthenticated:", isAuthenticated);
    }, [isAuthenticated]);

    return(
      <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout, temPermissao: handlePermissoes, username: usuario }}>
        {children}
      </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);