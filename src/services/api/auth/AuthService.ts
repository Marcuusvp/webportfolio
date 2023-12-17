import { Api } from "../axios-config";

interface IPermissao {
    name: string;
    code: number;
}

interface IAuth {
    token: string,
    username: string,
    permissoes: IPermissao[]
}

const auth = async (email: string, password: string): Promise<IAuth | Error> => {
    try {
        const {data} = await Api.post('/login', {email, password});
        if (data.retorno) {
            return data.retorno
        }
        else {
            return data.erros;
        }
    } catch (error) {
        throw error;
    }
};

export const AuthService = {
    auth,
}