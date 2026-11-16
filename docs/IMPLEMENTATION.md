# Toteutusraportti 16.11.2026

## Lähtötilanne ja muutokset

Puhdas työkopio kloonattiin haarasta `feature/recipebox-mvp`, jonka viimeisin commit oli `3e16cd8`. PR #1 oli jo yhdistetty mainiin (merge `046e139`); sen viimeisimmän haaracommitin push- ja PR-CI-ajot olivat onnistuneet. Jatkokehitys tehtiin mainista uudelle haaralle `feature/recipebox-polish`. Paikallisia muutoksia ei ollut eikä force pushia käytetty. AGENTS.md-tiedostoa ei löytynyt. README, aiempi toteutusraportti, Jira-lista ja Word-suunnitelman teksti luettiin.

Chromiumin kuvissa kortin ja kategoriasuositusten vinonuoli näkyi puuttuvana merkkinä. Merkki vaihdettiin oikealle osoittavaan nuoleen. Suosikeista avatun reseptin paluulinkki sanoi virheellisesti ”Takaisin resepteihin”, vaikka kohde oli suosikit; teksti korjattiin ja olemassa olevaa regressiopolkua täydennettiin. React-, Vite-, CSS-, TheMealDB- ja localStorage-rakenne säilyi.

## Visuaalinen tarkistus

Chromiumissa kuvattiin oikean API:n hakutulos, reseptitiedot ja suosikit leveyksillä 390, 768 ja 1440 px. [Kuvakaappaukset](screenshots/2026-11-16/) ovat koko sivun kuvia. Niistä arvioitiin asettelu, kuvat, typografia ja ohjeiden luettavuus: 390 px:ssa sisältö on yhdessä sarakkeessa, 768 px:ssa kortit ovat kahdessa sarakkeessa ja 1440 px:ssa kolmessa; tarkistetun reseptin ohje ja kuva näkyivät luettavina. Kuvissa käytettiin yhtä oikeaa reseptiä, joten ne eivät osoita kaikkien mahdollisten pitkien nimien sopivuutta. Vinonuolen puuttuva merkki korjattiin. Kuvat on otettu korjauksen jälkeen.

Käyttäjän antama [Figma Make -linkki](https://www.figma.com/make/DYdPyw4kCFPkyzAEHriuSk/RecipeBox-Recipe-App-Prototype?t=PGpCr3oyDaXLCeTV-1) tallennettiin README:hen. Figma-yhteys ilmoitti toisella tilillä käyttöoikeusvirheen ja toisella Make-tiedoston olevan tukematon; suora verkkoyhteys estyi 403-vastaukseen. Prototyypin sisältöä tai Figma-vastaavuutta ei ole varmennettu. Käytetty annettua värilinjaa.

## Tarkistukset

- `npm run build`: onnistui.
- `npm run test:unit`: 4/4 onnistui.
- `npm test`: Chromium 14/14 onnistui; Firefoxin 14 tapausta estyivät selaimen käynnistyessä virheeseen `Could not find profile folder`. Koko komento epäonnistui siksi paikallisesti. Testit käyttävät vakioituja API-vastauksia.
- GitHub Actions [ajo 43901002492](https://github.com/MiroKur/K-ytt-liittym-projekti/actions/runs/43901002492), commit `8b28797`: build, yksikkötestit ja molempien selainten Playwright-ajot onnistuivat.
- `git diff --check`: onnistui.
- `npm run preview`: tuotantokoonti avautui Chromiumissa, myös suora hash-reitti `#/recipe/52771` latasi reseptin.
- Oikea TheMealDB, Chromium ilman mock-vastauksia: englanninkielinen Arrabiata-haku; Chicken-kategoria ja tyhjennys; haun ja kategorian keskinäinen tyhjennys; resepti, ainesosat, määrät ja ohje; suosikin lisäys, päivityksessä säilyminen, avaaminen ja poisto; paluu hakutuloksiin; suora URL, päivitys sekä selaimen takaisin ja eteen. Sivun JavaScript-virheitä tai epäonnistuneita verkkopyyntöjä ei havaittu lopullisella ajokerralla (Reactin kehitystilan perutut pyynnöt rajattiin pois).
- Ympäristön HTTPS-välityspalvelin aiheutti Chromiumissa `ERR_CERT_AUTHORITY_INVALID`; oikean API:n tarkistuksessa selainkontekstissa ohitettiin varmennevirheet. Sovelluksen asetuksia ei muutettu. Tämä on testin ympäristörajaus.
- Vakioidut testit kattavat muun muassa tyhjän haun ja tuloksen, puuttuvan kuvan, tallennuksen luku- ja kirjoitusvirheet, API-virheen ja uudelleenyrityksen, viivästyneen vastauksen sekä näppäimistöhaun ja näkyvän kohdistuksen. Koko pääpolkua ei ole vielä varmennettu yksinomaan näppäimistöllä eikä ruudunlukijalla.

## Avoinna

Figma-vertailu, koko näppäimistö- ja ruudunlukijapolku, ulkopuolinen käyttäjätesti, demo, video, itsearviointi ja Moodle-palautus vaativat edelleen tarkistuksen tai tekemisen. Julkaisua tai yhdistämistä ei tehty tämän työskentelykerran aikana. Aiemman 2.11.2026 toteutusvaiheen tiedot ovat Git-historiassa.
