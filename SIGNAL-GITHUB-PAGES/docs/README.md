# SIGNAL — prototyp rozdzielony na dwa produkty

Repozytorium zawiera dwie niezależne strony:

- `index.html` — główny SIGNAL dla klienta: wyjaśnienie usługi, zasady prywatności i klikalna ścieżka przykładowej oferty.
- `dla-firm.html` — SIGNAL dla Firm: osobny produkt biznesowy z integracją, panelem zgłoszeń i modelem pilotażu.

Wspólne pliki:

- `styles.css` — identyfikacja wizualna i układ responsywny.
- `consumer.js` — interakcje strony klienta.
- `business.js` — interakcje panelu firmy.

## Publikacja przez GitHub Pages

1. Utwórz publiczne repozytorium na GitHubie.
2. Dodaj wszystkie pięć plików do głównego katalogu repozytorium.
3. Otwórz `Settings` → `Pages`.
4. W `Build and deployment` wybierz `Deploy from a branch`.
5. Wybierz gałąź `main`, katalog `/(root)` i zapisz.

Strona klienta otworzy się pod głównym adresem. Widok firmy będzie dostępny pod `/dla-firm.html`.

## Ważne ograniczenia prototypu

- Kod SMS `4821` jest symulacją działającą wyłącznie w przeglądarce.
- Dane nie są zapisywane ani przesyłane.
- Nie ma prawdziwego kalendarza, CRM-u, logowania ani backendu.
- Treść zgód wymaga weryfikacji prawnej przed wdrożeniem.
- `SIGNAL` pozostaje nazwą roboczą do czasu sprawdzenia dostępności prawnej.
