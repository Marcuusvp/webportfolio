import React, { useState } from "react";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import ForgotPasswordForm from "../forgotPasswordForm";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const schema = z.object({
    email: z.string().email('Insira um e-mail válido').min(1, "e-mail obrigatório"),
    password: z.string().min(1, 'digite sua senha')
})

type FormData = z.infer<typeof schema>

const LoginForm: React.FC = () => {
    const { isAuthenticated, login, logout, username} = useAuthContext();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });
    const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

    const onSubmit = (data: FormData) => {
        login(data.email, data.password)
        .then(() => {
            console.log(username)
            navigate('/', {replace: true})
        })
        .catch(err => {
            console.log('ERRO AO LOGAR')
            console.log(err)
        })
    };

    const onForgotPassword = () => {
        setShowForgotPasswordForm(true);
    };

    return (
        <>
            {showForgotPasswordForm ? (
                <ForgotPasswordForm
                    onCancel={() => setShowForgotPasswordForm(false)}
                />
            ) : (
                <>
                    <form
                        className="bg-white max-w-xl w-full rounded-lg opacity-100 p-8 mt-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="mb-3">
                            <Input
                                type="email"
                                placeholder="E-mail"
                                name="email"
                                error={errors.email?.message}
                                register={register}
                            />
                        </div>
                        <div className="mb-3">
                            <Input
                                type="password"
                                placeholder="Senha"
                                name="password"
                                error={errors.password?.message}
                                register={register}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-red-700 w-full rounded-md text-white h-10 font-medium"
                        >
                            Acessar
                        </button>
                    </form>
                    <span className="text-white block mt-4 cursor-pointer" onClick={onForgotPassword}>
                        Esqueci minha senha
                    </span>
                </>
            )}
        </>
    );
};

export default LoginForm;