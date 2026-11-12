self.addEventListener("push", (event) => {
  const data = (() => {
    try {
      return event.data ? event.data.json() : {};
    } catch {
      return { titulo: event.data?.text() };
    }
  })();
  const categorias = {
    glicemia: "🩸 Glicemia",
    medicao: "💊 Medicação",
    medicacao: "💊 Medicação",
    alimentacao: "🍽️ Alimentação",
    consulta: "🗓️ Consulta",
    hidratacao: "💧 Hidratação",
  };
  const categoria = String(data.categoria || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  event.waitUntil(self.registration.showNotification(data.titulo || "Lembrete Gestcare", {
    body: categorias[categoria] || (data.categoria ? `Categoria: ${data.categoria}` : "Está na hora do seu lembrete."),
    tag: `gestcare-lembrete-${data.titulo || "rotina"}`,
    renotify: true,
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/lembretes"));
});
