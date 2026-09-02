(() => {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      mobileMenu.hidden = open;
    });
    mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
    }));
  }

  const loginForm = document.querySelector("[data-login-form]");
  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();
      const message = document.querySelector("[data-login-message]");
      message.textContent = "To jest bezpieczne demo. Otwieram przykładowe środowisko firmy…";
      window.setTimeout(() => { window.location.href = "panel.html"; }, 650);
    });
  }

  const industryButtons = [...document.querySelectorAll("[data-industry]")];
  const industryPanels = [...document.querySelectorAll("[data-industry-panel]")];
  industryButtons.forEach(button => button.addEventListener("click", () => {
    const industry = button.dataset.industry;
    industryButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    industryPanels.forEach(panel => { panel.hidden = panel.dataset.industryPanel !== industry; });
  }));

  const workspace = document.querySelector(".decision-workspace");
  if (!workspace) return;

  const offers = {
    termomodernizacja: {
      company: "TermoPilot",
      title: "Kompleksowa termomodernizacja domu",
      shortTitle: "Termomodernizacja domu",
      description: "Pompa ciepła, fotowoltaika oraz montaż po sprawdzeniu parametrów budynku.",
      region: "Warszawa + 60 km",
      area: "Warszawa i okolice do 60 km",
      cost: "45–75 tys. zł brutto",
      condition: "Dotacja nie jest gwarantowana",
      browseScope: "Pompa ciepła, fotowoltaika i montaż",
      needs: [
        ["Pełna termomodernizacja", "Pełny zakres", "Chcę połączyć kilka rozwiązań"],
        ["Pompa ciepła", "Pompa ciepła", "Dobór lub wymiana źródła ogrzewania"],
        ["Fotowoltaika", "Fotowoltaika", "Instalacja dopasowana do zużycia"],
        ["Najpierw ocena doradcy", "Najpierw ocena", "Potrzebuję pomocy w wyborze zakresu"]
      ]
    },
    "pompa-ciepla": {
      company: "TermoPilot",
      title: "Dobór i montaż pompy ciepła",
      shortTitle: "Pompa ciepła",
      description: "Dobór urządzenia, instalacja i uruchomienie po analizie budynku oraz obecnego ogrzewania.",
      region: "Warszawa + 60 km",
      area: "Warszawa i okolice do 60 km",
      cost: "28–45 tys. zł brutto",
      condition: "Dobór mocy po analizie budynku",
      browseScope: "Dobór, montaż i uruchomienie pompy ciepła",
      needs: [
        ["Wymiana obecnego ogrzewania", "Wymiana ogrzewania", "Mam już inne źródło ciepła"],
        ["Pompa do nowego domu", "Nowy dom", "Instalacja projektowana od początku"],
        ["Modernizacja całej instalacji", "Cała instalacja", "Pompa wraz ze zmianami instalacji"],
        ["Najpierw dobór mocy", "Najpierw dobór", "Nie wiem jeszcze, jaki wariant wybrać"]
      ]
    },
    fotowoltaika: {
      company: "TermoPilot",
      title: "Fotowoltaika dobrana do zużycia",
      shortTitle: "Fotowoltaika",
      description: "Projekt i montaż instalacji po analizie rachunków, dachu i możliwości przyłączeniowych.",
      region: "Warszawa + 60 km",
      area: "Warszawa i okolice do 60 km",
      cost: "18–35 tys. zł brutto",
      condition: "Moc instalacji po analizie zużycia",
      browseScope: "Projekt, komponenty i montaż fotowoltaiki",
      needs: [
        ["Instalacja dla domu", "Dla domu", "Chcę obniżyć bieżące rachunki"],
        ["Fotowoltaika z magazynem", "Z magazynem energii", "Interesuje mnie większa niezależność"],
        ["Rozbudowa instalacji", "Rozbudowa", "Mam już działającą fotowoltaikę"],
        ["Najpierw analiza opłacalności", "Najpierw analiza", "Chcę poznać sensowny wariant"]
      ]
    }
  };

  const sourceLabels = {
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    www: "Strona WWW",
    email: "E-mail / newsletter",
    pdf: "PDF / prezentacja",
    direct: "Link bezpośredni"
  };

  const params = new URLSearchParams(window.location.search);
  const existingLeadMode = params.get("mode") === "confirm";
  const offerKey = offers[params.get("offer")] ? params.get("offer") : "termomodernizacja";
  const offer = offers[offerKey];
  const sourceKey = sourceLabels[params.get("source")] ? params.get("source") : "direct";
  const source = sourceLabels[sourceKey];
  const campaign = (params.get("campaign") || "bez oznaczenia").replace(/[^\p{L}\p{N} _-]/gu, "").trim().slice(0, 48) || "bez oznaczenia";
  const entryKey = params.get("entry") === "qr" ? "qr" : "link";
  const entryLabel = entryKey === "qr" ? "Kod QR online" : "Link do kliknięcia";
  const placement = (params.get("placement") || "nieoznaczone").replace(/[^\p{L}\p{N} _-]/gu, "").trim().slice(0, 32) || "nieoznaczone";

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };
  setText("[data-offer-company]", offer.company);
  setText("[data-offer-title]", offer.title);
  setText("[data-offer-description]", offer.description);
  setText("[data-offer-region]", offer.region);
  setText("[data-offer-area]", offer.area);
  setText("[data-offer-cost]", offer.cost);
  setText("[data-offer-condition]", offer.condition);
  setText("[data-browse-scope]", offer.browseScope);
  setText("[data-browse-cost]", offer.cost);
  setText("[data-browse-condition]", offer.condition);
  setText("[data-consent-copy]", `Chcę, aby wyłącznie ${offer.company} skontaktował się ze mną w wybranej sprawie, kanale i terminie.`);
  setText("[data-entry-badge]", entryKey === "qr" ? "Otwarte z kodu QR" : "Otwarte z linku");
  if (entryKey === "qr" && !existingLeadMode) {
    setText("[data-no-send-title]", "Skan kodu nie utworzył zgłoszenia.");
    setText("[data-no-send-copy]", "Firma niczego jeszcze nie widzi. Kontakt powstanie dopiero po podsumowaniu i kodzie.");
  }

  if (existingLeadMode) {
    setText("[data-context-label]", "Dokończenie wcześniejszego zgłoszenia");
    setText("[data-no-send-title]", "Twój wcześniejszy formularz nie uruchamia telefonu.");
    setText("[data-no-send-copy]", "Dopiero podsumowanie i kod określą, czy oraz kiedy firma może się skontaktować.");
    setText("[data-decision-title]", "Czy chcesz zamienić wcześniejsze zgłoszenie w konkretny następny krok?");
    setText("[data-decision-intro]", "Możesz ustalić szczegóły, tylko sprawdzić warunki albo zakończyć temat. Bez ponagleń.");
    setText("[data-browse-title]", "Możesz sprawdzać bez uruchamiania kontaktu.");
    setText("[data-browse-copy]", "Wcześniejszy lead nie został aktywowany do obsługi. Firma zobaczy status „Bez kontaktu”, ale nie dostanie terminu ani zgody na telefon.");
    setText("[data-no-title]", "Temat został zamknięty. Firma nie powinna się kontaktować.");
    setText("[data-no-copy]", "Wspólny rekord otrzyma status „Nie kontaktować”. Nie pytamy o powód i nie wysyłamy kolejnych wiadomości.");
  }

  const needsContainer = document.querySelector("[data-need-options]");
  needsContainer.innerHTML = offer.needs.map(([value, title, description]) => (
    `<button type="button" data-need="${value}"><span>${title}</span><small>${description}</small><i>✓</i></button>`
  )).join("");

  const state = {
    stage: "decision",
    need: "",
    location: "",
    action: "",
    duration: "",
    channel: "",
    slot: ""
  };
  const stages = [...document.querySelectorAll("[data-stage]")];
  const back = document.querySelector("[data-flow-back]");
  const stepLabel = document.querySelector("[data-step-label]");
  const track = [...document.querySelectorAll(".step-track i")];
  const stageOrder = ["decision", "needs", "action", "schedule", "summary"];
  const history = [];
  const labels = {
    decision: "Decyzja",
    needs: "Potrzeba",
    action: "Działanie",
    schedule: "Termin",
    summary: "Potwierdzenie",
    browse: "Bez kontaktu",
    no: "Proces zakończony",
    success: "Potwierdzone",
    cancelled: "Anulowane"
  };

  function showStage(name, remember = true) {
    if (remember && state.stage !== name) history.push(state.stage);
    state.stage = name;
    stages.forEach(stage => {
      const active = stage.dataset.stage === name;
      stage.hidden = !active;
      stage.classList.toggle("active", active);
    });
    const index = stageOrder.indexOf(name);
    track.forEach((item, itemIndex) => {
      item.classList.toggle("done", index >= 0 && itemIndex < index);
      item.classList.toggle("active", index >= 0 && itemIndex === index);
    });
    stepLabel.textContent = labels[name] || "SIGNAL";
    back.hidden = history.length === 0 || ["no", "success", "cancelled"].includes(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  back.addEventListener("click", () => {
    const previous = history.pop();
    if (previous) showStage(previous, false);
  });

  document.querySelectorAll("[data-intent]").forEach(button => {
    button.addEventListener("click", () => {
      const intent = button.dataset.intent;
      if (intent === "yes") showStage("needs");
      if (intent === "browse") showStage("browse");
      if (intent === "no") showStage("no");
    });
  });

  const locationInput = document.getElementById("serviceLocation");
  const needsNext = document.querySelector("[data-to-action]");
  const updateNeedsButton = () => {
    needsNext.disabled = !(state.need && locationInput.value.trim().length >= 2);
  };

  document.querySelectorAll("[data-need]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-need]").forEach(option => option.classList.toggle("selected", option === button));
      state.need = button.dataset.need;
      updateNeedsButton();
    });
  });
  locationInput.addEventListener("input", updateNeedsButton);
  needsNext.addEventListener("click", () => {
    const value = locationInput.value.trim();
    const error = document.querySelector("[data-needs-error]");
    if (!state.need || value.length < 2) {
      error.textContent = "Wybierz potrzebę i wpisz kod pocztowy lub miejscowość.";
      return;
    }
    error.textContent = "";
    state.location = value;
    showStage("action");
  });

  const actionNext = document.querySelector("[data-to-schedule]");
  document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-action]").forEach(option => option.classList.toggle("selected", option === button));
      state.action = button.dataset.action;
      state.duration = button.dataset.duration;
      actionNext.disabled = false;
    });
  });

  actionNext.addEventListener("click", () => {
    if (!state.action) return;
    state.channel = "";
    state.slot = "";
    document.querySelectorAll("[data-channel], [data-slot]").forEach(option => option.classList.remove("selected"));
    const visit = state.action === "Wizyta doradcy";
    document.querySelectorAll("[data-channel]").forEach(option => {
      const onSite = option.dataset.channel === "Wizyta na miejscu";
      option.hidden = visit ? !onSite : onSite;
    });
    updateScheduleButton();
    showStage("schedule");
  });

  document.querySelectorAll("[data-channel]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-channel]").forEach(option => option.classList.toggle("selected", option === button));
      state.channel = button.dataset.channel;
      updateScheduleButton();
    });
  });

  document.querySelectorAll("[data-slot]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-slot]").forEach(option => option.classList.toggle("selected", option === button));
      state.slot = button.dataset.slot;
      updateScheduleButton();
    });
  });

  function updateScheduleButton() {
    document.querySelector("[data-to-summary]").disabled = !(state.channel && state.slot);
  }

  const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
  })[character]);

  function summaryMarkup() {
    return [
      ["Firma i oferta", `${offer.company} · ${offer.shortTitle}`],
      ["Potrzeba", state.need],
      ["Miejsce", state.location],
      ["Następny krok", `${state.action} · ${state.duration}`],
      ["Kanał i termin", `${state.channel} · ${state.slot}`],
      ["Znany koszt", offer.cost]
    ].map(([label, value]) => `<div class="confirmation-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  }

  document.querySelector("[data-to-summary]").addEventListener("click", () => {
    if (!(state.channel && state.slot)) return;
    document.querySelector("[data-summary]").innerHTML = summaryMarkup();
    document.querySelector("[data-otp-panel]").hidden = true;
    document.querySelector("[data-form-error]").textContent = "";
    showStage("summary");
  });

  const digits = value => value.replace(/\D/g, "");
  document.querySelector("[data-send-code]").addEventListener("click", () => {
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const consent = document.getElementById("singleConsent").checked;
    const error = document.querySelector("[data-form-error]");
    error.textContent = "";
    if (name.length < 2) return void (error.textContent = "Podaj imię.");
    if (digits(phone).length !== 9) return void (error.textContent = "Podaj dziewięciocyfrowy numer telefonu.");
    if (!consent) return void (error.textContent = "Potwierdź zgodę dotyczącą wyłącznie tej firmy i ustalonego działania.");
    const otpPanel = document.querySelector("[data-otp-panel]");
    otpPanel.hidden = false;
    otpPanel.querySelector("input").focus();
  });

  document.querySelector("[data-confirm]").addEventListener("click", () => {
    const input = document.querySelector("[data-otp-input]");
    const error = document.querySelector("[data-form-error]");
    if (input.value.trim() !== "4821") {
      error.textContent = "Nieprawidłowy kod. W demonstracji użyj 4821.";
      return;
    }
    const name = document.getElementById("customerName").value.trim();
    document.querySelector("[data-success-copy]").textContent = `${name}, ${offer.company} może skontaktować się w sprawie „${state.need}” przez ${state.channel.toLowerCase()}, w terminie ${state.slot.toLowerCase()}.`;
    document.querySelector("[data-receipt]").innerHTML = [
      ["Potrzeba", state.need],
      ["Miejsce", state.location],
      ["Działanie", state.action],
      ["Termin", state.slot],
      ["Rekord", existingLeadMode ? "Istniejący lead uzupełniony" : "Utworzony przez SIGNAL"],
      ["Źródło", source],
      ["Kampania", campaign],
      ["Wejście", entryLabel],
      ["Miejsce publikacji", placement],
      ["Status", "Potwierdzone kodem"]
    ].map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
    setText("[data-pass-id]", `SG-${String(Date.now()).slice(-6)}`);
    history.length = 0;
    showStage("success", false);
  });

  document.querySelector("[data-change-mind]").addEventListener("click", () => {
    history.length = 0;
    showStage("needs", false);
  });

  document.querySelector("[data-cancel-action]").addEventListener("click", () => {
    history.length = 0;
    showStage("cancelled", false);
  });

  function resetFlow() {
    Object.assign(state, { need: "", location: "", action: "", duration: "", channel: "", slot: "" });
    history.length = 0;
    document.querySelectorAll("[data-need], [data-action], [data-channel], [data-slot]").forEach(option => option.classList.remove("selected"));
    locationInput.value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("singleConsent").checked = false;
    document.querySelector("[data-otp-input]").value = "";
    needsNext.disabled = true;
    actionNext.disabled = true;
    updateScheduleButton();
    showStage("decision", false);
  }

  document.querySelectorAll("[data-restart]").forEach(button => button.addEventListener("click", resetFlow));
})();
