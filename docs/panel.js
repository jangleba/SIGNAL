(() => {
  const sidebar = document.querySelector("[data-dashboard-sidebar]");
  const openSidebar = document.querySelector("[data-sidebar-open]");
  const closeSidebar = document.querySelector("[data-sidebar-close]");
  if (openSidebar && sidebar) openSidebar.addEventListener("click", () => sidebar.classList.add("open"));
  if (closeSidebar && sidebar) closeSidebar.addEventListener("click", () => sidebar.classList.remove("open"));
  if (sidebar) sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    if (window.innerWidth <= 900) sidebar.classList.remove("open");
  }));

  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const storedRecords = window.SignalStore ? window.SignalStore.getRecords() : [];
  const recordsBody = document.querySelector(".records-table tbody");
  [...storedRecords].reverse().forEach(record => {
    const row = document.createElement("tr");
    const initials = record.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toLocaleUpperCase("pl-PL") || "—";
    const sourceClass = ["instagram", "facebook", "tiktok", "www"].includes(record.sourceKey) ? record.sourceKey : "www";
    const statusType = ["new", "planned", "cancelled", "pending"].includes(record.status) ? record.status : "new";
    const statusLabel = record.statusLabel || (statusType === "cancelled" ? "Anulowane" : "Nowe");
    row.tabIndex = 0;
    row.dataset.record = record.id;
    row.dataset.recordStatus = statusType;
    row.dataset.recordOffer = record.offerKey || "termomodernizacja";
    row.dataset.recordSource = record.sourceKey || "www";
    row.dataset.recordEntry = record.entryKey || "link";
    row.dataset.recordSearchText = [record.name, record.location, record.need, record.source, record.campaign, record.entry].join(" ");
    row.className = "stored-record";
    row.innerHTML = `<td><div class="table-person"><span>${escapeHtml(initials)}</span><p><strong>${escapeHtml(record.name)}</strong><small>${escapeHtml(record.phone)}</small></p></div></td><td><strong>${escapeHtml(record.need)}</strong><small>oferta: ${escapeHtml(record.offer)}</small></td><td><strong>${escapeHtml(record.location)}</strong><small>miejsce wskazane przez klienta</small></td><td><strong>${escapeHtml(record.action)}</strong><small>${escapeHtml(record.channel)} · ${escapeHtml(record.duration)}</small></td><td><strong>${escapeHtml(record.time)}</strong><small>potwierdzone kodem</small></td><td><span class="source-badge ${sourceClass}">${escapeHtml(record.source)} · ${escapeHtml(record.entry)}</span><small>${escapeHtml(record.campaign)}</small></td><td><span class="table-status ${statusType}">${escapeHtml(statusLabel)}</span></td><td>→</td>`;
    recordsBody.insertBefore(row, recordsBody.firstChild);
  });

  const rows = [...document.querySelectorAll("[data-record]")];
  const search = document.querySelector("[data-record-search]");
  const offerFilter = document.querySelector("[data-offer-filter]");
  const sourceFilter = document.querySelector("[data-source-filter]");
  const entryFilter = document.querySelector("[data-entry-filter]");
  const statusFilter = document.querySelector("[data-status-filter]");
  const count = document.querySelector("[data-records-count]");
  const empty = document.querySelector("[data-empty-records]");
  const readyCount = document.querySelector("[data-ready-count]");
  if (readyCount) readyCount.textContent = String(128 + storedRecords.filter(record => record.status !== "cancelled").length);

  const normalize = value => String(value || "").toLocaleLowerCase("pl-PL").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const resultLabel = value => value === 1 ? "1 wynik" : (value >= 2 && value <= 4 ? `${value} wyniki` : `${value} wyników`);

  function filterRows() {
    const query = normalize(search.value.trim());
    let visible = 0;
    rows.forEach(row => {
      const matchesQuery = !query || normalize(row.dataset.recordSearchText).includes(query);
      const matchesOffer = offerFilter.value === "all" || row.dataset.recordOffer === offerFilter.value;
      const matchesSource = sourceFilter.value === "all" || row.dataset.recordSource === sourceFilter.value;
      const matchesEntry = entryFilter.value === "all" || row.dataset.recordEntry === entryFilter.value;
      const matchesStatus = statusFilter.value === "all" || row.dataset.recordStatus === statusFilter.value;
      const show = matchesQuery && matchesOffer && matchesSource && matchesEntry && matchesStatus;
      row.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = resultLabel(visible);
    empty.hidden = visible !== 0;
  }

  [search, offerFilter, sourceFilter, entryFilter, statusFilter].forEach(control => {
    control.addEventListener(control === search ? "input" : "change", filterRows);
  });
  document.querySelector("[data-clear-filters]").addEventListener("click", () => {
    search.value = "";
    offerFilter.value = "all";
    sourceFilter.value = "all";
    entryFilter.value = "all";
    statusFilter.value = "all";
    filterRows();
    search.focus();
  });

  const records = {
    karolina: {
      id: "#SG-LEAD-491", avatar: "KS", name: "Karolina S.", phone: "501 220 818 · dane z formularza firmy",
      status: "Czeka na decyzję", statusType: "pending", need: "Jeszcze niepotwierdzone", location: "Do ustalenia",
      action: "Nie kontaktować — oczekiwanie", time: "Brak wybranego terminu", channel: "Brak", duration: "Brak",
      offer: "Termomodernizacja domu", cost: "45–75 tys. zł brutto", condition: "Dotacja nie jest gwarantowana",
      source: "Instagram Lead Ads", entry: "Formularz / import", campaign: "Ciepły dom", origin: "Istniejący lead — formularz Meta",
      link: "oferta.html?offer=termomodernizacja&source=instagram&campaign=cieply-dom&mode=confirm&lead=SG-LEAD-491",
      consent: "Brak potwierdzenia. Samo wysłanie formularza reklamowego nie jest w SIGNAL zgodą na telefon w wybranym terminie.",
      proofNote: "Wysłano jeden neutralny link. Brak ponagleń i brak kontaktu handlowego do czasu decyzji.",
      eventOne: "Lead przyjęty z formularza Meta", eventTwo: "Jednorazowy link SIGNAL wysłany", eventThree: "Oczekiwanie na samodzielną decyzję",
      opened: "Dzisiaj, 18:28", selected: "Dzisiaj, 18:29", confirmed: "Bez terminu · bez ponagleń",
      primary: "Czekamy — nie kontaktować", secondary: "Zamknij bez kontaktu", primaryDisabled: true
    },
    lukasz: {
      id: "#SG-LEAD-488", avatar: "ŁB", name: "Łukasz B.", phone: "605 901 334 · dane z formularza firmy",
      status: "Czeka na decyzję", statusType: "pending", need: "Jeszcze niepotwierdzone", location: "Do ustalenia",
      action: "Nie kontaktować — oczekiwanie", time: "Brak wybranego terminu", channel: "Brak", duration: "Brak",
      offer: "Dobór i montaż pompy ciepła", cost: "28–45 tys. zł brutto", condition: "Dobór mocy po analizie budynku",
      source: "Facebook Lead Ads", entry: "Formularz / import", campaign: "Wymień ogrzewanie", origin: "Istniejący lead — formularz Meta",
      link: "oferta.html?offer=pompa-ciepla&source=facebook&campaign=wymien-ogrzewanie&mode=confirm&lead=SG-LEAD-488",
      consent: "Brak potwierdzenia. Klient nie wybrał jeszcze potrzeby, miejsca, działania ani terminu kontaktu.",
      proofNote: "Rekord czeka w tej samej skrzynce, ale jest zablokowany dla kontaktu handlowego.",
      eventOne: "Lead przyjęty z formularza Meta", eventTwo: "Jednorazowy link SIGNAL wysłany", eventThree: "Oczekiwanie na samodzielną decyzję",
      opened: "Dzisiaj, 17:51", selected: "Dzisiaj, 17:52", confirmed: "Bez terminu · bez ponagleń",
      primary: "Czekamy — nie kontaktować", secondary: "Zamknij bez kontaktu", primaryDisabled: true
    },
    anna: {
      id: "#SG-DEMO-482", avatar: "AK", name: "Anna K.", phone: "500 600 700 · numer zweryfikowany",
      status: "Potwierdzone", statusType: "confirmed", need: "Pełna termomodernizacja", location: "00-001 Warszawa",
      action: "Wstępna wycena", time: "Jutro, 17:30", channel: "Telefon", duration: "25 minut",
      offer: "Termomodernizacja domu", cost: "45–75 tys. zł brutto", condition: "Dotacja nie jest gwarantowana",
      source: "Instagram", entry: "Kod QR online", campaign: "Jesień bez rachunków", link: "oferta.html?offer=termomodernizacja&source=instagram&campaign=jesien-bez-rachunkow&placement=rolka&entry=qr",
      consent: "Chcę, aby wyłącznie TermoPilot skontaktował się ze mną w sprawie pełnej termomodernizacji i wstępnej wyceny, telefonicznie jutro o 17:30.",
      opened: "Dzisiaj, 18:42", selected: "Dzisiaj, 18:44", confirmed: "Dzisiaj, 18:45"
    },
    piotr: {
      id: "#SG-DEMO-479", avatar: "PN", name: "Piotr N.", phone: "510 220 440 · numer zweryfikowany",
      status: "Zaplanowane", statusType: "planned", need: "Wymiana obecnego ogrzewania", location: "05-500 Piaseczno",
      action: "Wizyta doradcy", time: "Czwartek, 12:00", channel: "Wizyta na miejscu", duration: "45 minut",
      offer: "Dobór i montaż pompy ciepła", cost: "28–45 tys. zł brutto", condition: "Dobór mocy po analizie budynku",
      source: "Facebook Lead Ads", entry: "Formularz → link SIGNAL", campaign: "Wymień stary piec", origin: "Istniejący lead → uzupełniony przez SIGNAL", link: "oferta.html?offer=pompa-ciepla&source=facebook&campaign=wymien-stary-piec&mode=confirm&lead=SG-DEMO-479&entry=link",
      consent: "Chcę, aby wyłącznie TermoPilot skontaktował się ze mną w sprawie wymiany ogrzewania i wizyty doradcy, na miejscu w czwartek o 12:00.",
      eventOne: "Lead przyjęty z formularza Facebook", eventTwo: "Klient uzupełnił potrzebę, miejsce i termin", eventThree: "Ten sam rekord potwierdzony kodem",
      opened: "Dzisiaj, 16:08", selected: "Dzisiaj, 16:11", confirmed: "Dzisiaj, 16:12"
    },
    marta: {
      id: "#SG-DEMO-473", avatar: "MW", name: "Marta W.", phone: "690 330 210 · numer zweryfikowany",
      status: "Zaplanowane", statusType: "planned", need: "Analiza opłacalności", location: "05-400 Otwock",
      action: "Krótka rozmowa", time: "Piątek, 09:30", channel: "Telefon", duration: "15 minut",
      offer: "Fotowoltaika dobrana do zużycia", cost: "18–35 tys. zł brutto", condition: "Moc instalacji po analizie zużycia",
      source: "Strona WWW", entry: "Link SIGNAL", campaign: "Kalkulator energii", link: "oferta.html?offer=fotowoltaika&source=www&campaign=kalkulator-energii&placement=strona&entry=link",
      consent: "Chcę, aby wyłącznie TermoPilot skontaktował się ze mną w sprawie analizy opłacalności fotowoltaiki, telefonicznie w piątek o 09:30.",
      opened: "Wczoraj, 20:21", selected: "Wczoraj, 20:23", confirmed: "Wczoraj, 20:24"
    },
    jakub: {
      id: "#SG-DEMO-471", avatar: "JZ", name: "Jakub Z.", phone: "602 114 820 · numer zweryfikowany",
      status: "Potwierdzone", statusType: "confirmed", need: "Najpierw ocena doradcy", location: "05-800 Pruszków",
      action: "Krótka rozmowa", time: "Jutro, 10:30", channel: "Wideorozmowa", duration: "15 minut",
      offer: "Termomodernizacja domu", cost: "45–75 tys. zł brutto", condition: "Dotacja nie jest gwarantowana",
      source: "TikTok", entry: "Kod QR online", campaign: "Dom 180 m²", link: "oferta.html?offer=termomodernizacja&source=tiktok&campaign=dom-180m2&placement=rolka&entry=qr",
      consent: "Chcę, aby wyłącznie TermoPilot skontaktował się ze mną w sprawie oceny termomodernizacji, przez wideorozmowę jutro o 10:30.",
      opened: "Wczoraj, 19:02", selected: "Wczoraj, 19:05", confirmed: "Wczoraj, 19:06"
    },
    elzbieta: {
      id: "#SG-DEMO-469", avatar: "ER", name: "Elżbieta R.", phone: "788 410 092 · numer zweryfikowany",
      status: "Zaplanowane", statusType: "planned", need: "Dobór mocy pompy", location: "05-120 Legionowo",
      action: "Wstępna wycena", time: "Sobota, 11:00", channel: "Telefon", duration: "25 minut",
      offer: "Dobór i montaż pompy ciepła", cost: "28–45 tys. zł brutto", condition: "Dobór mocy po analizie budynku",
      source: "Webinar", entry: "Kod QR online", campaign: "Ciepły dom LIVE", link: "oferta.html?offer=pompa-ciepla&source=www&campaign=cieply-dom-live&placement=transmisja&entry=qr",
      consent: "Chcę, aby wyłącznie TermoPilot skontaktował się ze mną w sprawie doboru mocy pompy i wstępnej wyceny, telefonicznie w sobotę o 11:00.",
      opened: "Wczoraj, 14:31", selected: "Wczoraj, 14:34", confirmed: "Wczoraj, 14:35"
    },
    tomasz: {
      id: "#SG-DEMO-468", avatar: "TK", name: "Tomasz K.", phone: "numer ukryty po anulowaniu",
      status: "Anulowane", statusType: "cancelled", need: "Fotowoltaika z magazynem", location: "05-825 Grodzisk Maz.",
      action: "Nie kontaktować", time: "Anulowano", channel: "—", duration: "—",
      offer: "Fotowoltaika dobrana do zużycia", cost: "18–35 tys. zł brutto", condition: "Moc instalacji po analizie zużycia",
      source: "Instagram", entry: "Link SIGNAL", campaign: "Magazyn energii", link: "oferta.html?offer=fotowoltaika&source=instagram&campaign=magazyn-energii&entry=link",
      consent: "Pierwotne potwierdzenie zostało anulowane przez klienta. Dalszy kontakt jest niedozwolony.",
      opened: "31 sierpnia, 12:11", selected: "31 sierpnia, 12:14", confirmed: "Anulowano 31 sierpnia, 12:28"
    }
  };

  storedRecords.forEach(record => {
    const initials = record.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toLocaleUpperCase("pl-PL") || "—";
    records[record.id] = {
      id: `#${record.id}`,
      avatar: initials,
      name: record.name,
      phone: record.status === "cancelled" ? "numer ukryty po anulowaniu" : `${record.phone} · numer potwierdzony w demo`,
      status: record.statusLabel || "Nowe",
      statusType: record.status || "new",
      need: record.need,
      location: record.location,
      action: record.action,
      time: record.time,
      channel: record.channel,
      duration: record.duration,
      offer: record.offer,
      cost: record.cost,
      condition: record.condition,
      source: record.source,
      entry: record.entry,
      campaign: record.campaign,
      origin: record.origin,
      link: `oferta.html?offer=${encodeURIComponent(record.offerKey || "termomodernizacja")}&source=${encodeURIComponent(record.sourceKey || "direct")}&campaign=${encodeURIComponent(record.campaign || "demo")}&entry=${encodeURIComponent(record.entryKey || "link")}`,
      consent: record.consent,
      proofNote: "Potwierdzone kodem demonstracyjnym. Rekord zapisano lokalnie w tej przeglądarce.",
      eventOne: `Oferta otwarta: ${record.source} · ${record.entry}`,
      eventTwo: "Klient wybrał potrzebę, miejsce, działanie i termin",
      eventThree: "Całość potwierdzona kodem",
      opened: record.opened,
      selected: record.selected,
      confirmed: record.confirmed
    };
  });

  const drawer = document.querySelector("[data-record-drawer]");
  const backdrop = document.querySelector("[data-drawer-backdrop]");
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  function openDrawer(key) {
    const record = records[key];
    if (!record) return;
    setText("[data-drawer-id]", record.id);
    setText("[data-drawer-avatar]", record.avatar);
    setText("[data-drawer-name]", record.name);
    setText("[data-drawer-phone]", record.phone);
    setText("[data-drawer-need]", record.need);
    setText("[data-drawer-location]", record.location);
    setText("[data-drawer-action]", record.action);
    setText("[data-drawer-time]", record.time);
    setText("[data-drawer-channel]", record.channel);
    setText("[data-drawer-duration]", record.duration);
    setText("[data-drawer-offer]", record.offer);
    setText("[data-drawer-cost]", record.cost);
    setText("[data-drawer-condition]", record.condition);
    setText("[data-drawer-source]", record.source);
    setText("[data-drawer-entry]", record.entry || "Link SIGNAL");
    setText("[data-drawer-campaign]", record.campaign);
    setText("[data-drawer-origin]", record.origin || "Bezpośrednio przez SIGNAL");
    setText("[data-drawer-link]", record.link);
    setText("[data-drawer-consent]", `„${record.consent}”`);
    setText("[data-drawer-proof-note]", record.proofNote || "Potwierdzone jednorazowym kodem na wskazanym numerze.");
    setText("[data-drawer-event-one]", record.eventOne || "Oferta otwarta z oznaczonego linku");
    setText("[data-drawer-event-two]", record.eventTwo || "Wybrano potrzebę, miejsce, działanie i termin");
    setText("[data-drawer-event-three]", record.eventThree || "Numer i całość potwierdzone kodem");
    setText("[data-drawer-opened]", record.opened);
    setText("[data-drawer-selected]", record.selected);
    setText("[data-drawer-confirmed]", record.confirmed);
    const status = document.querySelector("[data-drawer-status]");
    status.className = `status-pill ${record.statusType}`;
    status.innerHTML = `<i></i> ${record.status}`;
    const primary = document.querySelector("[data-drawer-primary]");
    const secondary = document.querySelector("[data-drawer-secondary]");
    primary.textContent = record.primary || "Oznacz jako obsłużone";
    primary.disabled = Boolean(record.primaryDisabled || record.statusType === "cancelled");
    secondary.textContent = record.secondary || (record.statusType === "cancelled" ? "Zamknij kartę" : "Zmień termin");
    backdrop.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.style.overflow = "";
  }

  rows.forEach(row => {
    row.addEventListener("click", () => openDrawer(row.dataset.record));
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDrawer(row.dataset.record);
      }
    });
  });
  document.querySelector("[data-drawer-close]").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });
  const resetButton = document.querySelector("[data-reset-demo]");
  if (resetButton) resetButton.addEventListener("click", () => {
    if (!window.SignalStore || !window.confirm("Usunąć tylko sprawy i kampanie utworzone podczas Twoich testów? Dane przykładowe pozostaną.")) return;
    window.SignalStore.reset();
    window.location.reload();
  });
})();
