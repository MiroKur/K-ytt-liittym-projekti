# TheMealDB API

Tarkistettu 2.11.2026:

- https://www.themealdb.com/api.php
- https://www.themealdb.com/terms_of_use.php (sivulla päivityspäivä 1.7.2025)

Dokumentaatio sallii julkisen testitunnisteen `1` kehitys- ja opetuskäyttöön. Sovelluskauppajulkaisu vaatii maksullisen tilaajan tunnisteen. Laajempaa tuotantokäyttöä varten tarkistetaan silloin voimassa olevat ehdot ja tarvittaessa varmistetaan käyttö palveluntarjoajalta. Tämä projekti on kurssitoteutus, ei sovelluskauppajulkaisu.

Virallisia API-päätepisteitä käytetään ilman verkkosivujen scrapingia. Kuvia ei esitetä omina: käyttöliittymässä on linkki TheMealDB-lähteeseen. Tekijänoikeus- ja tavaramerkintöjä ei saa poistaa tai muuttaa. Kolmansien osapuolten sisältöön liittyvät oikeudet huomioidaan erillisessä jatkokäytössä.

| Toiminto | Polku suhteessa https://www.themealdb.com/api/json/v1/1/ |
| --- | --- |
| Nimihaku | search.php?s=Arrabiata |
| Kategoriat | categories.php |
| Kategorian reseptit | filter.php?c=Seafood |
| Reseptin tiedot | lookup.php?i=52771 |

`meals: null` käsitellään tyhjänä tuloksena. Virheellinen vastausrakenne tuottaa virhetilan. Vialliset yksittäiset reseptit ohitetaan. Ainesosat ja määrät luetaan kentistä 1–20; tyhjät ainesosat ohitetaan. Kategorian vastaus voi sisältää vain kortin perustiedot. Verkkohaut käyttävät AbortControlleria ja efektin aktiivisuustarkistusta. Vastaukset esitetään React-tekstinä, ei API:n tuottamana HTML:nä.
