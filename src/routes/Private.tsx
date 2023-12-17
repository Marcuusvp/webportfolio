import { ReactNode, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateProps{
    children: ReactNode;
}

export function Private({children}: PrivateProps): any {
    const {isAuthenticated } = useAuthContext()
    const [checkingAuthentication, setCheckingAuthentication] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
          // Aguarde a verificação de autenticação
          await new Promise((resolve) => setTimeout(resolve, 0));
          setCheckingAuthentication(false);
        };
        checkAuthentication();
    }, [checkingAuthentication]);

    if(checkingAuthentication){
        return <div></div>
    }

    if(!isAuthenticated && !checkingAuthentication){
        console.log(isAuthenticated)
        return<Navigate to="/login"/>
    }

    return children;
}