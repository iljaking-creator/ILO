# Print-Design, Druckproduktion und Inspiration für einen Feinkost-Großhandelskatalog (Benchmark)

Abrufdatum aller Funde: 12.10.2026. Notizen auf Deutsch, Zitate im Original (Englisch/Deutsch).

**Wichtig vorab (Verlässlichkeit):** In dieser Recherche konnte keine einzige Zielseite direkt geöffnet werden (WebFetch: "getaddrinfo ENOTFOUND" für alle Hosts; Bash/curl über den Egress-Proxy: HTTP 403 "CONNECT tunnel failed", Organisationsrichtlinie). Alle Funde unten stammen aus den von WebSearch gelieferten Treffer-Zusammenfassungen (Titel, URL, Snippet-Text). Das heißt: (1) Preise sind undatierte Seiten-Snapshots, die ich nicht selbst im Browser gesehen habe; (2) bei Beispielen kenne ich nur Titel/Snippet, nicht den Seiteninhalt; (3) das WebSearch-Budget (200 Suchen pro Turn, geteilt mit anderen Agenten) war am Ende erschöpft, daher fehlen mehrere Themen (siehe Gaps).

---

## 0. Recherchebedingungen und Verlässlichkeit der Funde

### Takeaway
Die Faktenbasis ist für Druckspezifikationen und Seitenrahmen der Online-Druckereien brauchbar (mehrere unabhängige Treffer stimmen überein), für Preise nur als grobe, nicht verifizierte Orientierung, und für die Inspirationsliste nur als Kandidatenliste, die vor der Konzeption manuell gesichtet werden muss.

### Cited Findings
- Geprüfte, aber vom Egress-Proxy mit 403 abgelehnte Hosts (Organisationsrichtlinie): www.flyeralarm.com, www.wir-machen-druck.de, www.saxoprint.de, www.onlineprinters.de, www.print24.com, eci.org, www.eci.org, fogra.org, red-dot.org, www.german-design-award.com, www.behance.net, www.manufactum.de, www.dallmayr.com, www.rungisexpress.de, www.eataly.com, www.fortnumandmason.com, en.wikipedia.org, www.w3.org, www.tdc.org, adc.de, www.dribbble.com, issuu.com, practicaltypography.com — Beobachtung dieser Recherche (lokaler Proxy-Status, Stand 12.10.2026); Dokumentation des Proxys: /root/.ccr/README.md ("403 / 407 from the proxy: The destination host is not allowed by your organization's egress policy ... report the blocked host").

### Inferences
- Alles, was als "Preis" oder "Beispiel" genannt wird, ist als "im Suchtreffer-Snippet gesehen" zu lesen, nicht als "auf der Seite geprüft".

### Gaps
- Keine Primärseite (Preisrechner, Datenblatt, Awards-Datenbank, Behance-Projekt) wurde im Volltext gelesen.
- Nicht mehr recherchiert wegen erschöpftem Suchbudget: WCAG-/Kontrastwerte für Print, Siegel-/Icon-Systeme (Halal, Bio, vegan, TK, g.U.), Register/Daumenregister/Artikelnummernindex, Raster-/Spaltensysteme, Eigenmarken-Inszenierung, ADC/TDC/Best of Content Marketing, Issuu-Beispiele, Pinterest, FSC/PEFC/Blauer Engel, Veredelungsdetails, Lieferzeiten außer Saxoprint, Foodfotografie-Preise in Deutschland. Diese können in einem Folgelauf nachgeholt werden (Folgenachricht bzw. höheres CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION).

---

## (a) Gestaltungsregeln für datenlastige B2B-Produktkataloge

### Takeaway
Belastbar belegt sind nur Teilaspekte: Zebrastreifen helfen bei dichten Tabellen (mit Gegenstimme), Tabellenziffern (tabular figures) gehören in Preis-/Mengenspalten, 8 pt gilt in Druckerei-Ratgebern als Komfortgrenze für Lesetext, und Noto Sans/Fira Sans/Arimo decken Latein plus Griechisch ab. Zu Raster, Register, Siegeln, Eigenmarken-Inszenierung und Farbwirkung speziell für Feinkost fand ich keine belastbaren Quellen.

### Cited Findings

