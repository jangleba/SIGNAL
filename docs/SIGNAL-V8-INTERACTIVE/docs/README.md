# SIGNAL — wersja 6: działający demonstrator obiegu

Statyczny, interaktywny prototyp systemu świadomego potwierdzania kontaktu, przygotowany do bezpłatnej publikacji przez GitHub Pages.

## Właściwy model produktu

- **SIGNAL Business** (`index.html`) — główny produkt, strona i środowisko firmy.
- **SIGNAL Confirm** (`oferta.html?...`) — jednorazowa ścieżka klienta otwierana z reklamy, linku lub QR. To nie jest aplikacja do pobierania ani katalog usług.
- **Panel firmy** (`panel.html`) — wspólna skrzynka spraw.

## Co naprawdę działa w tej wersji

1. Generator tworzy i zapisuje kampanię, link oraz QR.
2. Link otwiera ofertę z prawidłowym źródłem, kampanią i formatem wejścia.
3. Klient wybiera potrzebę, miejsce, działanie, kanał i termin.
4. Kod demonstracyjny `4821` zapisuje kompletną sprawę.
5. Nowa sprawa pojawia się na górze panelu firmy.
6. Anulowanie zmienia status i ukrywa numer.
7. „Wyczyść moje testy” usuwa utworzone lokalnie kampanie i sprawy.

Zapis działa w `localStorage`, dlatego pełny pokaz trzeba przeprowadzić w tej samej przeglądarce. To świadome ograniczenie wersji GitHub Pages. Synchronizacja telefonu klienta z komputerem firmy wymaga backendu, bazy danych, logowania firm i prawdziwych kodów SMS.

## Najważniejsza zasada

SIGNAL nie nazywa każdego formularza gotową sprawą. Wspólna skrzynka rozróżnia:

- **lead oczekujący** — wpłynął z Meta, strony lub CRM, ale nie daje jeszcze prawa do telefonu,
- **potwierdzoną sprawę** — klient wskazał potrzebę, miejsce, następny krok, kanał oraz termin i potwierdził całość kodem,
- **odmowę lub anulowanie** — status „nie kontaktować”, bez dalszych wiadomości.

Każda kampania tworzy dwa internetowe wejścia do tej samej oferty:

- **link** — do przycisku reklamy, bio, wiadomości lub strony,
- **kod QR** — do filmu, rolki, grafiki, transmisji, prezentacji lub PDF-u oglądanego na drugim ekranie.

Kliknięcie i skan tworzą tylko anonimowe otwarcie. Kontakt powstaje dopiero po pełnym wyborze, podsumowaniu i kodzie potwierdzającym.

Ten sam `external_lead_id` jest aktualizowany po potwierdzeniu. Nie powstaje drugi kontakt.

## Widoki

- `index.html` — publiczna strona klienta,
- `oferta.html` — kompaktowa, trzyetapowa ścieżka otwierana bezpośrednio po kliknięciu reklamy,
- `dla-firm.html` — oddzielna prezentacja biznesowa i przykłady branż,
- `login.html` — demonstracyjny ekran dostępu dla firmy,
- `panel.html` — wspólna skrzynka leadów i potwierdzonych spraw,
- `kampanie.html` — generator linku, działającego QR i gotowej grafiki PNG,
- `integracje.html` — docelowy model połączenia Meta Lead Ads, formularza WWW i CRM,
- `ARCHITEKTURA.md` — techniczny plan prawdziwej wersji systemu.

## Przykładowe adresy

Bezpośrednio przez SIGNAL:

`oferta.html?offer=termomodernizacja&source=instagram&campaign=jesien-bez-rachunkow&placement=rolka&entry=qr`

Uzupełnienie istniejącego leada:

`oferta.html?offer=pompa-ciepla&source=facebook&campaign=wymien-stary-piec&mode=confirm&lead=SG-DEMO-479`

## Ważne ograniczenie demonstracji

GitHub Pages obsługuje wyłącznie statyczny interfejs. Ta wersja nie zapisuje danych, nie odbiera webhooków, nie wysyła SMS-ów i nie łączy się z Meta ani CRM. Wszystkie osoby, firmy, wyniki oraz warunki są fikcyjne.

Generator QR ładuje bibliotekę QRCode.js 1.0.0 z CDN. Dlatego do pierwszego wygenerowania kodu potrzebne jest połączenie z internetem.
