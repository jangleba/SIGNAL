(() => {
  const state = { panel: "1", intent: null, action: null, duration: null, channel: null, slot: null };
  const panels = [...document.querySelectorAll("[data-panel]")];
  const progress = [...document.querySelectorAll(".progress span")];
  const label = document.getElementById("stepLabel");
  const toast = document.getElementById("toast");

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function show(panel) {
    state.panel = String(panel);
    panels.forEach(item => { item.hidden = item.dataset.panel !== state.panel; });
    const numeric = Number(panel);
    const isNumeric = Number.isFinite(numeric);
    progress.forEach((item, index) => {
      item.classList.toggle("done", isNumeric && index + 1 < numeric);
      item.classList.toggle("active", isNumeric && index + 1 === numeric);
    });
    label.textContent = isNumeric ? `Krok ${numeric} z 4` : (panel === "success" ? "Zgłoszenie potwierdzone" : "Proces zakończony");
    document.querySelector(".flow-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearFrom(step) {
    if (step <= 2) {
      state.action = null;
      state.duration = null;
      document.querySelectorAll("[data-action]").forEach(button => button.classList.remove("selected"));
      document.getElementById("nextAction").disabled = true;
    }
    if (step <= 3) {
      state.channel = null;
      state.slot = null;
      document.querySelectorAll("[data-channel], [data-slot]").forEach(button => button.classList.remove("selected"));
      document.getElementById("nextTime").disabled = true;
    }
  }

  function restart() {
    state.intent = null;
    clearFrom(2);
    document.getElementById("consent").checked = false;
    document.getElementById("otp").value = "";
    document.getElementById("otpBox").hidden = true;
    document.getElementById("error").textContent = "";
    show(1);
  }

  document.querySelectorAll("[data-intent]").forEach(button => button.addEventListener("click", () => {
    state.intent = button.dataset.intent;
    if (state.intent === "yes") { clearFrom(2); show(2); return; }
    if (state.intent === "browse") { show("browse"); return; }
    show("no");
  }));

  document.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-action]").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    state.action = button.dataset.action;
    state.duration = button.dataset.duration;
    document.getElementById("nextAction").disabled = false;
  }));

  document.getElementById("nextAction").addEventListener("click", () => {
    if (!state.action) return;
    const visit = state.action.includes("Wizyta");
    document.querySelectorAll("[data-channel]").forEach(button => {
      const allowed = visit ? button.dataset.channel === "Wizyta na miejscu" : button.dataset.channel !== "Wizyta na miejscu";
      button.hidden = !allowed;
      button.classList.remove("selected");
    });
    state.channel = null;
    state.slot = null;
    document.querySelectorAll("[data-slot]").forEach(button => button.classList.remove("selected"));
    document.getElementById("nextTime").disabled = true;
    show(3);
  });

  document.querySelectorAll("[data-channel]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-channel]").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    state.channel = button.dataset.channel;
    document.getElementById("nextTime").disabled = !(state.channel && state.slot);
  }));

  document.querySelectorAll("[data-slot]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-slot]").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    state.slot = button.dataset.slot;
    document.getElementById("nextTime").disabled = !(state.channel && state.slot);
  }));

  function renderSummary() {
    document.getElementById("summary").innerHTML = `
      <div class="summary-row"><span>Firma</span><strong>TermoPilot</strong></div>
      <div class="summary-row"><span>Cel</span><strong>${state.action} (${state.duration})</strong></div>
      <div class="summary-row"><span>Termin i kanał</span><strong>${state.slot}, ${state.channel}</strong></div>
      <div class="summary-row"><span>Znany koszt</span><strong>45–75 tys. zł brutto przed dotacją</strong></div>`;
  }

  document.getElementById("nextTime").addEventListener("click", () => {
    if (!(state.channel && state.slot)) return;
    renderSummary();
    document.getElementById("otpBox").hidden = true;
    document.getElementById("error").textContent = "";
    show(4);
  });

  document.querySelectorAll("[data-back]").forEach(button => button.addEventListener("click", () => show(button.dataset.back)));
  document.querySelectorAll("[data-restart]").forEach(button => button.addEventListener("click", restart));
  document.getElementById("browseContinue").addEventListener("click", () => { state.intent = "yes"; clearFrom(2); show(2); });
  document.getElementById("finishBrowse").addEventListener("click", () => show("browseDone"));
  document.getElementById("cancel").addEventListener("click", () => show("cancelled"));

  const digits = value => value.replace(/\D/g, "");
  document.getElementById("sendCode").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const postcode = document.getElementById("postcode").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const consent = document.getElementById("consent").checked;
    const error = document.getElementById("error");
    error.textContent = "";
    if (!name) { error.textContent = "Podaj imię."; return; }
    if (!/^\d{2}-\d{3}$/.test(postcode)) { error.textContent = "Podaj kod pocztowy w formacie 00-000."; return; }
    if (digits(phone).length !== 9) { error.textContent = "Podaj 9-cyfrowy numer telefonu."; return; }
    if (!consent) { error.textContent = "Potwierdź zgodę dotyczącą tej firmy i działania."; return; }
    document.getElementById("otpBox").hidden = false;
    document.getElementById("otp").focus();
    notify("Kod demonstracyjny: 4821");
  });

  document.getElementById("confirm").addEventListener("click", () => {
    const error = document.getElementById("error");
    if (document.getElementById("otp").value.trim() !== "4821") { error.textContent = "Nieprawidłowy kod. W demo wpisz 4821."; return; }
    const name = document.getElementById("name").value.trim();
    document.getElementById("successText").textContent = `${name}, TermoPilot otrzyma cel „${state.action}”, termin ${state.slot}, kanał ${state.channel} i zweryfikowany numer. Żadna inna firma nie dostanie tych danych.`;
    show("success");
  });
})();
