// Regression for opening and completing Day 1 without an AI account.
const assert = require("node:assert/strict");
const { open } = require("./harness");

(async () => {
  const { page, log, close } = await open({
    v16: true,
    time: "2026-11-21T09:00:00+02:00",
    viewport: { width: 390, height: 844 },
    state: null,
    localStorage: { ix_life_v1: { mins: 60, stop: "23:59", off: 5 } },
  });
  let aiCalls = 0;
  await page.route("https://openrouter.ai/**", (route) => {
    aiCalls++;
    return route.abort();
  });

  try {
    await page.getByRole("heading", { name: "Oesophagus and stomach" }).waitFor();
    assert.match(await page.locator(".ixQlead").innerText(), /Day 1/);
    assert.match(await page.locator(".ixQprogress").innerText(), /0 of 3/);

    await page.locator("#ixNav [data-xm=more]").click();
    await page.getByRole("button", { name: "Close navigation" }).click();
    assert.equal(await page.locator("#ixNav [data-xm=more]").evaluate((b) => b === document.activeElement), true);

    await page.locator(".ixZgo").click();
    await page.locator(".ixS [data-s=open]").click();
    await page.getByRole("heading", { name: "Recognise the transition" }).waitFor();
    const answer = page.locator(".ixLpart button.ixYspoil");
    await answer.press("Enter");
    assert.equal(await answer.getAttribute("aria-expanded"), "true");
    assert.match(await answer.innerText(), /bolus can abrade/);

    const drawing = page.locator(".ixLpart [data-zoom]");
    await drawing.click();
    await page.getByRole("button", { name: "Zoom in" }).click();
    assert.equal(await page.getByRole("button", { name: "Zoom out" }).getAttribute("aria-pressed"), "true");
    await page.keyboard.press("Escape");
    assert.equal(await drawing.evaluate((b) => b === document.activeElement), true);

    for (let part = 0; part < 5; part++) await page.locator(".ixL [data-a=next]").click();
    await page.locator(".ixL [data-a=finish]").click();
    await page.getByRole("button", { name: "Close lesson" }).click();
    assert.match(await page.locator(".ixQprogress").innerText(), /1 of 3/);

    await page.locator(".ixZgo").click();
    await page.locator(".ixS [data-s=open]").click();
    await page.getByRole("heading", { name: "Lesson knowledge check" }).waitFor();
    for (const correct of "bcadbc") {
      await page.locator("#ixBq input[value=" + correct + "]").check();
      await page.locator("#ixBq [data-c=sure]").click();
      await page.locator("#ixBn").click();
    }
    assert.match(await page.locator("#ixBq").innerText(), /6 \/ 6/);

    await page.locator(".ixSbar [data-s=done]").click();
    await page.locator(".ixS [data-s=open]").click();
    const draft = "Chief cells sit in gastric glands.";
    await page.locator("#ixTea").fill(draft);
    await page.locator("#ixTref").click();
    assert.ok((await page.locator(".ixTreference").innerText()).trim());
    await page.reload();
    await page.locator(".ixSbar [data-s=screen]").click();
    await page.locator(".ixS [data-s=open]").click();
    assert.equal(await page.locator("#ixTea").inputValue(), draft);
    await page.locator(".ixSbar [data-s=done]").click();
    await page.getByRole("heading", { name: "Done for today." }).waitFor();

    assert.equal(aiCalls, 0);
    assert.deepEqual(log.errors, []);
    console.log("PASS November Day 1 without an AI account");
  } finally {
    await close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
