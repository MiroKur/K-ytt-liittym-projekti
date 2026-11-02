# RecipeBox

SAMK käyttöliittymäprojekti kurssin repo. Tekijä: Miro Kuronen. Yksilöprojekti, palautuspäivä 14.12.2026.

RecipeBox on suomenkielinen, responsiivinen ruokareseptisovellus. Ensimmäinen toteutus sisältää nimihaku-, kategoriaselaus-, reseptitieto- ja suosikkitoiminnot. Reseptisisältö tulee TheMealDB:stä englanniksi. Nimihaku käyttää englanninkielisiä reseptinimiä.

## Ominaisuudet

- Nimihaku ja kategoriavalinta ovat vaihtoehtoisia: uusi haku poistaa kategoriavalinnan ja kategorian valinta tyhjentää haun.
- Reseptin kuva, nimi, ainesosat, määrät ja valmistusohje. Tarkat tiedot haetaan avattaessa myös kategoriatuloksista.
- Suosikkien lisäys, poisto ja pysyvyys samalla selaimella. Tallennusvirhe ei estä käyttöä.
- Lataus-, tyhjä- ja virhetilat sekä uudelleenyritys. Vanha verkkovastaus ei korvaa uutta hakua.
- Suomenkielinen navigaatio, näppäimistökäyttö, näkyvät kohdistukset ja suosikkien saavutettava tilailmoitus.

Ei kirjautumista, backend-palvelinta, omaa tietokantaa, AI-toimintoja, ostoslistaa tai viikkosuunnitelmaa.

## Asennus ja käynnistys

Tarvitset Node.js 22.12+ (suositus Node 24 LTS) ja npm:n. Tässä työympäristössä Node 24.22.1, npm 11.9.0 ja Git 2.51.1.

```bash
git clone https://github.com/MiroKur/K-ytt-liittym-projekti.git
cd K-ytt-liittym-projekti
git switch feature/recipebox-mvp
npm ci
npm run dev
```

Avaa terminaalin näyttämä osoite, tavallisesti http://localhost:5173. Node toimii kehitystyökaluna; sovelluksella ei ole omaa backendia.

```bash
npm run build
npm run preview
```

Tuotantotiedostot syntyvät `dist/`-kansioon. HashRouter ja suhteellinen Vite `base` mahdollistavat staattisen alihakemistohostauksen ilman palvelimen reittiuudelleenkirjoituksia. Julkista demoa ei ole vielä julkaistu.

## Rakenne

```text
src/
  components/    Navigaatio, haku, kategoriat, kortit, kuvat ja tilaviestit
  pages/         Home, RecipeDetails ja Favorites
  services/      TheMealDB-kutsut ja vastausten normalisointi
  hooks/         Suosikit ja peruttavat verkkopyynnöt
  styles/        Responsiivinen CSS
  main.jsx       React-juuri ja reititys
tests/           Playwright-käyttäjäpolut vakioiduilla vastauksilla
docs/            Alkuperäinen projektisuunnitelma ja toteutuksen seuranta
```

## API ja tallennus

Palvelumoduuli `src/services/mealdb.js` käyttää virallisia V1-päätepisteitä `search.php?s=`, `categories.php`, `filter.php?c=` ja `lookup.php?i=`. Julkinen kehitys-/opetusavain `1` ei ole salaisuus. Sovellukseen ei tarvita `.env`-tiedostoa. Salaisia avaimia ei tule koskaan lisätä selaimeen päätyvään koodiin.

API:n ehdot ja jatkojulkaisun tarkistus: [docs/API.md](docs/API.md). Datalähde näytetään myös käyttöliittymän alatunnisteessa. Hakua ei lähetetä jokaisella näppäinpainalluksella.

Suosikit tallennetaan avaimeen `recipebox.favorites.v1` (ID, nimi ja kuvan URL). Ne ovat selain-, sivusto- ja laitekohtaisia eivätkä synkronoidu. Selaimen tietojen tyhjennys voi poistaa ne. Reseptien tarkat tiedot vaativat verkkoyhteyden. Viallisen sisällön lukeminen käsitellään turvallisesti; estetty kirjoitus säilyttää muutoksen muistissa vain käyttökerran ajan ja näyttää varoituksen. Usean välilehden samanaikaista muokkausta ei synkronoida.

## Testit

```bash
npx playwright install chromium firefox
npm test
npm run test:unit
# Tarvittaessa Linuxissa järjestelmäriippuvuudet:
npx playwright install-deps chromium firefox
# Vuorovaikutteinen testinäkymä:
npm run test:ui
```

Testit käynnistävät Viten itse ja käyttävät vakioituja API-vastauksia. Ne kattavat pääpolun, tallennuksen, virhetilanteet, nopeat haut, näppäimistöhaun ja 390/768/1440 px näkymät. Oikea API on tarkistettava lisäksi erikseen. Toteutuneet testitulokset ja rajaukset: [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md).

## Projektin linkit ja kurssitehtävät

- [GitHub](https://github.com/MiroKur/K-ytt-liittym-projekti)
- [Jira RK](https://insinoori-opinnot-24-28.atlassian.net/jira/core/projects/RK/list?jql=project%20%3D%20RK%20ORDER%20BY%20cf%5B10019%5D%20ASC)
- [Projektisuunnitelma](docs/RecipeBox_projektisuunnitelma.docx)
- Figma: linkki puuttuu; mobiili- ja työpöytäprototyyppi on avoin kurssitehtävä. Toteutuksen visuaalinen ilme on alustava.
- Demo ja esittelyvideo: ei vielä julkaistu.

Uusin toimeksianto valitsee tehtävienhallintaan Jiran; alkuperäisen Word-suunnitelman Todoist/GitHub Projects -ehdotusta ei muutettu alkuperäistiedostossa. [Jiraan siirrettävät tehtävät](docs/JIRA.md). Moodle-palautuksia ei ole tehty tämän toteutuksen yhteydessä.
