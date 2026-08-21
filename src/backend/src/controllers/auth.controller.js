import AuthService from "../services/auth.service.js";

const authService = new AuthService();

export default class AuthController {
  Logar() {
    return async (req, res) => {
      try {
        const { dados } = req.body;
        const response = await authService.Logar(dados);
        const { mensagem, token, dadosUsuario } = response;

        res.cookie("jwt_tkn", token, {
          httpOnly: true, // Não permite que o cookie seja acessado via js no front
          secure: true, // Só permite a transmissão de cookies via HTTP, ou conexões seguras
          maxAge: 60 * 60 * 24 * 30 * 1000, // Expira em 30 dias
        });

        return res.status(200).send({ mensagem, dadosUsuario });
      } catch (error) {
        console.error(error);
        const { erro, status } = JSON.parse(error.message);
        if (status) {
          return res.status(status).send({ erro });
        }
        return res.status(500).send({ erro: "Falha ao realizar login!" });
      }
    };
  }
  Deslogar() {
    return async (req, res) => {
      res.clearCookie("jwt_tkn");
      return res.status(200).send({ mensagem: "Logout efetuado com sucesso!" });
    };
  }
  Cadastrar() {
    return async (req, res) => {
      try {
        const { dados } = req.body;

        const response = await authService.Cadastrar(dados);

        return res.status(201).send(response);
      } catch (error) {
        console.error(error.message);
        const { erro, status } = JSON.parse(error.message);
        if (status) {
          return res.status(status).send({ erro });
        }
        return res
          .status(500)
          .send({
            mensagem:
              "Ocorreu uma falha no cadastro!Tente novamente mais tarde.",
          });
      }
    };
  }
  ValidarCodigo() {
    return async (req, res) => {
      try {
        const { codigo, dados } = req.body;

        const response = await authService.ValidarCodigo(codigo, dados);
        const { mensagem, token, usuario } = response;
        res.cookie("jwt_tkn", token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24 * 30 * 1000,
        });
        return res.status(200).send({ mensagem, usuario });
      } catch (error) {
        console.error(error);
        const { erro, status } = JSON.parse(error.message);
        if (status) {
          return res.status(status).send({ erro });
        }
        return res.status(500).send({ mensagem: "Falha ao validar o código" });
      }
    };
  }
  ReenviarCodigo() {
    return async (req, res) => {
      try {
        const { dados } = req.body;
        const response = await authService.ReenviarCodigo(dados);
        res.status(200).send(response);
      } catch (error) {
        console.error(error);
        const { erro, status } = JSON.parse(error.message);
        if (status) {
          return res.status(status).send({ erro });
        }
        return res.status(500).send({ erro: "Falha no servidor" });
      }
    }
  }
}
