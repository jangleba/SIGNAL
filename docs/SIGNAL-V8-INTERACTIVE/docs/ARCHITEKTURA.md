# SIGNAL — plan połączenia prawdziwych leadów

## 1. Dwa sposoby wejścia

### Bezpośrednio przez SIGNAL Smart Entry

Każda kampania ma link i QR prowadzące do konkretnej oferty SIGNAL. Parametr `entry=link|qr` rozdziela format wejścia, a `source` nadal oznacza platformę, np. Instagram. Samo otwarcie tworzy najwyżej anonimową sesję. Dane klienta powstają dopiero po pełnym wyborze i kodzie.

### Istniejący lead firmy

Meta Lead Ads, formularz WWW albo CRM wysyłają rekord do bezpiecznego endpointu. SIGNAL zapisuje go jako `awaiting_decision`, blokuje kontakt handlowy i generuje jeden neutralny link do ustalenia szczegółów.

## 2. Jeden rekord, nie dwa

Podstawowy klucz deduplikacji:

1. `workspace_id + source + external_lead_id`,
2. gdy źródło nie ma identyfikatora: `workspace_id + normalized_phone + offer_id` w ustalonym oknie czasu.

Po kodzie zmieniają się pola tego samego rekordu. Rekord nie jest kopiowany do osobnej tabeli „leady premium”.

## 3. Minimalne stany

- `awaiting_decision` — lead wpłynął, brak prawa do telefonu,
- `confirmed` — klient potwierdził działanie i termin,
- `declined` — klient wybrał „Nie”,
- `browse_only` — klient wybrał „Tylko sprawdzam”,
- `cancelled` — wcześniejsze potwierdzenie anulowane,
- `expired` — brak odpowiedzi, bez kolejnych wiadomości,
- `completed` — ustalone działanie zostało obsłużone.

## 4. Pola rekordu

Źródło firmy:

- `workspace_id`, `external_lead_id`, `source`, `campaign`, `placement`, `entry`, `ad_id`,
- `offer_id`, `name`, `phone`, `email`, `created_at`.

Uzupełnia SIGNAL:

- `need`, `service_location`, `next_action`, `channel`,
- `scheduled_at`, `consent_text`, `confirmed_at`, `phone_verified_at`,
- `status`, `status_history`, `cancelled_at`.

## 5. Reguły komunikacji

- Jedna wiadomość z linkiem po wpłynięciu istniejącego leada.
- Brak sekwencji ponagleń.
- Brak kontaktu handlowego w stanie `awaiting_decision`.
- „Nie” i „Tylko sprawdzam” zatrzymują dalszą komunikację.
- Każda zmiana statusu ma czas, źródło i historię.

## 6. Synchronizacja z CRM

Po zmianie statusu SIGNAL wysyła webhook zawierający `external_lead_id`. CRM wykonuje aktualizację istniejącego kontaktu (`upsert`), nigdy bezwarunkowe tworzenie nowego.

Najważniejszy webhook:

`confirmation.completed` → potrzeba, miejsce, działanie, kanał, data, godzina, treść zgody i dowód kodu.

## 7. Czego nie zrobi GitHub Pages

Do prawdziwego działania potrzebne są: backend, baza danych, bezpieczne webhooki, uwierzytelnienie firm, kontrola dostępu, szyfrowanie danych i dostawca wiadomości SMS lub e-mail. GitHub Pages pozostaje bezpłatnym prototypem interfejsu.

## 8. Zdarzenia Smart Entry w prawdziwej wersji

- `entry.opened` — anonimowe otwarcie linku albo QR; bez danych kontaktowych,
- `intent.selected` — wybór klienta zapisany tylko w sesji,
- `confirmation.completed` — dopiero to zdarzenie tworzy lub odblokowuje kartę dla firmy,
- `confirmation.cancelled` — blokuje dalszy kontakt.

Panel raportuje osobno `source`, `placement` i `entry`, dzięki czemu „Instagram + QR w rolce” nie jest mylony z „Instagram + link w reklamie”.
