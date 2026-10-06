export function criarConfig(horario, recorrencia, horario_fixo) {
    let config;
    const [hora, minuto] = horario.split(":");
    if (typeof recorrencia == "object") {
      const dias = Array.from(recorrencia).join(",");

      // horário fixo = Uma única vez
      // Se não for horário fixo = Várias vezes 
      let rule = horario_fixo
        ? `0 ${minuto} ${hora} * * ${dias}`
        : `0 */${minuto} */${hora} * * ${dias}`;
      config = { rule: rule, tz: "America/Sao_Paulo" };
    } else {
      const [ano, mes, dia] = recorrencia.split("-");
      config = new Date(ano, mes-1, dia, hora, minuto); // mes - 1 = Mês correto no js
      config = {
        year: config.getFullYear(),
        month: config.getMonth(),
        date: config.getDate(),
        hour: config.getHours(),
        minute: config.getMinutes(),
        second: 0,
        tz: "America/Sao_Paulo",
      };
    }
    return config;
  }