# Toteutusraportti 2.11.2026

## Lähtötilanne

Repositorion main-haarassa oli vain 70 tavun README, viimeisin commit `47e4490`. Työpuu oli puhdas. Sovellusta, riippuvuuksia, testejä tai Figma-linkkiä ei ollut. Repo ei sisältänyt Word-suunnitelmaa. Käyttäjän liitteen kaikki tekstikappaleet ja taulukot luettiin python-docxilla ja alkuperäinen tiedosto kopioitiin muuttamattomana `docs/RecipeBox_projektisuunnitelma.docx`-polkuun.

Ympäristö: Node 24.22.1, npm 11.9.0, Git 2.51.1. Työ tehdään haarassa `feature/recipebox-mvp`. Aiempaa sovelluskoodia ei korvattu eikä dokumentaatiota poistettu.

## Toteutettu

React + Vite + JavaScript + CSS, HashRouter, kolme päänäkymää sekä navigaatio, haku, kategoriavalinta, reseptikortti, suosikkipainike, kuvan varatila ja tilaviestikomponentit. API-moduuli erottaa nimihakua, kategorioita, kategoriasuodatusta ja ID-hakua koskevat pyynnöt. Ainesosat normalisoidaan 20 kenttäparista. Haku ja kategoria ovat vaihtoehtoisia, tyhjä syöte validoidaan ja vanhentunut vastaus estetään sekä AbortControllerilla että efektin aktiivisuustarkistuksella.

Suosikit säilytetään localStoragessa kortin perustietoina ilman kaksoiskappaleita. Viallinen sisältö ja estetty tallennus käsitellään, ja tila ilmoitetaan myös ruudunlukijalle. Näkymät sisältävät latauksen, virheen, uudelleenyrityksen ja tyhjän tilan. Puuttuva kuva ja sisältö saavat varatekstin.

Alustava ilme: vaalea tausta, vihreät painikkeet, kortit ja CSS:llä piirretty ruoka-aiheinen kuvitus. Ilme ei ole vahvistettu Figma-prototyyppi. Mukautukset 390/768/1440 px on toteutettu CSS:ään, mutta selainvarmennus on vielä tehtävä.

## Tiedostot

- Päivitetty `README.md`.
- Lisätty `package.json`, lukitustiedosto, `.gitignore`, `index.html`, Vite- ja Playwright-asetukset.
- Lisätty `src/components`, `src/pages`, `src/hooks`, `src/services`, `src/styles` sekä `src/main.jsx`.
- Lisätty Playwright-käyttäjäpolut ja Node-yksikkötestit `tests/`-kansioon.
- Lisätty `.github/workflows/checks.yml`, alkuperäinen Word-suunnitelma, API-kuvaus ja Jiraan siirrettävä tehtävälista.

## Tarkistukset ja todelliset tulokset

| Tarkistus | Tulos |
| --- | --- |
| Node/npm/Git-versiot ja `git status` | Tarkistettu, alkuperäinen työpuu puhdas |
| `npm install` | Riippuvuudet ja lukitustiedosto luotu |
| `npm run dev -- --host 127.0.0.1` | Vite käynnistyi porttiin 5173 |
| `npm run build` | Onnistui |
| `npm run test:unit` | 4/4 läpäisi |
| `npm audit --omit=dev` | 0 tunnettua tuotantoriippuvuuksien haavoittuvuutta |
| `git diff --check` | Onnistui |
| TheMealDB `search.php?s=Arrabiata` HTTP-kutsu | Palautti oikean Spicy Arrabiata Penne -reseptin |
| Playwright, 14 tapausta × Chromium/Firefox | Yritetty, ympäristön selainkäynnistys estyi; ei hyväksyttyä E2E-tulosta |

Playwrightin ensimmäinen selainlataus palautti viallisen paketin. Vanhemman selainjakelun lataus onnistui virallisesta vaihtoehtoisesta jakelusta, mutta Chromium pysähtyi ympäristön `socket(): Operation not permitted` -rajoitukseen. Uusin Playwright-testiajuri palautettiin käyttöön. Valinnaiset `RECIPEBOX_CHROMIUM_EXECUTABLE` ja `RECIPEBOX_FIREFOX_EXECUTABLE` mahdollistavat erikseen asennetun testiselaimen käytön; normaalisti niitä ei aseteta. Näitä kokeiluja ei lasketa läpäistyiksi sovellustesteiksi.

GitHub Actions asentaa lukitut riippuvuudet, ajaa buildin ja yksikkötestit, asentaa ajurin mukaiset selaimet ja suorittaa E2E-testit. Työnkulun lisääminen ei itsessään tarkoita onnistunutta CI-ajoa.

## Rajaukset ja seuraavat tehtävät

GitHubin lukuoikeus toimi. Jira-connectoria ei ollut, joten taulun tehtäviä ei voitu tarkistaa tai muuttaa. Figma-linkkiä ei ollut; prototyyppiä ei luotu eikä olemassaoloa vahvistettu. Word luettiin kokonaan ilman käyttöoikeusongelmaa.

Ennen kurssiversion hyväksyntää tarvitaan onnistunut E2E-ajo, visuaalinen tarkistus molemmilla selaimilla ja kolmella leveydellä, oikean API:n koko käyttäjäpolku omassa selaimessa ja ulkopuolisen käyttäjän käytettävyystesti. Julkaise testidemo ja lisää todellinen linkki. Tee Figma-prototyyppi, esittelyvideo ja itsearviointi. Moodle-palautusta ei ole tehty. Usean välilehden suosikkimuutoksia ei synkronoida; kyse on yhden selaimen paikallisesta kokoelmasta.