**Tabellen, Zebrastreifen, Ziffern**
- Zebrastreifen als leichtere Alternative zu Trennlinien in dichten Tabellen: "Zebra striping makes the separation of rows clear, but isn't as visually heavy or distracting as solid lines." Außerdem: "It's best to start with the first row in a lighter colour", weil eine dunklere erste Zeile mit einer Kopfzeile verwechselt werden kann — [Anthony Hobday, Zebra striped table rows](https://anthonyhobday.com/sideprojects/visualtechniques/techniques/background/zebra-striped-table-rows.html)
- Gegenstimme: In Tufte's Notebook berichtet ein Leser, Streifen erschwerten das Scannen, weil "the eye jumps to all the even (or odd) rows when scanning for information"; andere Leser fanden Streifen hilfreich; Verweis auf Tufte, Envisioning Information, Kap. 3 — [Edward Tufte, Zebra tables and lists](https://www.edwardtufte.com/notebook/zebra-tables-and-lists/)
- Tabellenziffern (tabular figures) vergeben jeder Ziffer die gleiche feste Breite, ohne die Form zu ändern (CSS: font-variant-numeric: tabular-nums) — [Dr. Web, CSS Ziffern](https://www.drweb.de/css-ziffern-font-variant-numeric/)
- Tabellenziffern sind für Tabellen in Geschäftsberichten, Preislisten, Rechnungen u. Ä. gedacht; proportionale Ziffern (z. B. "1" schmaler als "0") sind für Fließtext in Ordnung, verschieben aber Spalten; Mediävalziffern (old-style) passen in Fließtext — [TypeType, Numbers and numerals](https://typetype.org/de/blog/numbers-and-numerals-in-typography-basic-types/); [Fonts.com/MyFonts, Proportional vs. Tabular Figures](https://myfonts.com/pages/fontscom-learning-fontology-level-3-numbers-proportional-vs-tabular-figures) (Zuordnung einzelner Aussagen zu den beiden Quellen im Suchergebnis nicht eindeutig); weiterführend nicht gelesen: [Web Typography, Numerals and tables (PDF)](https://www.book.webtypography.net/Web-Typography_Numerals-and-tables.pdf)
- Butterick's Practical Typography hat einen eigenen Abschnitt "tables" im Kapitel Page layout; dessen Inhalt wurde nicht abgerufen — [Butterick's Practical Typography](https://practicaltypography.com/)

**Schriftgrößen, Lesbarkeit, Barrierefreiheit**
- Eine Druckerei nennt als Komfortgrenze für alles, was Kunden lesen müssen, 8 pt (10 pt bei älteren Lesern); 6 pt gilt als Kleingedrucktes, 7 pt braucht ungestrichenes Papier-Rücksicht; unter 8 pt reines Schwarz und Vektortext empfohlen — [4over4, Smallest font size you can print](https://v2.4over4.com/guide/what-is-the-smallest-font-size-you-can-print) (Zuordnung Snippet zu dieser URL vs. einer zweiten 4over4-Seite nicht eindeutig)
- Österreichischer Leitfaden für Menschen mit Sehbehinderung: mindestens 12 pt, Zeilenabstand mindestens 1,5, serifenlose Schrift bevorzugt — [Hilfsgemeinschaft, Leitfaden Druckwerke](https://www.hilfsgemeinschaft.at/fileadmin/Hilfsgemeinschaft/Aktuelles/Downloads/Leitfaden_Druckwerke.pdf) (Zielgruppe Sehbehinderung, strenger als für Katalogtabellen üblich)
- Praktiker-Regeln: nicht unter 6 pt außerhalb von Vollton, nicht unter 8 pt über Vollton — [Scoutbooks, Line weights and type weights](https://support.scoutbooks.com/article/20-line-weights-and-type-weights); 6–8 pt als praktische Untergrenze — [Designmonks, What is the smallest font](https://designmonks.substack.com/p/what-is-the-smallest-font-a-simple)
- Empfehlung, die Datei im Maßstab 100 % auszudrucken und so die Lesbarkeit zu testen — [4over4](https://v2.4over4.com/guide/what-is-the-smallest-font-size-you-can-print)

**Mehrsprachige Typografie (DE/TR/GR)**
- Noto Sans: ausgelegt für Latein, Kyrillisch, Griechisch; 3.741 Glyphen, 2.840 Zeichen in 30 Unicode-Blöcken, darunter Latin Extended-A/-B und Griechisch — [Fontsource, Noto Sans](https://fontsource.org/fonts/noto-sans/about)
- Fira Sans unterstützt Latein (inkl. Vietnamesisch), Griechisch, Kyrillisch — [Fonts In Use, Fira Sans](https://www.fontsinuse.com/typefaces/32113/fira-sans); Font Squirrel führt Fira Sans in der Liste der Schriften für Türkisch — [Font Squirrel, Turkish fonts](https://www.fontsquirrel.com/fonts/list/language/turkish/150)
- Die Google-Croscore-Familien Arimo, Cousine, Tinos decken laut Fedora-Wiki Basic Greek, Latin, Cyrillic und Turkish ab — [Fedora Wiki, Google Croscore support](https://fedoraproject.org/wiki/I18N/Google_Croscore_support)

**Farbe in der Lebensmittelkommunikation**
- Übersichtsarbeiten/Artikel (Zuordnung Snippet zu URL im Suchergebnis nicht eindeutig): warm gefärbte Verpackungen steigern eher die Kaufabsicht für genussorientierte Produkte, kühle Farben eher für gesündere Optionen; Spence et al. (2019): Grün und Blau werden oft mit Gesundheit und Frische assoziiert; Rot und Gelb können Appetit anregen und Aufmerksamkeit ziehen — [BJFT 2023, Impact of Color on Packaging](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1155445/1/BJFT-2023-ImpactOfColorPackaging.pdf); [HAW Hamburg, Repositorium (Elsevier-PDF)](https://reposit.haw-hamburg.de/bitstream/20.500.12738/17128/1/1-s2.0-S2666154325000614-main.pdf); [Frontiers in Psychology 2020](https://www.frontiersin.org/articles/10.3389/fpsyg.2020.589826/pdf)
- Vorsicht bei Effektgrößen: Piqueras-Fiszman & Spence (2014) fanden, dass "increasing solely the variety of colour in a food/meal does not always appear to alter the amount of food that is consumed" — [FoodNavigator, Eating the rainbow](https://foodnavigator.com/Article/2014/02/12/Eating-the-rainbow-The-effect-of-food-colour-on-consumption)
- Treffer, Inhalt nicht ausgewertet: [Colour Affects, How does colour affect the way we eat?](https://www.colour.org.uk/how-does-colour-affect-the-way-we-eat)
- Praxisbeispiel Qualitätsmarke: Manufactum aktualisierte sein Logo erstmals nach 28 Jahren; es erscheint seitdem durchgängig in einem tiefen Dunkelgrün (Agentur Heine Lenz Zizka) — [W&V, Manufactum überarbeitet das Logo](https://www.wuv.de/Archiv/Manufactum-überarbeitet-das-Logo)

**Produktfotografie, Kosten**
- Einzelner Preispunkt eines polnischen Studios (nicht Food-spezifisch, netto): Produktfoto ohne Retusche 10 EUR pro Foto; Mengenrabatt bei größeren Bestellungen möglich — [Marszal Studio, Preisliste](https://marszalstudio.pl/de/preisliste/)
- Kalkulationslogik: Bei E-Commerce-Serien fällt die Nachbearbeitung oft geringer aus, "weil du den gleichen Schnitt für alle Fotos verwenden kannst"; Preise pro Bild unterscheiden sich daher zwischen E-Commerce- und Werbefotografie — [Format, Leitfaden Preisgestaltung Werbefotografie](https://www.format.com/de/magazine/commercial-photography-pricing)
- Die Format-Seite zur Food-Fotografie nennt keine Zahlen — [Format, Food photography pricing](https://www.format.com/de/magazine/food-photography-pricing)

**Seitenaufbau, Katalogstruktur**
- Typische Bausteine laut einem Dribbble-Dienstleistungsangebot: Cover, Rücken, Rückseite, Doppelseiten pro Produkt, Kapitelauftakt — [Dribbble, Catalogue & Product Catalog Design](https://dribbble.com/services/244346-Catalogue-Product-Catalog-Design) (Freelancer-Angebot, schwache Quelle)
- Unterscheidung: Ein Katalog ist generalistisch und deckt das gesamte Sortiment ab, eine Broschüre ist gezielter und hat meist 8–24 Seiten — [Aura Print, Catalogue printing design guide](https://aura-print.com/uk/blog/post/catalogue-printing-design-guide)
- Datenpipeline: Aus einer Datenquelle und einem InDesign-Template lassen sich Katalogversionen je Markt/Kategorie/Kunde automatisch erzeugen (PDF oder Excel) — [Pagination, Katalog- und Preislistenautomatisierung](https://pagination.com/de/?p=1003241) (Anbieterseite)

### Inferences
- Für die 530-Artikel-Tabelle spricht die Quellenlage für: Zebra nur sehr hell, erste Datenzeile hell, Kopfzeile abgesetzt (Hobday); optional dünne Haarlinien statt Streifen testen (Tufte-Einwand); in Mengen-/Gebinde-/Preisspalten Tabellenziffern (Schriftart muss OpenType "tnum" bieten, vor Auswahl prüfen).
- Tabellentext unter 8 pt ist nach der Druckerei-Quelle grenzwertig; Testausdruck in 100 % bei A4 (und bei A5) ist die belegte Methode. Für ältere Leser in Gastronomie/Imbiss wären 10 pt für Fließ-/Hinweistexte die konservative Lesart.
- Noto Sans, Fira Sans und Arimo sind Kandidaten für DE/TR/GR; Türkisch-spezifische Zeichen (ı, İ, ğ, ş) und griechische Tonos-Zeichen sind in den Quellen nicht einzeln bestätigt und müssen im konkreten Font geprüft werden.
- Die Farbforschung betrifft Verpackung/Verzehr, nicht B2B-Kataloge: Grün (Frische/Gesundheit) und warme Töne (Genuss) lassen sich als Orientierung für das vorhandene Dunkelgrün/Orange nutzen, sind aber kein Beleg für Katalog-Wirkung.
- Rechenwert (sehr unsicher, nur Größenordnung): 530 Artikel x 10 EUR netto ≈ 5.300 EUR netto für einfache Freisteller ohne Atmosphäre/Styling, bezogen auf einen einzelnen Nicht-Food-Anbieter aus Polen.
- Die Datenquelle-plus-Template-Logik (Pagination) passt zur tabellarischen Datenbasis (Art.-Nr., Bezeichnung, Gebinde) und erlaubt Varianten (z. B. ohne Preise).

### Gaps
- Keine Quelle zu: Zeilenhöhe/-abstand in Katalogtabellen, Raster-/Spaltensystemen, Kapitelauftakt/Kopfzeilen/Seitenzahlen, Register/Daumenregister/Farbleitsystem, Artikelnummernindex und alphabetischem Register, Icon-/Siegelsystemen (Halal, Bio, vegan, TK, Kühlware, g.U.), Eigenmarken-Inszenierung (ADOLIVA, ADMIRA, WERMIO), Mischung Bild-/Datenseiten, Freisteller vs. Atmosphäre mit Kostenvergleich, Foodfotografie-Preisen in Deutschland.
- Kontrast/WCAG (z. B. 4,5:1) für Print: Suche wegen erschöpften Budgets nicht ausgeführt.
- Butterick-Tabellenregeln und Tufte-Originaltext: nicht abrufbar (Hosts blockiert).
- Keine Quelle zu Olivgrün/Orange speziell in mediterraner Feinkost-Kommunikation; keine Studie zu Katalogwirkung.
- Türkische/griechische Glyphenabdeckung (ı, İ, Tonos) nicht im Detail belegt.

---

## (b1) Druckproduktion Deutschland: Formate, Bindung, Seitenzahlen, Papier, Daten, Farbprofile, Verfahren

### Takeaway
Online-Druckereien bieten Klebebindung (PUR) zuverlässig ab etwa 40–64 Seiten bis mehrere hundert Seiten, Klammerheftung nur bis ca. 96–152 Seiten; Seiten werden in Vierer-Schritten geführt; der Bund verliert bei Klebebindung 5 mm sichtbare Fläche; Standard für Daten sind PDF/X-4, CMYK, 300 ppi, 3 mm Beschnitt. PSO Coated v3 (FOGRA51) ist der Nachfolger der FOGRA39-Welt; Details zu Gesamtfarbauftrag sind uneinheitlich belegt.

### Cited Findings

**Formate**
- WIRmachenDRUCK: Drahtheftung im Hochformat von DIN A8 bis DIN A3; Sonderformat 170 x 240 mm möglich — [WMD, Drahtheftung Hochformat](https://www.wir-machen-druck.de/broschueren-drahtheftung-hochformat-guenstig-drucken-lassen,category,22063.html); [WMD, Broschüren & Kataloge](https://www.wir-machen-druck.de/broschueren-softcover-klebebindung-din-a4-extrem-guenstig-drucken,category,10104.html)
- Onlineprinters Klebebindungs-Kataloge in DIN lang, Art-Size, DIN A4 (Hoch/Quer), DIN A4 halb, A4-Quadrat, DIN A5 (quer); DIN-A5-quer-Endformat 21 x 14,8 cm — [Onlineprinters, Kataloge](https://www.onlineprinters.de/k/kataloge); [Onlineprinters, DIN A5 quer](https://www.onlineprinters.de/p/kataloge-klebebindung-din-a5-querformat)

**Bindearten und Seitenrahmen (Angaben der Anbieter laut Suchtreffern)**
- WMD: Klebebindung (PUR) 48 bis 400 Seiten; Drahtheftung bis 152 Seiten (8 bis 152); Ringbindung 8 bis 400 Seiten — [WMD, Broschüren mit Klebebindung](https://www.wir-machen-druck.de/broschuere-klebebindung,category,10103.html); [WMD, Drahtheftung](https://www.wir-machen-druck.de/broschuere-drahtheftung,category,9434.html)
- Onlineprinters: Kataloge mit Klebebindung 64 bis max. 356 Seiten plus Umschlag; bei 90 g Bilderdruck oder 80 g Offset mindestens 64 Seiten, bei 250 g Bilderdruck 24 bis 356 Seiten; Auflage digital ab 1 Stück, im Offsetdruck ab 50 Stück — [Onlineprinters, Kataloge](https://www.onlineprinters.de/k/kataloge)
- Saxoprint: PUR-Klebebindung bis 400 Seiten, Auflagen 25 bis 200.000 Stück; Klammerheftung "4 bis 96 Seiten" bzw. "8 bis maximal 100 Seiten abzüglich Umschlag" (widersprüchliche Angaben auf Saxoprint-Seiten), eine Magazinseite nennt Beschränkung auf 32 Seiten — [Saxoprint, Klebebindung](https://www.saxoprint.de/werbebedarf/broschueren/klebebindung); [Saxoprint, Klammerheftung](https://www.saxoprint.de/werbebedarf/broschueren/klammerheftung); [Saxoprint, Magazine](https://www.saxoprint.de/werbebedarf/broschueren/magazine)
- Print24: PUR-Broschüren bis 500 Seiten, Kataloge bis 1.400 Seiten; Budget-Variante erst ab 40 Seiten, "Da zum Verkleben ein Rücken benötigt wird" — [Print24, Kataloge Klebebindung](https://print24.com/de/druckprodukte/kataloge-magazine/kataloge-magazine-klebebindung); [Print24, Budget Broschüren](https://print24.com/de/druckprodukte/broschueren/broschueren-budget)
- Flyeralarm: Klebebroschüren im Offsetdruck 1 bis 25.000 Stück, bis 804 Seiten; A4-Magazine mit Rückenheftung 8 bis 32 Seiten (135/170/300 g, Folie matt/glänzend oder Soft-Touch); geklammerte/gefalzte Broschüren bis 116 Seiten — [Flyeralarm, Broschüren Klebebindung](https://www.flyeralarm.com/de/p/broschueren-mit-klebebindung-551719); [Flyeralarm, Magazine Rückenheftung](https://www.flyeralarm.com/de/stores/magazin.html)
- Weitere Bindungen im Angebot: Spiralbindung (Saxoprint, Print24, WMD), Ringösen (WMD), Hardcover (Flyeralarm), Fadenheftung (Onlineprinters) — [Saxoprint, Spiralbindung](https://www.saxoprint.de/werbebedarf/broschueren/spiralbindung); [WMD, Ringösen](https://www.wir-machen-druck.de/extrem-guenstig-broschueren-mit-ringoesenheftung,category,13801.html); [Print24, Spiralbindung](https://print24.com/de/gastronomy/broschueren-spiralbindung)
- Aufpreise bei DIN lang quer (Onlineprinters, netto): PUR-Klebebindung 120,41 EUR, Fadenheftung 246,54 EUR, zweifache Lochung 22,00 EUR — [Onlineprinters, DIN lang quer](https://www.onlineprinters.de/p/kataloge-klebebindung-din-lang-querformat)
- PUR ist ein feuchtigkeitsvernetzender Klebstoff (volle Festigkeit nach ca. 72 Stunden) und gilt als haltbarer und flexibler als EVA-Hotmelt; geeignet für höhere Seitenzahlen — [Wolf (ukrainische Druckerei), PUR binding](https://wolf.ua/en/blog/purskreplenie-ekstraprochnye-knigi-i-zhurnaly/) (Nebenquelle, nicht DACH); Flyeralarm-Blog zum Thema (Inhalt nicht gelesen): [Flyeralarm, Klebebindung PUR](https://www.flyeralarm.com/blog/de/klebebindung-pur/)

**Seitenzahlen-Logik**
- Onlineprinters führt Seitenzahlen "in Schritten von 4" (Beispiel A5 quer: 328 bis 356 Seiten) — [Onlineprinters, DIN A5 quer](https://www.onlineprinters.de/p/kataloge-klebebindung-din-a5-querformat)
- WMD-Beispiel Drahtheftung: "32-seitig (16 Blätter)" — [WMD, Broschüre Drahtheftung A4 quer 32-seitig](https://www.wir-machen-druck.de/broschuere-mit-drahtheftung-endformat-din-a4-quer-32seitig.html)
- Saxoprint-Konfigurationen in 4er-Schritten sichtbar (8, 12, 16 Seiten) — [Saxoprint, Klammerheftung](https://www.saxoprint.de/werbebedarf/broschueren/klammerheftung)

**Papiergrammaturen**
- Uni-Jena-Papierleitfaden 2024: Innenteil 80–120 g (Klammer) bzw. 90–120 g (Klebebindung); Umschlag 160–250 g (Klebebindung und Klammer); 350–400 g für Ringbindung mit Rückwand — [Uni Jena, Papier-Guide 2024](https://uni-jena.de/unijenamedia/364100/papier-guide-2024-web.pdf) (Hochschul-Leitfaden, kein Druckerei-Datenblatt)
- Beispielkonfigurationen: WMD 90 g glänzend Innenteil und Umschlag, 4/4 — [WMD, A4 quer 32-seitig](https://www.wir-machen-druck.de/broschuere-mit-drahtheftung-endformat-din-a4-quer-32seitig.html); Saxoprint 130 g Bilderdruck — [Saxoprint, Klammerheftung](https://www.saxoprint.de/werbebedarf/broschueren/klammerheftung)
- Onlineprinters bietet eine Katalogvariante "aus zertifizierten Naturpapieren" (Öko-/Naturpapiere) — [Onlineprinters, Kataloge Naturpapiere A4 Hochformat](https://www.onlineprinters.de/p/kataloge-klebebindung-oeko-naturpapiere-hochformat-din-a4)

**Druckdaten (Datenblätter)**
- Flyeralarm-Datenblatt A4 Klebebindung (Stand 19.03.2025): "Durch die Klebebindung sind im Bund 5 mm Gestaltungsfläche nicht sichtbar"; Umschlag und Innenteil als getrennte Dateien; Rückenbreite abhängig von der Papierstärke; erste und letzte Innenseite werden mit dem Umschlag verklebt — [Flyeralarm, Datenblatt Magazin Klebebindung A4](https://www.flyeralarm.com/sheets/de/magazinkleb_a4_bgt_kl.pdf); Vorlagenvariante Hardcover (Stand 19.04.2023): CMYK, mindestens 300 ppi — [Flyeralarm, Datenblatt Hardcover A4 quer](https://www.flyeralarm.com/sheets/de/maghardcover_a4_quer_kl.pdf)
- WMD-Datenskizze PUR-Klebebindung: Bundstärke abhängig von der Seitenzahl, 3 mm Beschnitt, 3 mm Sicherheitsabstand — [WMD, PUR-Klebebindung Datenskizze DIN A8](https://www.wir-machen-druck.ch/tpl/manns-partner/media/ddb/druckdatenskizzen/category/14434/0/PUR-Klebebindung_DIN A8_2.pdf) (Schweizer Domain derselben Firma, Format A8, nur als Prinzip)
- Onlineprinters: Innenteil als PDF mit fortlaufenden Einzelseiten, Umschlag als Doppelseite inklusive Rückenbreite — [Onlineprinters, DIN A5 quer](https://www.onlineprinters.de/p/kataloge-klebebindung-din-a5-querformat)
- Allgemeine deutschsprachige Vorgaben mehrerer Anbieter: Beschnitt meist 3 mm (ein Anbieter 2 mm), wichtige Inhalte mindestens ca. 4 mm vom Rand (eine Quelle), 300 dpi für Drucksachen bis A3, Strichgrafik 1.200 dpi, PDF/X-4 (oder PDF/X-1a), Schriften eingebettet, korrekter Output-Intent — [druck.at, Infoblatt Druckdatenerstellung](https://cdn.druck.at/sites/default/files/Infoblatt_Druckdatenerstellung.pdf); [Reha Marketing, Dateivorgaben](https://www.reha-marketing.de/fileadmin/user_upload/Neu-Downloads/Dateivorgaben_rehagmbh.pdf) (Zuordnung einzelner Zahlen zu einzelnen Treffern nicht eindeutig)

**Farbprofile**
- FOGRA51 gehört laut Fogra zum Bogenoffset, 60er Raster, Papiertyp PS 1 (früher PT 1/2), Tonwertzunahmekurve A*; das zugehörige Profil heißt PSO Coated v3 — [Fogra, Characterisation data](https://fogra.org/en/downloads/work-tools/characterisation-data)
- Anlass der Daten: Umsetzung der ISO 12647-2:2013 durch ECI, bvdm und Fogra, wegen Papieren mit hohem Aufhelleranteil (OBA); Messbedingung M1 (UV-Anteil eingeschlossen); PSO Coated v3 gilt als Nachfolger von ISO Coated v2 — [Large Format Review](https://www.largeformatreview.com/?p=36619); [print.app, PSO Coated v3](https://print.app/resources/icc-profiles/pso-coated-v3)
- ICC-Registry führt PSOcoated_v3.icc mit Referenz FOGRA51 (fogra51.txt) — [ICC Profile Registry](https://registry.color.org/profile-registry/PSOcoated_v3); Widerspruch: Die Registry nennt Bogen- und Rollenoffset (Heatset), Fogra führt FOGRA51 nur als Bogenoffset — [Fogra](https://fogra.org/en/downloads/work-tools/characterisation-data)
- FOGRA39 ist "not a profile. It is a characterisation data set"; mehrere Profile basieren darauf (ISO Coated v2, Adobe Coated FOGRA39) — [print.app, Coated FOGRA39](https://print.app/resources/icc-profiles/coated-fogra39)
- Gesamtfarbauftrag: print.app nennt für PSO Coated v3 "Total ink limit 300%", für CoatedFOGRA39.icc 330 %; ein Adobe-Forum-Beitrag unterscheidet ISO Coated v2 (320 %) von ISO Coated v2 300 % (ECI) — [print.app, PSO Coated v3](https://print.app/resources/icc-profiles/pso-coated-v3); [Adobe Community, FOGRA27 vs. FOGRA39](https://community.adobe.com/questions-671/difference-frogra27-and-frogra39-place-from-ps-into-ind-871772) (Forum, nicht normativ)
- Praxisregel aus demselben Forumskontext: "always ask your printer what profile to use"; bei Angabe nur "FOGRA39" gilt ISO Coated v2 als sicherer Standard in Europa — [Adobe Community](https://community.adobe.com/t5/indesign-discussions/difference-frogra27-and-frogra39-place-from-ps-into-ind/td-p/12534186)
- ECI veröffentlichte 2020 ein Supplement "Surface Finishing" zum Profil — [ECI, Offset colour standards](https://eci.org/doku.php_id=en_colorstandards_offset.html)
- Weiterführend (nicht geöffnet): [ECI/Süßl, Arbeitsmittel ISO 12647-2:2013 (PDF, 2015)](https://eci.org/lib/exe/arbeitsmittel_iso_12647-2_2013_-_suessl_-_2015-10-01.pdf); [Intergraf, New Printing Conditions for ISO 12647-2](https://www.intergraf.eu/communications/latest-news/item/114-new-printing-conditions-for-iso-12647-2); [GMG unterstützt FOGRA51/52-Datensätze](https://www.packaging-gateway.com/contractors/data/coveris-dr-beckmann-recyclable-sleeve/pressreleases/latest-gmg-software-supports-new-fogra5152-datasets/)

**Digitaldruck vs. Offset**
- Keine feste Grenze belegt. Digital: "typically from a single copy up to a few hundred", kurze Lieferzeit, niedrige Rüstkosten; Offset: höhere Rüstkosten, Stückpreis sinkt deutlich mit der Auflage — [GelatoConnect, Digitaldruck Kleinauflage](https://www.gelato.com/de/connect/blog/digitaldruck-kleinauflage)
- Fachpresse: Der Punkt, ab dem Offset bei kleinen Auflagen wirtschaftlich ist, sei durch schnelleres Einrichten stark gesunken; Sammelformen teilen Kosten nur bei ausreichendem Auftragsvolumen — [druckmarkt, Digitaldruck immer und immer](https://www.druckmarkt.com/archiv/pdf/1819/digidruckimmerundimmer.pdf)
- Anbieterlogik: WMD druckt "je nach Auflage im Digital- oder Offsetdruck" — [WMD, Broschüren](https://www.wir-machen-druck.de/broschueren-softcover-klebebindung-din-a4-extrem-guenstig-drucken,category,10104.html); Onlineprinters: Digital ab 1, Offset ab 50 Stück — [Onlineprinters, Kataloge](https://www.onlineprinters.de/k/kataloge)

### Inferences
- Für 32–96 Seiten sind realistisch: Klammerheftung bis ca. 96 Seiten (bei hohen Seitenzahlen Rückenstärke/Aufklaffen prüfen) und PUR-Klebebindung ab ca. 40–64 Seiten (je nach Anbieter/Variante). 530 Artikel in Tabellenform legen eher PUR oder Wire-O/Spiral nahe (flachliegend, Daten nachschlagen); Wire-O ist in den Treffern nicht explizit belegt (nur Spiral-/Ringbindung).
- Klebebindung: 5 mm Bundverlust bei Tabellen und Spalten beachten (Spaltenabstand zum Bund, Innenrand bei Tabellen größer wählen).
- Mit Vierer-Schritten bei Anbietern sind 32/48/64/96 Seiten sauber; Vielfache von 8/16 (Falzbogen-Logik) sind in diesen Quellen nicht belegt, kein Pflichtkriterium der Online-Druckereien.
- Bei Auflagen 250–2.500 ist je nach Anbieter beides möglich; die Grenze lässt sich nur durch zwei Angebote (Digital/Offset) bei 500 und 1.000 Stück ermitteln.
- Profilwahl: für gestrichenes Papier PSO Coated v3 (FOGRA51) nur verwenden, wenn die Druckerei es ausdrücklich nennt; sonst Druckerei-Datenblatt entscheiden lassen.

### Gaps
- Nicht belegt: Quellen zu PSO Uncoated v3 (FOGRA52) im Detail, Gesamtfarbauftrag je Papiertyp aus der Primärquelle (ECI/Fogra), Auflösung für Farbflächen/Verläufe, PDF/X-4-Spezifikation selbst (nur Anbieterempfehlungen).
- FSC/PEFC/Blauer Engel: keine Quelle zu Zertifizierungen der Anbieter (nur der Hinweis auf "zertifizierte Naturpapiere" bei Onlineprinters).
- Veredelungen (Dispersionslack, UV-Lack, Prägung, Folienkaschierung bei Umschlägen): nur "Folie matt/glänzend, Soft-Touch" bei Flyeralarm-Magazinen, keine Preise.
- Wire-O explizit: nicht belegt; Ringbuch/Schraubbindung nur über Ring-/Spiralbindungsseiten der Anbieter.
- Kein Datenblatt der Primärquellen wurde komplett gelesen (nur Snippets).

---

## (b2) Beispielpreise, Lieferzeiten, Umgang mit Preisänderungen

### Takeaway
Die gewünschte Preismatrix (32/48/64/96 Seiten, A4/A5, 250/500/1.000/2.500) konnte nicht befüllt werden: Die Konfiguratoren liefern nur per Eingabe Preise, und die Suchtreffer enthalten nur vereinzelte, undatierte Snapshots, zum Teil nicht plausibel. Verwendbar sind lediglich einzelne Datenpunkte als grobe Größenordnung.

### Cited Findings

Preistabelle. Alle Werte aus Suchtreffer-Snippets (Abruf 12.10.2026), Seiten-Snapshots ohne Datum; keine Seite im Browser gesehen.

| Anbieter | Konfiguration (laut Snippet) | Preis | Netto/Brutto | Quelle | Belastbarkeit |
|---|---|---|---|---|---|
| Saxoprint | 500 Stück, Klammerheftung, DIN A4, 130 g Bilderdruck, 8 Seiten | 138,68 EUR | unklar | [Klammerheftung](https://www.saxoprint.de/werbebedarf/broschueren/klammerheftung) | mittel (Zuordnung URL nicht eindeutig) |
| Saxoprint | dito, 12 Seiten | 200,94 EUR | unklar | dito | mittel |
| Saxoprint | dito, 16 Seiten | 248,23 EUR | unklar | dito | mittel |
| WMD | Drahtheftung, DIN A4 quer, 32 Seiten (16 Blatt), 90 g glänzend Innenteil und Umschlag, 4/4, ab 500 Stück | 1,860 EUR pro Stück (mit Sternchen) | unklar | [WMD, A4 quer 32-seitig](https://www.wir-machen-druck.de/broschuere-mit-drahtheftung-endformat-din-a4-quer-32seitig.html) | mittel (Quer, nicht Hoch) |
| WMD | Abizeitung PUR-Klebebindung DIN A4, 108 Seiten, Auflage 1.000 | 3,41 EUR pro Stück | brutto, inkl. Versand DE | [WMD, Abizeitung A4](https://www.wir-machen-druck.de/abizeitung-a4-klebebindung-extrem-guenstig-drucken,category,13708.html) | mittel (Papier nicht genannt) |
| WMD | dito, 200 Seiten | 5,50 EUR pro Stück | brutto, inkl. Versand DE | dito | mittel |
| Onlineprinters | Klebebindung, 356 Seiten, 50 Exemplare: DIN lang Quer 249,48; DIN lang Hoch 233,24; Art-Size Hoch 418,60; A4 Quer 396,37; A4-Quadrat 336,22; A5 Quer 263,50 (328–356 S.) | siehe links, EUR | netto, ohne Versand | [Onlineprinters, Kataloge](https://www.onlineprinters.de/k/kataloge) und Produktseiten | mittel, nur Obergrenze der Seitenzahl, nicht für 32–96 S. |
| Onlineprinters | A4 Hochformat Klebebindung, 500 Stück (Seitenspanne der Seite 308–356) | 1.378,00 EUR | netto | [Onlineprinters, A4 Hochformat](https://www.onlineprinters.de/p/kataloge-klebebindung-din-a4-hochformat) | niedrig (Seitenzahl der Preiszeile unklar) |
| Onlineprinters | dito, 1.000 Stück | 1.691,48 EUR | unklar | dito | niedrig |
| Onlineprinters | A4 Hochformat Naturpapier, 64 Seiten, 500 Stück | 1.391,09 EUR | netto | [Onlineprinters, Naturpapier A4 Hoch](https://www.onlineprinters.de/p/kataloge-klebebindung-oeko-naturpapiere-hochformat-din-a4) | sehr niedrig, nicht plausibel (fast gleich wie 308–356-Seiten-Standard), nicht verwenden |
| Onlineprinters | Broschüre Klammerheftung DIN A4, 1.000 Stück, "ab 44 Seiten" | 235,76 EUR | netto | [Onlineprinters, Klammerheftung A4](https://www.onlineprinters.de/p/broschueren-klammerheftung-din-a4) | sehr niedrig, nicht plausibel (ca. 0,24 EUR/Stk), Konfiguration unklar, nicht verwenden |
| Print24 | Standard, DIN A5, 48 Seiten, 1 Stück, Umschlag und Innenteil farbig | 38,56 EUR (anderer Snapshot 39,23 EUR; Lieferung nach AT 43,79 EUR) | unklar | [Print24, Kataloge Klebebindung](https://print24.com/de/druckprodukte/kataloge-magazine/kataloge-magazine-klebebindung) | niedrig für Auflage 250+ (Einzelstück) |
| Print24 | Budget, DIN A4, 40 Seiten, 20 Stück | 102,83 EUR (ältere Snapshots 88,27 / 88,12 EUR) | unklar | [Print24, Budget Kataloge](https://print24.com/de/druckprodukte/kataloge-magazine/kataloge-magazine-budget) | niedrig (zeigt Preisdrift zwischen Snapshots) |
| Flyeralarm | keine verwertbaren Preise in den Treffern (Platzhalter 0,00 EUR; ein "Broschüre Budget (Digitaldruck)" 270,52 EUR ohne Konfiguration) | n/a | n/a | [Flyeralarm, Broschüren Klebebindung](https://www.flyeralarm.com/de/p/broschueren-mit-klebebindung-551719); [Flyeralarm, Broschüre Budget](https://www.flyeralarm.com/de/p/broschuere-budget-digitaldruck-4520431.html) | nicht verwendbar |

- Historischer Referenzpunkt (veraltet): Angebotsvergleich HU Berlin 2016, 2.000 Stück DIN A5 mit Rückendrahtheftung, Flyeralarm 844,15 EUR inkl. Versand und MwSt — [HU Berlin, Antrag SWV Broschüre](https://beauftragte.hu-berlin.de/de/vertretungen/stupa/sitzungen/2016/11-21/05_antrag_swv_broschuere_1.pdf); nicht für heutige Preise nutzbar.
- Lieferzeit Saxoprint: PUR-Broschüren 7 Werktage Produktionszeit ab Eingang druckfertiger Daten und Zahlung, zuzüglich Versand; "Beim Standard-Versand kommen nahezu alle Pakete bereits nach einem Arbeitstag an"; Versandkosten stets im Preis enthalten; Express für Klammerheftung bis 32 Seiten innerhalb 72 Stunden erwähnt; Express+ nicht für jede Konfiguration — [Saxoprint, Klebebindung](https://www.saxoprint.de/werbebedarf/broschueren/klebebindung); [Saxoprint, FAQ](https://www.saxoprint.de/service-und-hilfe/faq)
- Lieferzeiten von Flyeralarm, WMD, Onlineprinters, Print24: in den Treffern nicht ausgewiesen.
- Preisänderungen im Katalog: Eine Anbieterseite beschreibt, wie aus einer Datenquelle plus InDesign-Template Versionen je Markt/Kategorie/Kunde (PDF oder Excel) entstehen — [Pagination, Katalog- und Preislistenautomatisierung](https://pagination.com/de/?p=1003241)

### Inferences
- Datenpunkt-Orientierung (nicht verifiziert): Saxoprint-Klammerheftung A4/500 Stück rechnerisch 0,28 EUR (8 S.), 0,40 EUR (12 S.), 0,50 EUR (16 S.) pro Stück; WMD A4 quer 32 S./500 Stück 1,86 EUR pro Stück, entspricht rechnerisch ca. 930 EUR; WMD PUR 108 S. bei 1.000 Stück 3,41 EUR brutto pro Stück. Für 48–96 Seiten A4 bei 500–1.000 Stück ist demnach ein niedriger einstelliger Euro-Betrag pro Katalog denkbar; sicher ist das nicht. Papier, Umschlag, Veredelung und Netto/Brutto sind je Datenpunkt unterschiedlich oder unklar.
- Zwischen Snapshots schwankt derselbe Print24-Preis um bis ca. 17 % (88,27 vs. 102,83 EUR): Preise ändern sich und müssen am Auftragstag im Konfigurator geprüft werden.
- Daraus folgt für den Einsatzfall: Verbindliche Preise nur über Konfigurator/Angebot (mindestens zwei Anbieter, Digital und Offset, 500/1.000/2.500). Die Struktur "Katalog ohne Preise + separate Preisliste/Preiseinleger" ist mit der Datenpipeline-Logik (Pagination) gut vereinbar, eine Best-Practice-Quelle dazu fehlt.

### Gaps
- Keine einzige vollständige Preiszeile für 32/48/64/96 Seiten x A4/A5 x 250/500/1.000/2.500 aus den Seiten selbst gesehen (Konfiguratoren waren nicht erreichbar).
- Lokale Druckerei: nicht recherchiert.
- Lieferzeiten der vier anderen Anbieter und Versandkosten: nicht belegt.
- Keine Quelle zum Umgang mit Preisänderungen (loser Preiseinleger, Preisliste als Beilage, Gültigkeitsvermerk): Suche lieferte nur Software-Hilfeseiten.

---

## (c) Inspirationsbeispiele (Kataloge, Magazine, Awards, Portfolios)

### Takeaway
Es gibt keine in dieser Recherche gesichteten Primärseiten; die Liste unten sind Kandidaten, die über Titel/Snippet gefunden wurden und vor der Konzeption manuell geöffnet werden müssen. Mehrere erwartete Fundorte (Gaea, Rungis Express/R express, Dallmayr, Metro/Chefs Culinar/Transgourmet, ADC/TDC, Deutscher Verpackungspreis, German Design Award für Food-Kataloge) lieferten keinen Katalog.

### Cited Findings

**Kandidaten (Verifikationsstatus überall: nur Suchtreffer/Snippet, Seite nicht geöffnet)**

1. Fortnum & Mason, Weihnachtskatalog/Hamper-Kampagne 2013 (UK, international): Katalog mit vielen Seiten Spirituosen und Delikatessen neu gedacht, Shooting in verschneitem Wald; 120.000 Broschüren in Verona gedruckt — [Creative Review, Christmas arrives at Fortnum & Mason](https://www.creativereview.co.uk/christmas-arrives-fortnum-mason/); Produktionshinweis: [Cambridge Network, CPL produces luxurious Fortnum's brochure](https://www.cambridgenetwork.co.uk/news/cpl-produces-luxurious-fortnums-brochure) (Jahr dieser Meldung unklar; Zuordnung der Verona-Angabe zu einer der beiden Quellen nicht eindeutig)
2. Fortnum & Mason, Edward-Bawden-Weihnachtskataloge, ca. 1957 (UK, historisch): "colour washed black and white product photographs decorated with illustrations by Bawden", Pantomime-Figuren in Bonbonfarben; produziert von Colman Prentis and Varley, gedruckt bei Chas F Ince and Sons; außerdem 1938er Hamper-Katalog, illustriert von Gordon Davey — [V&A Collections, Objekt O1348578](https://collections.vam.ac.uk/item/O1348578); [V&A API, Objekt O1348550](https://api.vam.ac.uk/v2/object/O1348550) (Zuordnung der Zitate zu den beiden V&A-Objekten nicht eindeutig)
3. Fortnum & Mason, erste eigene Hausschrift 2024 durch Otherway (UK): Aufgabe war, sich vom überstrapazierten Gill zu lösen und eine Serif mit mehr Persönlichkeit zu bauen — [It's Nice That, Otherway gives Fortnum & Mason its first bespoke font](https://www.itsnicethat.com/articles/otherway-fortnum-and-mason-typeface-graphic-design-project-120824)
4. Manufactum, Hauptkatalog (DE): nach 34 Jahren eingestellt (Meldungen von 2022 laut URL/Datumsformat; kein ausdrückliches Datum im Snippet), kleinere Sortimentskataloge ein- bis zweimal jährlich, weil sie "eine deutlich differenziertere Kundenansprache" erlauben; Hauptkatalog enthielt auch Lebensmittel — [Lebensmittel Zeitung](https://www.lebensmittelzeitung.net/handel/nachrichten/otto-tochter-manufactum-stellt-hauptkatalog-ein-166586); [FashionUnited](https://fashionunited.de/nachrichten/einzelhandel/otto-group-manufactum-stellt-hauptkatalog-ein/2022081047771); [Textilwirtschaft](https://www.textilwirtschaft.de/fashion-management/manufactum-stellt-hauptkatalog-ein-121581); [W&V](https://www.wuv.de/Themen/Marke/Manufactum-stampft-seinen-Hauptkatalog-ein)
5. Manufactum, Katalog-Anmutung (UK-Rezension, 2000): Design Week beschreibt den Look als "practical and unpretentious", der Gestalter wolle mit dem Design nichts erreichen außer die Ware zu zeigen, Helvetica für die erzählenden Bildunterschriften (Bezug des Artikels zu Manufactum laut Snippet; der Artikeltitel lautet "Quentin Newark") — [Design Week, 8 June 2000](https://www.designweek.co.uk/issues/8-june-2000/quentin-newark/); historischer Katalog Nr. 8 von 1996 mit Rubrik "Küche und Lebensmittel" im Museumsbestand — [SMB museum-digital, Objekt 238549](https://smb.museum-digital.de/pdf/object/238549.pdf?lang=de)
6. Eataly, Catalogo di Natale 2026 (IT, Firmengeschenke): PDF mit Geschenkboxen, Wein, Spirituosen; Auswahl aus "oltre 20.000 prodotti", personalisierbare Verpackung mit Logo/Sticker — [Eataly, Catalogo di Natale 2026 (PDF auf ordineavvocatimilano.it)](https://www.ordineavvocatimilano.it/media/convenzioni/EATALY/Il Catalodi di Natale 2026 di Eataly.pdf)
7. Österreichisches Lieferantenblatt (Gastmesse Austria), Antipasti/Oliven/Kapern/getrocknete Tomaten: preislistenähnlicher Datenbogen mit Artikelnummern und Gebinden (z. B. 6 x 1.700 g), italienische, spanische und griechische Spezialitäten — [Gastmesse, Aussteller-PDF 51929](https://www.gastmesse.at/fileadmin/exhibitor_upload/51929_6a954d6a95a37.pdf) (Lieferant im Snippet nicht genannt)
8. The Chef's Garden (Ohio, USA), monatliche Availability Guides als PDF für Köche (Kräuter, Blüten, Salate) — [Chef's Garden, Availability Dezember/Januar](https://www.chefs-garden.com/TheChefsGarden/media/TCG/Availability%20Guides/December_January.pdf)
9. Behance (international), Listen/Projekttitel zu "wholesale catalog": u. a. "WHOLESALE Catalog & Packaging Design" und "Chef's Garden - Wholesale Food Product Catalogue" — [Behance, wholesale catalog](https://www.behance.net/search/projects/wholesale%20catalog) (Einzelprojekt-URLs nicht erfasst; Verbindung zum Ohio-Unternehmen unklar)
10. Behance, "food catalogue": u. a. "Cédric Grolet Pastry Catalogue | Editorial Design", "Snacks - Product Catalogue Design", "ITQAN food and agricultural products catalogue", "Product Catalog for B2B", "Food products catalog / Ethnic flavors", "Tech Food Ingredients Sdn. Bhd Product Catalogue" — [Behance, food catalogue](https://www.behance.net/search/projects/food%20catalogue); [Behance, food catalogue catalog](https://www.behance.net/search/projects/food%20catalogue%20catalog?locale=en_US); [Behance, food catalogue product](https://www.behance.net/search/projects/food%20catalogue%20product?locale=en_US)
11. Behance, Olivenöl: "Olea Greek Extra Virgin Olive Oil" (WE + CO, ca. 1.000 Aufrufe/60 Appreciations zum Snapshot), "Adelasia - Extra Virgin Olive Oil - Brochure" (Stephie Romero), "Olive Oils - Brochure Design", "Bi-fold Brochure Olive Oil Exchange Platform", "Rizoma, Olive Oil" (Best of Behance), "OLVA | Branding | Packaging Design", "Petra Olive – Branding & Visual Identity", "FRANTOIO" — [Behance, olive brochure](https://www.behance.net/search/projects/olive%20brochure); [Behance, olive oil](https://www.behance.net/search/projects/olive%20oil) (überwiegend Branding/Verpackung, nur wenige Broschüren; Zahlen sind Snapshot-Werte)
12. Meyle + Müller (DE), Portfolio-Projekt "Catalog relaunch with emotion" — [Meyle + Müller, Catalog relaunch](https://meyle-mueller.de/en/portfolio/catalog-relaunch-with-emotion/) (Inhalt und Branche im Snippet nicht erkennbar)
13. Dallmayr (DE), Red Dot Design Award 2022, Kaffeeverpackung "Roasting art" von fantomas Design, München — [Packaging Journal](https://packaging-journal.de/en/?p=68067) (Verpackung, kein Katalog; Markenwelt-Referenz)
14. Gloria (Griechenland), Verpackungsserie einer Patisserie, ausgestellt im Rahmen der Red Dot-Auswahl 2023 im Museum für Kommunikation Berlin — [Visit Berlin, Red Dot Winners Selection 2023](https://visitberlin.de/en/node/2211267) (Verpackung)
15. F. Dick (DE), "CUT! How to cut properly": German Design Award 2017; Quelle widersprüchlich, Überschrift nennt "Excellent Communications Design", Text nennt Special Mention in "Books and Calendars" — [Meatingplace](https://meatingplace.com/german-design-award-2017-excellent-communications-design-given-to-f-dick-for-cut-how-to-cut-properly/) (Fachbuch für Fleischer/Gastronomie, kein Sortimentskatalog)
16. Adler (DE, Mode): Werbekatalog kehrt nach 14 Jahren zurück (2022) — [FashionUnited](https://fashionunited.de/nachrichten/business/adler-bringt-werbekatalog-nach-14-jahren-zurueck/2022083148017) (nur Titel gesehen; kein Food; als Kontext zur Print-Katalog-Renaissance)
17. Hilfreich als Prozessbeispiel, Titel gesehen: [Flipsnack, Publishing 70,000 SKUs](https://blog.flipsnack.com/?p=76153)

**Nicht gefunden (ausdrücklich)**
- Kein Katalog von Gaea (nur Händlerseiten), Rungis Express/R express (seit Anfang 2024 Auftritt als "R express"; nur Firmenhistorie), Dallmayr (nur Verpackung), Metro/Chefs Culinar/Transgourmet (kein auffindbares PDF; Händler-Portale oft hinter Login), Red-Dot-/German-Design-Award-/ADC-/TDC-Gewinner für Feinkost-Kataloge, Deutscher Verpackungspreis-Gewinner für Oliven/Feinkost — Suchtreffer: [Red Dot Gala 2018](https://www.red-dot.org/de/magazine/red-dot-gala-communication-design-2018), [Deutscher Verpackungspreis 2024](https://retail-news.de/deutscher-verpackungspreis-2024-zahlreiche-packaging-innovationen-praemiert/) (jeweils ohne Feinkost-Katalog); Rungis-Express-Firmengeschichte: [Gastmesse, Rungis Express (PDF)](https://gastmesse.at/fileadmin/exhibitor_upload/28096_670516fe26dd4.pdf)

### Inferences
Alle "übernehmbar/nicht passend"-Aussagen sind Hypothesen aus Titel/Snippet und vor Übernahme an der Originalseite zu prüfen.

- Fortnum & Mason 2013/Bawden: übernehmbar als Prinzip "Atmosphäre-Fotografie plus illustrative Akzente" für Kapitelauftakte oder Eigenmarken-Seiten; nicht passend: Luxus-Geschenkcharakter, Auflagenhöhe (120.000), Weihnachtssaison, UK-Preispositionierung. Hausschrift-Beispiel zeigt Typografie als Markenhebel (Eigenmarken ADOLIVA/ADMIRA/WERMIO mit eigener Schriftanmutung denkbar).
- Manufactum: übernehmbar: Segmentierung statt Vollkatalog (z. B. getrennte Teilkataloge für Gastro, Imbiss/Döner/Pizzeria, Kleinhandel) und Dunkelgrün als Markenfarbe; Katalogton "zeigen statt inszenieren"; nicht passend: Endkundenfokus, Warenmix außerhalb Lebensmittel, Wegfall des Hauptkatalogs spricht eher für ergänzende digitale Kanäle.
- Eataly Catalogo di Natale: übernehmbar: Vorbild für einen Eigenmarken-/Geschenk-/Saisonteil; nicht passend: B2C-/Firmengeschenk-Logik, kein Datenkatalog.
- Gastmesse-Datenbogen: übernehmbar als Realbeispiel für Datenzeilen (Art.-Nr., Gebinde, mediterrane Warengruppen) in einem B2B-Kontext; Gestaltungsqualität unbekannt, vermutlich Mindeststandard statt Vorbild.
- Chef's Garden Availability Guides: übernehmbar als Format "kompakter, regelmäßig aktualisierter Chef-Bogen" (Beilage/Saisonblatt, Preisaktualisierung); nicht passend: Frischware, USA.
- Behance-Kandidaten (wholesale/food catalogue/B2B/ethnic flavors): voraussichtlich die nächsten Vorbilder für Raster, Datenseiten und Fototyp; konkret zu prüfen: Seitenmix Bild-/Datenseite, Zeilenhöhe in Tabellen, Siegelleiste, Register. Olivenöl-Projekte eher für Farbwelt, Illustration und Typografie (WE+CO "Olea Greek" für Grün/Gold-Ästhetik, nur Hypothese), nicht für Tabellenlayout.
- Die Pagination-/Flipsnack-Quellen stützen die Idee, ein tabellarisches 530-Artikel-Sortiment datengetrieben zu setzen (InDesign/Daten-Merge) und parallel digital zu veröffentlichen.

### Gaps
- Jahr/Autor/Seitenaufbau/Raster/Fototyp/Typografie/Register der Kandidaten sind nicht verifiziert, weil keine Seite geöffnet werden konnte.
- Es wurden keine 12–20 gesichteten Primärbeispiele erreicht; die Zahl 17 oben sind Kandidaten, deren Relevanz nur aus Titel/Snippet geschätzt ist. Kein Eintrag zu Pinterest, Issuu, Dribbble-Projekten (nur ein Dribbble-Service-Listing), TDC, ADC, Best of Content Marketing.
- Quellen 2022–2026: Nur teilweise erfüllt (Manufactum 2022, Adler 2022, Dallmayr Red Dot 2022, Eataly 2026, Otherway 2024, Behance undatiert); mehrere Beispiele sind historisch (1938, 1957, 2000, 2013).

---

## Top-Funde (mit Konfidenz)

1. Seitenrahmen und Bindungen laut Anbietern: PUR 48–400 (WMD), 64–356 plus Umschlag (Onlineprinters), bis 400 (Saxoprint), Kataloge bis 1.400 (Print24), bis 804 (Flyeralarm); Klammerheftung bis ca. 96–152 Seiten; Print24-Budget-Klebebindung erst ab 40 Seiten. Konfidenz: **hoch** (mehrere unabhängige Anbieter-Snippets; nur Suchtreffer). Quellen: siehe (b1).
2. Bei Klebebindung gehen im Bund 5 mm Gestaltungsfläche verloren; Umschlag und Innenteil als getrennte Dateien; erste und letzte Innenseite werden mit dem Umschlag verklebt (Flyeralarm-Datenblatt, Stand 19.03.2025). Konfidenz: **hoch** — [Flyeralarm Datenblatt](https://www.flyeralarm.com/sheets/de/magazinkleb_a4_bgt_kl.pdf)
3. Daten-Basisstandard: PDF/X-4 (oder X-1a), CMYK, 300 ppi, 3 mm Beschnitt, Schriften eingebettet, Output-Intent korrekt. Konfidenz: **hoch** (mehrere Datenblätter; Details je Druckerei prüfen) — [druck.at Infoblatt](https://cdn.druck.at/sites/default/files/Infoblatt_Druckdatenerstellung.pdf)
4. PSO Coated v3 = FOGRA51, Nachfolger von ISO Coated v2, entstanden aus ISO 12647-2:2013 (OBA-Papiere, M1); Gesamtfarbauftrag je Quelle uneinheitlich (300 % vs. 330 % bei FOGRA39-Profil). Konfidenz: **hoch** für Herkunft, **mittel** für Gesamtfarbauftrag — [Fogra](https://fogra.org/en/downloads/work-tools/characterisation-data); [print.app](https://print.app/resources/icc-profiles/pso-coated-v3)
5. Seitenzahlen in Vierer-Schritten bei Anbietern (Onlineprinters: "in Schritten von 4"); 32 Seiten = 16 Blatt. Konfidenz: **mittel** (Vielfache von 8/16 nicht belegt) — [Onlineprinters](https://www.onlineprinters.de/p/kataloge-klebebindung-din-a5-querformat)
6. Digital ab 1 Stück, Offset ab 50 Stück (Onlineprinters); keine feste Break-even-Grenze belegt. Konfidenz: **mittel** — [Onlineprinters](https://www.onlineprinters.de/k/kataloge)
7. Preis-Datenpunkte (alle undatiert): Saxoprint 500 Stück A4 Klammer 130 g: 8 S. 138,68 EUR, 12 S. 200,94 EUR, 16 S. 248,23 EUR; WMD PUR A4 108 S./1.000 Stück 3,41 EUR brutto pro Stück. Konfidenz: **mittel bis niedrig** — [Saxoprint](https://www.saxoprint.de/werbebedarf/broschueren/klammerheftung); [WMD](https://www.wir-machen-druck.de/abizeitung-a4-klebebindung-extrem-guenstig-drucken,category,13708.html)
8. Saxoprint: PUR-Broschüren 7 Werktage Produktion ab Daten- und Zahlungseingang, Standardversand meist 1 Werktag, Versand im Preis. Konfidenz: **mittel** — [Saxoprint](https://www.saxoprint.de/werbebedarf/broschueren/klebebindung)
9. Papier: Uni-Jena-Leitfaden empfiehlt für Klebebindung Innenteil 90–120 g, Umschlag 160–250 g. Konfidenz: **mittel** (Hochschul-Leitfaden) — [Uni Jena](https://uni-jena.de/unijenamedia/364100/papier-guide-2024-web.pdf)
10. Tabellendesign: sehr helle Zebrastreifen mit heller erster Zeile (Hobday), Gegenargument Tufte; Tabellenziffern für Zahlenspalten. Konfidenz: **mittel** — [Hobday](https://anthonyhobday.com/sideprojects/visualtechniques/techniques/background/zebra-striped-table-rows.html); [Tufte](https://www.edwardtufte.com/notebook/zebra-tables-and-lists/); [Dr. Web](https://www.drweb.de/css-ziffern-font-variant-numeric/)
11. Mindestschrift: 8 pt als Komfortgrenze (10 pt bei älteren Lesern) laut einer Druckerei; 12 pt/Zeilenabstand 1,5 bei Sehbehinderung (Österreich). Konfidenz: **mittel bis niedrig** — [4over4](https://v2.4over4.com/guide/what-is-the-smallest-font-size-you-can-print); [Hilfsgemeinschaft](https://www.hilfsgemeinschaft.at/fileadmin/Hilfsgemeinschaft/Aktuelles/Downloads/Leitfaden_Druckwerke.pdf)
12. Manufactum stellte den Hauptkatalog nach 34 Jahren ein und setzt auf Sortimentskataloge (1–2 pro Jahr) mit differenzierterer Kundenansprache (Meldungen 2022). Konfidenz: **hoch** (mehrere Medien) — [Lebensmittel Zeitung](https://www.lebensmittelzeitung.net/handel/nachrichten/otto-tochter-manufactum-stellt-hauptkatalog-ein-166586); [FashionUnited](https://fashionunited.de/nachrichten/einzelhandel/otto-group-manufactum-stellt-hauptkatalog-ein/2022081047771)

## Inspirationsliste, nach erwartetem Nutzen sortiert

Nutzen = erwartete Relevanz für einen datenlastigen B2B-Katalog mit mediterraner Warenwelt, geschätzt aus Titel/Snippet. Alle Einträge vor Übernahme sichten.

1. Behance "Chef's Garden - Wholesale Food Product Catalogue" / "WHOLESALE Catalog & Packaging Design" (Wholesale-Struktur) — https://www.behance.net/search/projects/wholesale%20catalog — Konfidenz Relevanz: mittel
2. Behance "Food products catalog / Ethnic flavors", "Product Catalog for B2B", "ITQAN food and agricultural products catalogue" (B2B-Food-Datenseiten) — https://www.behance.net/search/projects/food%20catalogue%20catalog?locale=en_US — mittel
3. Gastmesse-Lieferantenblatt Antipasti/Oliven (reale Datenzeilen, Art.-Nr./Gebinde) — https://www.gastmesse.at/fileadmin/exhibitor_upload/51929_6a954d6a95a37.pdf — mittel (Gestaltung vermutlich schlicht)
4. Manufactum Sortimentskataloge/Hauptkatalog-Konzept (Segmentierung, Dunkelgrün, "zeigen statt inszenieren") — https://www.lebensmittelzeitung.net/handel/nachrichten/otto-tochter-manufactum-stellt-hauptkatalog-ein-166586 — hoch (für Strategie), niedrig (für Layout)
5. Behance "Cédric Grolet Pastry Catalogue | Editorial Design" und "Snacks - Product Catalogue Design" (Fototyp, Bild-/Datenmix) — https://www.behance.net/search/projects/food%20catalogue — mittel
6. Fortnum & Mason Weihnachtskatalog 2013 (Atmosphäre-Fotografie, Printproduktion) — https://www.creativereview.co.uk/christmas-arrives-fortnum-mason/ — mittel
7. Behance Olivenöl-Projekte (WE+CO "Olea Greek", "Adelasia Brochure", "Olive Oils - Brochure Design") — https://www.behance.net/search/projects/olive%20brochure — niedrig bis mittel (Farbwelt/Typografie, nicht Datenlayout)
8. Eataly Catalogo di Natale 2026 (Eigenmarken-/Geschenkteil, Italien) — https://www.ordineavvocatimilano.it/media/convenzioni/EATALY/Il Catalodi di Natale 2026 di Eataly.pdf — niedrig bis mittel
9. Chef's Garden Availability Guides (Beilageblatt-Format) — https://www.chefs-garden.com/TheChefsGarden/media/TCG/Availability%20Guides/December_January.pdf — niedrig bis mittel
10. Fortnum & Mason Otherway-Hausschrift 2024 (Typografie als Markenhebel) — https://www.itsnicethat.com/articles/otherway-fortnum-and-mason-typeface-graphic-design-project-120824 — niedrig bis mittel
11. Fortnum & Mason Bawden-Kataloge ca. 1957 (Foto-plus-Illustration) — https://collections.vam.ac.uk/item/O1348578 — niedrig
12. Meyle + Müller "Catalog relaunch with emotion" — https://meyle-mueller.de/en/portfolio/catalog-relaunch-with-emotion/ — niedrig (Inhalt unbekannt)
13. Dallmayr Red Dot 2022 Kaffeeverpackung (DE-Premium-Markenwelt) — https://packaging-journal.de/en/?p=68067 — niedrig (Verpackung)
14. F. Dick "CUT!" German Design Award 2017 (Fachbuch, Gastro) — https://meatingplace.com/german-design-award-2017-excellent-communications-design-given-to-f-dick-for-cut-how-to-cut-properly/ — niedrig (Kategorie unklar)
