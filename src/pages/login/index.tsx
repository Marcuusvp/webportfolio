import { Container } from "../../components/container";
import LoginForm from "../../components/loginForm";
import { useState } from "react";
import RegisterForm from "../../components/cadastroForm";

function Login() {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const handleLoginClick = () => {
        setIsLogin(true);
    };

    const handleCadastroClick = () => {
        setIsLogin(false);
    };

    return (
        <Container>
            <div className="flex justify-center items-center h-screen">
                <div className="bg-zinc-700 w-96 opacity-80 text-white text-center p-4 h-[450px]">
                    <div className="flex flex-col md:flex-row items-center justify-around mt-4">
                        <span 
                        onClick={handleLoginClick} 
                        className={`mb-4 md:mb-0 md:mr-4 text-white cursor-pointer relative transition-all duration-300 ${isLogin ? 'animate-bounce font-extrabold' : ''}`}
                        >
                            Login
                        </span>
                        <span 
                        onClick={handleCadastroClick} 
                        className={`mb-4 md:mb-0 md:mr-4 text-white cursor-pointer relative transition-all duration-300 ${!isLogin ? 'animate-bounce font-extrabold' : ''}`}
                        >
                            Cadastro
                        </span>
                    </div>
                    <div>
                        {isLogin ? <LoginForm /> : <RegisterForm />}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Login;