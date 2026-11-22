// Regression for opening and completing Day 1 without an AI account.
const assert = require("node:assert/strict");
const { open } = require("./harness");

(async () => {
  const { page, log, close } = await open({
    v16: true,
    time: "2026-11-22T09:00:00+02:00",
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

    await page.locator(".ixZgo").click();   // v36: one tap opens today's first item directly (course mode)
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

    while (await page.locator(".ixL [data-a=next]").count()) await page.locator(".ixL [data-a=next]").click();   // v38: the lesson also ends with a worked case and a brain dump
    await page.locator(".ixL [data-a=finish]").click();   // finishing the lesson ticks it and opens the next item
    // v41: with Team Ehsan's keyed histology questions the unit now has real past-paper MCQs, so step 2 is "10 MCQs"
    await page.locator(".ixHq").waitFor();
    assert.match(await page.locator(".ixSbar").innerText(), /step 2\/3/i);
    for (let k = 0; k < 10 && await page.locator(".ixHq .ixHopt").count(); k++) {
      const key = await page.evaluate(() => { const id = document.querySelector(".ixHq").dataset.qid; return IX_GIT206.mcq.find((q) => q.id === id).answerKeys[0]; });
      await page.locator(".ixHq [data-c=sure]").click();
      await page.locator('.ixHq .ixHopt[data-k="' + key + '"]').click();
      assert.match(await page.locator(".ixHverdict").innerText(), /Right/);
      await page.locator("[data-next]").click();
    }
    assert.match(await page.locator(".ixHbig").innerText(), /10 \/ 10/);

    await page.locator(".ixSbar [data-s=done]").click();   // Done opens the written step straight away
    const draft = "Chief cells sit in gastric glands.";
    await page.locator("#ixTea").fill(draft);
    await page.locator("#ixTref").click();
    assert.ok((await page.locator(".ixTreference").innerText()).trim());
    await page.reload();
    await page.locator(".ixSbar [data-s=resume]").click();
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
