self.addEventListener("push", (event) => {
  const data = (() => {
    try {
      return event.data ? event.data.json() : {};
    } catch {
      return { titulo: event.data?.text() };
    }
  })();
  event.waitUntil(self.registration.showNotification(data.titulo || "Lembrete Gestcare", {
    body: data.categoria || "Está na hora do seu lembrete.",
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/lembretes"));
});
