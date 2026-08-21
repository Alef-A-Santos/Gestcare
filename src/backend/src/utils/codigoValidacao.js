import * as OTPAuth from "otpauth";

// Criando o objeto TOTP
let totp = new OTPAuth.TOTP({
    issuer: "GMAIL",
    label: "CODIGO",
    algorithm: "SHA1", // Algoritmo utilizado para a geração do código
    digits: 6, // Quantidade de digitos do código
    period: 300, // Tempo de duração em segundos (5 nesse caso)
});

export const  gerarCodigo = () =>  totp.generate();
export const  validarCodigo = (token) =>  totp.validate({token, window:1});
export const tempoRestante = () => totp.remaining();
