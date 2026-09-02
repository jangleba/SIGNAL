(() => {
  const sidebar = document.querySelector("[data-dashboard-sidebar]");
  const openSidebar = document.querySelector("[data-sidebar-open]");
  const closeSidebar = document.querySelector("[data-sidebar-close]");
  if (openSidebar && sidebar) openSidebar.addEventListener("click", () => sidebar.classList.add("open"));
  if (closeSidebar && sidebar) closeSidebar.addEventListener("click", () => sidebar.classList.remove("open"));
  if (sidebar) sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    if (window.innerWidth <= 900) sidebar.classList.remove("open");
  }));
})();
