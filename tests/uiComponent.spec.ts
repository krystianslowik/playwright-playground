import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test.describe("Form layout", async () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form layouts").click();
  });

  test("input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "using the grid" })
      .getByRole("textbox", { name: "email" });

    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test@test2.com", {
      delay: 100,
    });

    //generic assortion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test@test2.com");

    //locator assortion
    await expect(usingTheGridEmailInput).toHaveValue("test@test2.com");
  });

  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "using the grid",
    });

    // await usingTheGridForm.getByLabel("Option 1").check({ force: true }); //not work as it's visualy-hidden
    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });

    //generic assortion
    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked();

    expect(radioStatus).toBeTruthy();

    //!locator assortion awaiting expect
    await expect(
      usingTheGridForm.getByRole("radio", { name: "Option 1" })
    ).toBeChecked();

    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });

    //!generic assortion
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy();
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy();
  });
});

test.describe("checkboxes", async () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Toastr").click();
  });

  test("should modify checkbox", async ({ page }) => {
    // metoda dla debili
    await page
      .getByRole("checkbox", { name: "Hide on click" })
      .click({ force: true });

    //check determinates value
    await page
      .getByRole("checkbox", { name: "Hide on click" })
      .uncheck({ force: true });

    await page
      .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
      .check({ force: true });

    const allCheckBoxes = await page.getByRole("checkbox");

    //select
    for (const checkbox of await allCheckBoxes.all()) {
      await checkbox.check({ force: true });
      expect(await checkbox.isChecked()).toBeTruthy();
    }
    //un-select
    for (const checkbox of await allCheckBoxes.all()) {
      await checkbox.uncheck({ force: true });
      expect(await checkbox.isChecked()).toBeFalsy();
    }
  });
});

test.describe("dropdown & menu", async () => {
  test("splitted dropdown", async ({ page }) => {
    // const modeButton = await page.getByRole("button", { name: "Light" });
    const modeButton = await page.locator("ngx-header nb-select");
    await modeButton.click();

    const optionList = await page.locator("nb-option-list nb-option");

    await expect(optionList).toHaveText([
      "Light",
      "Dark",
      "Cosmic",
      "Corporate",
    ]);

    await optionList.filter({ hasText: "Cosmic" }).click();

    const header = await page.locator("nb-layout-header");
    // optionList.getByText("Cosmic").click();
    await expect(page.locator("body")).toHaveClass(/nb-theme-cosmic/);
    await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

    const themes = {
      Light: "rgb(255, 255, 255)",
      Dark: "rgb(34, 43, 69)",
      Cosmic: "rgb(50, 50, 89)",
      Corporate: "rgb(255, 255, 255)",
    };
    await modeButton.click();

    for (const theme in themes) {
      await optionList.filter({ hasText: theme }).click();
      await expect(header).toHaveCSS("background-color", themes[theme]);
      if (theme !== "Corporate") await modeButton.click();
    }
  });
});
