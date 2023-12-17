import React from "react";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";

const schema = z.object({
    email: z.string().min(1, 'digite seu email').email()
})

type ForgotPasswordFormProps = {
    onCancel: () => void;
  };

type FormData = z.infer<typeof schema>

const forgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onCancel }) => {
    const { register, handleSubmit, formState:{errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })


    const onSubmit = (data: FormData) => {
    console.log(data);
    }

    return (
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
                <button
                    type="submit"
                    className="bg-red-700 w-full rounded-md text-white h-10 font-medium"
                >
                    Alterar senha
                </button>
            </form>
            <span className="text-white block mt-4 cursor-pointer" onClick={onCancel}>
                Retornar ao formulário de login
            </span>
        </>
    )
}

export default forgotPasswordForm;