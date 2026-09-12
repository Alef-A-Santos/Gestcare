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
          path: "/",
        });

        return res.status(200).send({ mensagem, dadosUsuario });
      } catch (error) {
        console.error(error);
        if (
          error.hasMissingValues ||
          error.inactiveUser ||
          error.incorrectPasswd
        ) {
          return res.status(400).send({ erro: error.message });
        }
        if (error.notFound) {
          return res.status(404).send({ erro: error.message });
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
        console.error(error);
        // const { erro, status } = JSON.parse(error.messageCampo obrigatórios:);
        if (error.hasMissingValues || error.invalidPasswd) {
          return res.status(400).send({ erro: error.message });
        }

        if (error.nonExistent) {
          return res.status(404).send({ erro: error.message });
        }

        return res.status(500).send({
          erro: error.emailNotSended
            ? "Falha no servidor ao enviar email! Tente novamente mais tarde"
            : "Ocorreu uma falha no cadastro!Tente novamente mais tarde.",
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
          path: "/",
        });
        return res.status(200).send({ mensagem, usuario });
      } catch (error) {
        console.error(error);
        if (error.hasMissingValues || error.expiredCode || error.invalidCode) {
          return res.status(400).send({ erro: error.message });
        }

        if (error.notFound) {
          return res.status(404).send({ erro: error.message });
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
        if (error.hasMissingValues) {
          return res.status(400).send({ erro: error.message });
        }

        return res
          .status(500)
          .send({
            erro: error.emailNotSended ? error.message : "Falha no servidor",
          });
      }
    };
  }
}
