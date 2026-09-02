# SIGNAL V7 — zacznij tutaj

Ta wersja pokazuje właściwy model produktu:

1. Firma nadal emituje reklamę na Instagramie, Facebooku, TikToku albo w Google.
2. Przycisk reklamy prowadzi do lekkiego ekranu `oferta.html` otwieranego wewnątrz przeglądarki danej aplikacji.
3. Klient nie pobiera SIGNAL i nie zakłada konta.
4. Dopiero po wyborze potrzeby, działania, terminu i potwierdzeniu numeru powstaje imienna sprawa.
5. Sprawa pojawia się w `panel.html` razem ze źródłem oraz nazwą kampanii.

## Test

Otwórz:

`oferta.html?offer=termomodernizacja&source=instagram&campaign=test-instagram&placement=rolka&entry=link`

Kod demonstracyjny: **4821**.

Po potwierdzeniu przejdź do `panel.html`. Demo działa w obrębie tej samej przeglądarki dzięki `localStorage`.

## Aplikacja firmy

`manifest.webmanifest` i `sw.js` pozwalają dodać SIGNAL Business do ekranu głównego jako aplikację PWA. Nie oznacza to jeszcze publikacji w App Store lub Google Play.
