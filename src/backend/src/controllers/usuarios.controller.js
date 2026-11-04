import UsuariosService from "../services/usuarios.service.js";
import { resolve } from "path";

const usuariosService = new UsuariosService();

export default class UsuariosController {
  Listar() {
    return async (req, res) => {
      try {
        const response = await usuariosService.Listar();
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ erro: error.message });
      }
    };
  }
  Cadastrar() {
    return async (req, res) => {
      try {
        const { dados } = req.body;

        const response = await usuariosService.Cadastrar(dados);
        return res.status(201).send(response);
      } catch (error) {
        console.error(error);
        const { erro, status } = JSON.parse(error.message);

        if (status) {
          return res.status(status).send({ erro });
        }
        return res.status(500).send({ erro: erro });
      }
    };
  }
  Deletar() {
    return async (req, res) => {
      try {
        const { id } = req.params;
        const response = await usuariosService.Deletar(id);
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        const { erro, status } = JSON.parse(error.message);

        if (status) {
          return res.status(status).send({ erro });
        }
        return res.status(500).send({ erro: erro });
      }
    };
  }
  Atualizar() {
    return async (req, res) => {
      try {
        const { id } = req.params;
        const { dados } = req.body;
        const response = await usuariosService.Atualizar(id, dados);
        return res
          .status(200)
          .send({ mensagem: "Dados atualizados com sucesso!" });
      } catch (error) {
        console.error(error);
        const { erro, status } = JSON.parse(error.message);

        if (status) {
          return res.status(status).send({ erro });
        }
        return res.status(500).send({ erro: erro });
      }
    };
  }
  UploadFoto() {
    return async (req, res) => {
      try {
        console.log(req.body);
        console.log(req.file);
        // console.log(req);
        const caminho = await usuariosService.UploadFoto(req.file);
        res.status(201).send({
          mensagem: "Foto inserida com sucesso!",
          caminho_foto: caminho,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ erro: "Erro Interno no servidor!" });
      }
    };
  }
  BuscarFoto() {
    return async (req, res) => {
      try {
        const { caminho_foto } = req.params;
        console.log(caminho_foto)
        return res.status(200).sendFile(resolve(caminho_foto.replaceAll("-", "/")));
      } catch (error) {
        console.error(error);
        res.status(500).send({ erro: "Erro Interno no servidor!" });
      }
    };
  }
}
