(() => {
  const sidebar = document.querySelector("[data-dashboard-sidebar]");
  const openSidebar = document.querySelector("[data-sidebar-open]");
  const closeSidebar = document.querySelector("[data-sidebar-close]");
  if (openSidebar && sidebar) openSidebar.addEventListener("click", () => sidebar.classList.add("open"));
  if (closeSidebar && sidebar) closeSidebar.addEventListener("click", () => sidebar.classList.remove("open"));
  if (sidebar) sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    if (window.innerWidth <= 900) sidebar.classList.remove("open");
  }));

  const offer = document.querySelector("[data-campaign-offer]");
  const source = document.querySelector("[data-campaign-source]");
  const placement = document.querySelector("[data-campaign-placement]");
  const name = document.querySelector("[data-campaign-name]");
  const output = document.querySelector("[data-generated-link]");
  const previewLink = document.querySelector("[data-preview-link]");
  const previewQr = document.querySelector("[data-preview-qr]");
  const linkStatus = document.querySelector("[data-copy-status]");
  const qrStatus = document.querySelector("[data-qr-status]");
  const qrContainer = document.querySelector("[data-qr-code]");
  const qrSource = document.querySelector("[data-qr-source]");
  const qrCampaign = document.querySelector("[data-qr-campaign]");
  const saveStatus = document.querySelector("[data-save-status]");
  const saveButton = document.querySelector("[data-save-campaign]");
  const campaignBody = document.querySelector(".campaign-table tbody");
  let qrCode = null;

  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

  const labels = {
    source: { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", google: "Google", www: "Strona WWW", email: "E-mail", pdf: "PDF" },
    placement: { reklama: "Reklama", rolka: "Rolka / film", post: "Post / grafika", bio: "Link w bio", strona: "Przycisk na stronie", pdf: "PDF / oferta", transmisja: "Transmisja / webinar" }
  };

  const slugify = value => value.toLocaleLowerCase("pl-PL").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "").slice(0, 48) || "kampania";

  function makeUrl(entry) {
    const url = new URL("oferta.html", window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("company", "termopilot");
    url.searchParams.set("offer", offer.value);
    url.searchParams.set("source", source.value);
    url.searchParams.set("campaign", slugify(name.value));
    url.searchParams.set("placement", placement.value);
    url.searchParams.set("entry", entry);
    return url.href;
  }

  function renderQr(url) {
    if (typeof window.QRCode === "undefined") {
      qrContainer.innerHTML = "<span class=\"qr-load-error\">QR niedostępny</span>";
      qrStatus.textContent = "Biblioteka QR nie załadowała się. Sprawdź internet i odśwież stronę.";
      qrStatus.classList.add("error");
      return;
    }
    qrStatus.classList.remove("error");
    if (!qrCode) {
      qrCode = new window.QRCode(qrContainer, { text: url, width: 196, height: 196, colorDark: "#082f2d", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.H });
    } else {
      qrCode.clear();
      qrCode.makeCode(url);
    }
    qrStatus.textContent = "Kod jest gotowy i prowadzi do tej samej oferty przez wejście QR.";
  }

  function buildEntries() {
    const linkUrl = makeUrl("link");
    const qrUrl = makeUrl("qr");
    output.value = linkUrl;
    previewLink.href = linkUrl;
    previewQr.href = qrUrl;
    qrSource.textContent = `${labels.source[source.value]} · ${labels.placement[placement.value]}`;
    qrCampaign.textContent = name.value.trim() || "Kampania bez nazwy";
    linkStatus.textContent = "Link aktualizuje się automatycznie.";
    saveButton.disabled = false;
    saveButton.textContent = "Zapisz kampanię";
    saveStatus.textContent = "";
    renderQr(qrUrl);
  }

  async function copyLink(button) {
    try { await navigator.clipboard.writeText(output.value); }
    catch (error) { output.focus(); output.select(); document.execCommand("copy"); }
    linkStatus.textContent = "Skopiowano. Wklej adres do przycisku, bio, reklamy lub wiadomości.";
    const original = button.textContent;
    button.textContent = "Skopiowano ✓";
    window.setTimeout(() => { button.textContent = original; }, 1600);
  }

  function downloadQr() {
    const qrVisual = qrContainer.querySelector("canvas") || qrContainer.querySelector("img");
    if (!qrVisual) {
      qrStatus.textContent = "Kod nie jest jeszcze gotowy. Odśwież stronę i spróbuj ponownie.";
      qrStatus.classList.add("error");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1480;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f5f2e9"; ctx.fillRect(0, 0, 1200, 1480);
    ctx.fillStyle = "#082f2d"; ctx.fillRect(0, 0, 1200, 230);
    ctx.fillStyle = "#fff"; ctx.font = "700 72px Arial, sans-serif"; ctx.fillText("SIGNAL", 84, 142);
    ctx.fillStyle = "#83e6d3"; ctx.font = "600 28px Arial, sans-serif"; ctx.fillText("ŚWIADOMY KONTAKT Z FIRMĄ", 84, 190);
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#c8d8d3"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(90, 310, 1020, 930, 42); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#082f2d"; ctx.font = "700 46px Arial, sans-serif"; ctx.fillText("Zeskanuj i zdecyduj spokojnie", 150, 410);
    ctx.fillStyle = "#56716d"; ctx.font = "400 29px Arial, sans-serif"; ctx.fillText("Skan nie wysyła danych ani nie zamawia telefonu.", 150, 462);
    ctx.drawImage(qrVisual, 230, 535, 740, 740);
    ctx.fillStyle = "#082f2d"; ctx.font = "700 36px Arial, sans-serif"; ctx.fillText((name.value.trim() || "Kampania SIGNAL").slice(0, 42), 90, 1345);
    ctx.fillStyle = "#56716d"; ctx.font = "400 27px Arial, sans-serif"; ctx.fillText(`${labels.source[source.value]} · ${labels.placement[placement.value]}`, 90, 1395);
    ctx.fillText("Kontakt powstaje dopiero po pełnym potwierdzeniu.", 90, 1440);
    const link = document.createElement("a");
    link.download = `signal-${slugify(name.value)}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    qrStatus.textContent = "Pobrano gotową grafikę PNG do użycia w internecie.";
  }

  function addCampaignRow(campaign) {
    if (!campaignBody) return;
    const row = document.createElement("tr");
    const sourceClass = ["instagram", "facebook", "tiktok", "www"].includes(campaign.source) ? campaign.source : "www";
    row.className = "stored-campaign";
    row.innerHTML = `<td><strong>${escapeHtml(campaign.name)}</strong><small>utworzona w tym demo</small></td><td><strong>${escapeHtml(campaign.offerLabel)}</strong><small>oferta TermoPilot</small></td><td><span class="source-badge ${sourceClass}">${escapeHtml(labels.source[campaign.source])}</span></td><td><strong>0</strong></td><td><span class="entry-split">link + QR</span></td><td><strong>0</strong></td><td><span class="table-status planned">Aktywna</span></td>`;
    campaignBody.insertBefore(row, campaignBody.firstChild);
  }

  function saveCampaign() {
    if (!window.SignalStore) {
      saveStatus.textContent = "Nie udało się uruchomić zapisu w tej przeglądarce.";
      return;
    }
    const saved = window.SignalStore.saveCampaign({
      name: name.value.trim() || "Kampania bez nazwy",
      offer: offer.value,
      offerLabel: offer.options[offer.selectedIndex].text,
      source: source.value,
      placement: placement.value,
      linkUrl: makeUrl("link"),
      qrUrl: makeUrl("qr")
    });
    if (!saved) {
      saveStatus.textContent = "Przeglądarka zablokowała zapis. Link i QR nadal są gotowe do użycia.";
      return;
    }
    addCampaignRow(saved);
    saveStatus.textContent = "Kampania zapisana. Otwórz „Sprawdź ścieżkę klienta”, aby wykonać pełny test.";
    saveButton.textContent = "Zapisano ✓";
    saveButton.disabled = true;
  }

  [offer, source, placement].forEach(control => control.addEventListener("change", buildEntries));
  name.addEventListener("input", buildEntries);
  document.querySelectorAll("[data-copy-link]").forEach(button => button.addEventListener("click", () => copyLink(button)));
  document.querySelector("[data-download-qr]").addEventListener("click", downloadQr);
  saveButton.addEventListener("click", saveCampaign);
  if (window.SignalStore) [...window.SignalStore.getCampaigns()].reverse().forEach(addCampaignRow);
  buildEntries();
})();
