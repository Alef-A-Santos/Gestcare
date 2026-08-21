import transporter from "../config/nodemailer.js";
import configDotenv from "../config/dotenv.js";

const templateCodigo = `
    <div style="font-family:'Roboto';width:100%;height:100%;display:flex;padding:10px;baground-color:#f5f5f5;margin:0 auto;">
      <div class="card" style="background-color:#f7f7f7;width:400px;height:250px;margin:0 auto;display:inline-block;flex-direction:column;align-items:center;justify-content:center;border:2px solid #d0d0d0;border-radius:20px;">
        <div class="content" style="text-align:center;text-wrap:balance;display:inline-block;">
          <h1>Código de validação</h1>
          <p style="font-weight:600;text-wrap:balance;">O código irá expirar em 5 minutos. Insirá-o para validar o seu cadastro.</p>
        </div>
        <br/>
        <div class="codigo" style="width:max-content;background-color:#242424;color:#f5f5f5;padding:10px;font-size:1.3rem;border-radius:10px;margin:0 auto;">
            [[code]]
        </div>
        </div>
    </div>
`;

function formatarCodigoHTML(codigo) {
  let html = "";
  for (let caractere of codigo) {
    html += `<span>${caractere}</span>`;
  }
  return html;
}

export async function enviar(assunto, conteudo, destinatario) {
  try {
    await transporter.verify(); //Verificar se o servidor está online
    const info = await transporter.sendMail({
      from: configDotenv.SMTP_USER,
      to: destinatario,
      subject: assunto,
      html: `<p>${conteudo}</p>`,
    });

    console.log(info);
  } catch (err) {
    console.error(err);
  }
}

export async function  enviarCodigo(codigo, destinatario) {
  try {
    await transporter.verify(); //Verificar se o servidor está online
    const codigoFormatado = formatarCodigoHTML(codigo);
    const info = await transporter.sendMail({
      from: configDotenv.SMTP_USER,
      to: destinatario,
      subject: "Código de válidação",
      html: templateCodigo.replace("[[code]]", codigoFormatado),
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

