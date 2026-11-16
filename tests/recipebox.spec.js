import { test, expect } from "@playwright/test";
const meal = {
  idMeal: "52772",
  strMeal: "Test Chicken",
  strCategory: "Chicken",
  strArea: "British",
  strMealThumb: "",
  strIngredient1: "Chicken",
  strMeasure1: "500 g",
  strInstructions: "Prepare the chicken.\nCook until done.",
};
async function mockApi(page) {
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("**/api/json/v1/1/**", (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("categories.php"))
      return route.fulfill({
        json: {
          categories: [{ strCategory: "Chicken" }, { strCategory: "Pasta" }],
        },
      });
    return route.fulfill({
      json: { meals: url.searchParams.get("s") === "nothing" ? null : [meal] },
    });
  });
}
async function search(page, query = "chicken") {
  await page.getByLabel("Mitä tänään syötäisiin?").fill(query);
  await page.getByRole("button", { name: "Hae reseptejä" }).click();
}
test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await page.goto("/");
});
test("etusivu ja tyhjä haku", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Seuraava lempiruokasi",
  );
  await search(page, "   ");
  await expect(page.getByRole("alert")).toContainText("Kirjoita hakusanaksi");
  await expect(page.getByLabel("Mitä tänään syötäisiin?")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});
test("haku, reseptitiedot, suosikin pysyvyys ja poisto", async ({ page }) => {
  await search(page);
  await expect(
    page.getByRole("heading", { name: "Test Chicken" }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Test Chicken.*Katso resepti/ }).click();
  await expect(page.getByRole("heading", { name: "Ainesosat" })).toBeVisible();
  await expect(page.getByText("500 g")).toBeVisible();
  await expect(page.getByText("Prepare the chicken.")).toBeVisible();
  await page
    .getByRole("button", { name: "Lisää suosikkeihin: Test Chicken" })
    .click();
  await expect(
    page.getByRole("button", { name: "Poista suosikeista: Test Chicken" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: /Suosikit/ }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Test Chicken" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("recipebox.favorites.v1")).length,
    ),
  ).toBe(1);
  await page
    .getByRole("button", { name: "Poista suosikeista: Test Chicken" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Ei vielä suosikkeja" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Ei vielä suosikkeja" }),
  ).toBeVisible();
});
test("kategoria ja nimihaku ovat vaihtoehtoisia, paluu säilyttää haun", async ({
  page,
}) => {
  await search(page);
  await page.getByLabel("Tai selaa kategorioita").selectOption("Pasta");
  await expect(page.getByLabel("Mitä tänään syötäisiin?")).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Pasta", exact: true }),
  ).toBeVisible();
  await search(page, "chicken");
  await expect(page.getByLabel("Tai selaa kategorioita")).toHaveValue("");
  await page.getByRole("link", { name: /Test Chicken.*Katso resepti/ }).click();
  await page.getByRole("link", { name: "Takaisin resepteihin" }).click();
  await expect(page.getByLabel("Mitä tänään syötäisiin?")).toHaveValue(
    "chicken",
  );
  await page.getByLabel("Tai selaa kategorioita").selectOption("");
  await expect(
    page.getByRole("heading", { name: "Mistä aloitetaan?" }),
  ).toBeVisible();
});
test("tyhjä tulos", async ({ page }) => {
  await search(page, "nothing");
  await expect(
    page.getByRole("heading", { name: "Reseptejä ei löytynyt" }),
  ).toBeVisible();
});
test("verkkovirhe ja uudelleenyritys", async ({ page }) => {
  let failed = true;
  await page.route("**/search.php?*", (route) =>
    failed ? route.abort() : route.fulfill({ json: { meals: [meal] } }),
  );
  await search(page);
  await expect(page.getByRole("alert")).toContainText(
    "Reseptien haku epäonnistui",
  );
  failed = false;
  await page.getByRole("button", { name: "Yritä uudelleen" }).click();
  await expect(
    page.getByRole("heading", { name: "Test Chicken" }),
  ).toBeVisible();
});
test("vioittunut localStorage ja puuttuva kuva eivät kaada sovellusta", async ({
  page,
}) => {
  await page.evaluate(() =>
    localStorage.setItem("recipebox.favorites.v1", "{broken"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "suosikkeja ei voitu lukea",
  );
  await search(page);
  await expect(
    page.getByRole("img", { name: "Kuva puuttuu: Test Chicken" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Lisää suosikkeihin: Test Chicken" })
    .click();
  await expect(
    page.getByRole("button", { name: "Poista suosikeista: Test Chicken" }),
  ).toBeVisible();
});
test("estetty tallennus säilyttää suosikin muistissa ja varoittaa", async ({
  page,
}) => {
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await search(page);
  await page
    .getByRole("button", { name: "Lisää suosikkeihin: Test Chicken" })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "vain tämän käyttökerran",
  );
  await page.getByRole("link", { name: /Suosikit/ }).click();
  await expect(
    page.getByRole("heading", { name: "Test Chicken" }),
  ).toBeVisible();
});
test("hidas vanha vastaus ei korvaa uutta hakua", async ({ page }) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("**/search.php?s=old", async (route) => {
    await gate;
    await route
      .fulfill({ json: { meals: [{ ...meal, strMeal: "Old result" }] } })
      .catch(() => {});
  });
  await search(page, "old");
  await expect(
    page.getByRole("heading", { name: "Haetaan reseptejä…" }),
  ).toBeVisible();
  await search(page, "new");
  await expect(
    page.getByRole("heading", { name: "Test Chicken" }),
  ).toBeVisible();
  release();
  await expect(page.getByRole("heading", { name: "Old result" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("heading", { name: "Hakutulokset: new" }),
  ).toBeVisible();
});
test("virheellinen API ja puuttuva resepti", async ({ page }) => {
  await page.route("**/search.php?*", (route) =>
    route.fulfill({ json: { unexpected: true } }),
  );
  await search(page);
  await expect(page.getByRole("alert")).toContainText(
    "Reseptien haku epäonnistui",
  );
  await page.route("**/lookup.php?*", (route) =>
    route.fulfill({ json: { meals: null } }),
  );
  await page.goto("/#/recipe/999");
  await expect(
    page.getByRole("heading", { name: "Reseptiä ei löytynyt" }),
  ).toBeVisible();
});
test("kategorioiden virhe ei estä nimihakua", async ({ page }) => {
  await page.route("**/categories.php", (route) => route.abort());
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "Kategorioita ei voitu ladata",
  );
  await search(page);
  await expect(
    page.getByRole("heading", { name: "Test Chicken" }),
  ).toBeVisible();
});
for (const width of [390, 768, 1440]) {
  test(`päänäkymät ilman vaakavieritystä ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const fits = async () =>
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    await fits();
    await search(page);
    await fits();
    await page
      .getByRole("link", { name: /Test Chicken.*Katso resepti/ })
      .click();
    await expect(
      page.getByRole("heading", { name: "Ainesosat" }),
    ).toBeVisible();
    await fits();
    await page
      .getByRole("button", { name: "Lisää suosikkeihin: Test Chicken" })
      .click();
    await page.getByRole("link", { name: /Suosikit/ }).click();
    await fits();
  });
}
test("näppäimistöllä haku ja näkyvä kohdistus", async ({ page }) => {
  await page.getByLabel("Mitä tänään syötäisiin?").focus();
  await page.keyboard.type("chicken");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Hae reseptejä" }),
  ).toBeFocused();
  expect(
    await page
      .getByRole("button", { name: "Hae reseptejä" })
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Test Chicken" }),
  ).toBeVisible();
});
