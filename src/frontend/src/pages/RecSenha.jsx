
import Logo from "../Components/Logo";
import fundo from "../assets/imagem/FundoSenha.png";
import fundoForm from "../assets/imagem/fotoMelhoradaGestcare.png";
import { Link } from 'react-router-dom';
import InputRec from "../components/InputRec";




import logoRosa from "../assets/logos/logo_rosa.png";

function RecSenha() {
  return (
    <div>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="m-7 flex w-25 absolute">
          <Logo img={logoRosa} />
        </div>

        {/* LADO ESQUERDO */}

        <div
          
          className="w-full md:w-AUTO h-screen p-8 text-white  bg-cover bg-left hidden lg:flex"
          style={{ backgroundImage: `url("${fundo}")` }}
        ></div>

        {/* LADO DIREITO */}

        <main
          className="w-full md:w-2/5 min-h-screen flex items-center justify-center px-6 rounded-lg"
          style={{ backgroundImage: `url("${fundoForm}")` }}
        >
        
          <div className=" w-full h-full flex flex-col justify-center gap-5">
            <h2 className=" font-playfair text-center text-4xl  text-white mt-12">
              <b>Redefinir senha.</b>

            </h2> 
             <p className=" font-poppins text-center text-[20px]  text-white font-bold m-3">Informe seu Email <br />
              para redefinir sua senha</p>
           

            <InputRec />

            
            <div className="text-center font-poppins  text-white text-[16px] ">
            
               
                  <Link className=" hover:underline text-white font-bold " to="/login">Voltar ao login</Link>
            
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default RecSenha;
