(() => {
  const roleButtons = [...document.querySelectorAll('[data-role]')];
  const scenes = [...document.querySelectorAll('[data-role-scene]')];
  roleButtons.forEach(button => button.addEventListener('click', () => {
    const role = button.dataset.role;
    roleButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    scenes.forEach(scene => {
      const active = scene.dataset.roleScene === role;
      scene.hidden = !active;
      scene.classList.toggle('active', active);
    });
  }));

  const feedback = document.querySelector('[data-mini-feedback]');
  document.querySelector('[data-demo-browse]').addEventListener('click', () => {
    feedback.classList.add('show');
    window.setTimeout(() => feedback.classList.remove('show'), 2200);
  });
  document.querySelector('[data-demo-choice]').addEventListener('click', () => {
    window.location.href = 'oferta.html?offer=termomodernizacja&source=instagram&campaign=demo-signal&placement=rolka&entry=link';
  });

  const sourceData = {
    all: { spend:'8 420 zł', confirmed:'128', cost:'65,78 zł / wynik', sales:'19', conversion:'14,8% potwierdzeń', label:'Wszystkie źródła', bars:[34,52,44,68,57,82,76,94] },
    instagram: { spend:'3 180 zł', confirmed:'52', cost:'61,15 zł / wynik', sales:'9', conversion:'17,3% potwierdzeń', label:'Instagram', bars:[28,42,37,61,54,72,69,91] },
    facebook: { spend:'2 760 zł', confirmed:'41', cost:'67,32 zł / wynik', sales:'6', conversion:'14,6% potwierdzeń', label:'Facebook', bars:[39,47,43,55,49,68,73,79] },
    google: { spend:'2 480 zł', confirmed:'35', cost:'70,86 zł / wynik', sales:'4', conversion:'11,4% potwierdzeń', label:'Google', bars:[22,31,28,43,51,46,58,66] }
  };
  document.querySelectorAll('[data-source-demo]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-source-demo]').forEach(item => item.classList.toggle('active', item === button));
    const data = sourceData[button.dataset.sourceDemo];
    document.querySelector('[data-demo-spend]').textContent = data.spend;
    document.querySelector('[data-demo-confirmed]').textContent = data.confirmed;
    document.querySelector('[data-demo-cost]').textContent = data.cost;
    document.querySelector('[data-demo-sales]').textContent = data.sales;
    document.querySelector('[data-demo-conversion]').textContent = data.conversion;
    document.querySelector('[data-chart-label]').textContent = data.label;
    document.querySelectorAll('[data-chart-bars] i').forEach((bar, index) => bar.style.setProperty('--h', `${data.bars[index]}%`));
  }));
})();
