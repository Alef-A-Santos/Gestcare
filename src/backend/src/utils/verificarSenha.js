export function testarSenha(senha){
  const rexrNumeros = /(\d){1,}/g //Expressão regular para verificação da existência de números
  const rexrLetrasMaiusculas = /([A-Z]){1,}/g //Expressão regular para verificação da existência de letras maiúsculas
  const rexrLetrasMinusculas = /([a-z]){1,}/g //Expressão regular para verificação da existência de letras minúsculas
  const rexrDemaisCaracteres = /([^\w\s]){1,}/g //Expressão regular para verificação da existência de pontuações especiais (#@% etc...

  senha = senha.replace(/\s/g, "");//Remove os espaços em branco
  if(senha.length < 8){
    return "Senha muito curta!Mínimo de 8 caracteres.";
  }
  if(!senha.match(rexrNumeros)){
    return "A senha deve conter caracteres numéricos!";
  }
  if(!senha.match(rexrLetrasMaiusculas)
    || !senha.match(rexrLetrasMinusculas)
  ){
    return "A senha deve conter letras maiúsculas e minúsculas!";
  }

  if(!senha.match(rexrDemaisCaracteres) 
    && !senha.match(/\_/g) // Verifica se contém underline
  ){
    return "A senha deve conter caracteres especiais! EX: $_@#&*";
  }

}