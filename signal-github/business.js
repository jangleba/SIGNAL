(() => {
  const toast = document.getElementById("toast");
  const buttons = [...document.querySelectorAll("[data-state]")];
  const actions = document.getElementById("recordActions");

  const states = {
    confirmed: {
      title: "Potwierdzone działanie",
      description: "Klient potwierdził wybór chwilę przed przekazaniem.",
      status: "Potwierdzone teraz",
      inner: "Można kontaktować",
      cancelled: false
    },
    held: {
      title: "Działanie odbyło się",
      description: "Rozmowa została oznaczona jako odbyta i może przejść do dalszego etapu sprzedaży.",
      status: "Odbyte",
      inner: "Działanie wykonane",
      cancelled: false
    },
    cancelled: {
      title: "Zgłoszenie anulowane",
      description: "Klient wycofał chęć kontaktu. Zespół nie powinien wykonywać dalszych prób.",
      status: "Nie kontaktować",
      inner: "Anulowane przez klienta",
      cancelled: true
    }
  };

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function setState(name) {
    const state = states[name];
    document.getElementById("recordTitle").textContent = state.title;
    document.getElementById("recordDescription").textContent = state.description;
    document.getElementById("recordStatus").textContent = state.status;
    document.getElementById("recordInnerStatus").textContent = state.inner;
    actions.hidden = state.cancelled;
    buttons.forEach(button => button.classList.toggle("active", button.dataset.state === name));
  }

  buttons.forEach(button => button.addEventListener("click", () => setState(button.dataset.state)));
  document.querySelectorAll("[data-outcome]").forEach(button => button.addEventListener("click", () => {
    setState(button.dataset.outcome);
    notify(button.dataset.outcome === "held" ? "Status zapisany: działanie odbyło się" : "Status zapisany: nie kontaktować");
  }));

  document.getElementById("noAnswer").addEventListener("click", () => notify("Zapisano jedną nieudaną próbę — bez automatycznej serii ponagleń"));

  document.getElementById("copyPilot").addEventListener("click", async () => {
    const text = "Proponuję pilotaż SIGNAL dla jednej oferty i jednego regionu. Nie potrzebujemy Państwa starej bazy ani dodatkowego budżetu reklamowego — kierujemy niewielką część obecnego anonimowego ruchu przez stronę potwierdzenia. Porównujemy: potwierdzone zgłoszenie, umówione działanie, odbycie oraz dalszy etap sprzedaży. Po pilotażu wspólnie oceniamy wynik i dopiero wtedy ustalamy model rozliczenia.";
    try {
      await navigator.clipboard.writeText(text);
      notify("Propozycja pilotażu skopiowana");
    } catch {
      notify("Kopiowanie jest niedostępne w tym podglądzie");
    }
  });
})();
