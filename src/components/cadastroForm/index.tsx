import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "../input"

const schema = z.object({
    name: z.string().min(1, "Campo nome é obrigatório"),
    email: z.string().email('Insira um e-mail válido').min(1, "e-mail obrigatório"),
    password: z.string().min(6, 'senha muito curta'),
    repassword: z.string().min(6, 'Senha muito curta')
}).refine((data) => data.password == data.repassword,{
    message: "Senhas não estão iguais",
    path:["confirm"]
});

type FormData = z.infer<typeof schema>

function RegisterForm() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    return (
        <form
            className="bg-white max-w-xl w-full rounded-lg opacity-100 p-8 mt-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='mb-3'>
            <Input
              type='text'
              placeholder='Digite seu nome completo'
              name='name'
              error={errors.name?.message}
              register={register}              
            />
          </div>
          <div className='mb-3'>
            <Input
              type='email'
              placeholder='Digite seu email...'
              name='email'
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className='mb-3'>
            <Input
              type='password'
              placeholder='Digite sua senha...'
              name='password'
              error={errors.password?.message}
              register={register}
            />
          </div>
          <div className='mb-3'>
            <Input
              type='password'
              placeholder='Repita sua senha...'
              name='repassword'
              error={errors.repassword?.message}
              register={register}
            />
          </div>
          <button type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'>
            Cadastre-se
          </button>
        </form>
    )
}

export default RegisterForm;