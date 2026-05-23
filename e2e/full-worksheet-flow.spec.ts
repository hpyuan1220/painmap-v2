import { expect, type Locator, type Page, test } from "@playwright/test";

const NEXT = "走下一張卡 →";

async function continueTo(page: Page, expectedPath: string, buttonName = NEXT) {
  const cta = page.getByRole("button", { name: buttonName });
  await expect(cta).toBeEnabled();
  await cta.click();
  await expect(page).toHaveURL(expectedPath);
}

async function fillLabel(page: Page, label: string, value: string, index = 0) {
  const fields = page.getByLabel(label);
  await expect(fields.nth(index)).toBeVisible();
  await fields.nth(index).fill(value);
}

async function fillAllByLabel(page: Page, label: string, values: string[]) {
  const fields = page.getByLabel(label);
  await expect(fields).toHaveCount(values.length);
  for (let i = 0; i < values.length; i += 1) {
    await fields.nth(i).fill(values[i]);
  }
}

async function addItemsToList(scope: Page | Locator, addLabel: string, values: string[]) {
  for (let i = 0; i < values.length; i += 1) {
    await scope.getByRole("button", { name: addLabel }).click();
  }
  const boxes = scope.getByRole("textbox");
  const count = await boxes.count();
  for (let i = 0; i < values.length; i += 1) {
    await boxes.nth(count - values.length + i).fill(values[i]);
  }
}

test.describe("Full worksheet flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("fills every card, advances through all CTAs, and enables final delivery", async ({
    page,
  }) => {
    await page.goto("/learn/worksheet/01");

    await expect(page.getByRole("button", { name: NEXT })).toBeDisabled();
    await fillLabel(page, "那句脫口而出的話", "我每週六晚上要寫 30 個學生的家長 LINE，真的很累。");
    await fillLabel(page, "是誰說的", "林老師");
    await fillLabel(page, "你跟他的關係", "補習班同行");
    await fillLabel(page, "大概什麼時候說的", "2026-05-20");
    await fillLabel(page, "當時的場景", "週六晚上補習班下班後在書桌前");
    await continueTo(page, "/learn/worksheet/02");

    await fillLabel(page, "地點", "辦公室");
    await fillLabel(page, "當下心情", "疲累");
    await fillLabel(page, "是什麼觸發了這一刻？", "看到家長訊息又堆滿。");
    await fillLabel(page, "自由書寫", "他說自己每次回家都還要回訊息，完全不像下班。");
    await continueTo(page, "/learn/worksheet/03");

    await fillAllByLabel(page, "方向的名字", ["下班界線", "溝通成本", "紀錄壓力"]);
    await fillAllByLabel(page, "為什麼這條值得聽", [
      "這條看見老師下班後仍被訊息追著跑。",
      "這條看見家長和老師之間沒有共同格式。",
      "這條看見每次都要重新整理學生狀態。",
    ]);
    await fillAllByLabel(page, "這條方向在意的是什麼", [
      "下班後能不能真的休息",
      "彼此期待能不能更清楚",
      "紀錄能不能少重複",
    ]);
    await page.getByLabel("第 1 條路").check();
    await continueTo(page, "/learn/worksheet/04");

    await fillLabel(page, "你這一輪想問的問題", "為什麼週六晚上最容易爆掉？", 0);
    await fillLabel(page, "我從這輪聽到了什麼", "他其實不是討厭家長，而是沒有休息邊界。", 0);
    await page.getByRole("button", { name: "＋ 再跑一輪" }).click();
    await fillLabel(page, "你這一輪想問的問題", "如果訊息少一半會怎樣？", 1);
    await fillLabel(page, "我從這輪聽到了什麼", "真正卡住的是每次都要重新解釋同樣的事。", 1);
    await continueTo(page, "/learn/worksheet/05");

    await fillLabel(
      page,
      "用你自己的話寫一段摘要",
      "林老師週六晚上最卡住的不是單一訊息，而是下班後仍被家長訊息拉回工作狀態。他想好好回覆，也想保有休息時間，但目前沒有一個清楚界線。",
    );
    await fillLabel(page, "用那個人會講的話，再說一次", "我不是不想回，只是我也需要下班。");
    await fillLabel(page, "為什麼是這條路，不是另外兩條？", "這條最接近他反覆提到的疲累和失控感。");
    await continueTo(page, "/learn/worksheet/06");

    await fillLabel(page, "心裡想什麼", "又來了，我是不是永遠不能下班？");
    await fillLabel(page, "感受", "煩、累、又有點愧疚。");
    await fillLabel(page, "嘴上會說什麼", "好，我晚點回你。");
    await fillLabel(page, "行為上會做什麼", "打開手機開始整理學生狀況。");
    await fillLabel(page, "卡在哪", "想負責但沒有邊界。");
    await fillLabel(page, "希望得到", "被理解，也能有固定回覆節奏。");
    await continueTo(page, "/learn/worksheet/07");

    await fillLabel(page, "卡點公式", "我每次要下班休息，都會卡在家長訊息突然進來。");
    await page.getByRole("button", { name: "＋ 加一個解法" }).click();
    await page.getByRole("button", { name: "＋ 再加一個解法" }).click();
    await page.getByRole("button", { name: "＋ 再加一個解法" }).click();
    await fillAllByLabel(page, "解法名稱", ["模板回覆", "家長群公告", "學生紀錄表"]);
    await fillAllByLabel(page, "一句話描述", [
      "預先準備常見狀況的回覆句。",
      "把共通訊息一次公告給家長。",
      "把每位學生的狀態集中記錄。",
    ]);
    await fillAllByLabel(page, "為什麼？（具體說一兩句，不要只寫「沒用」）", [
      "模板能省時間，但臨時狀況還是會打斷休息。",
      "公告能降低重複訊息，但個別家長還是會私訊。",
      "紀錄表有幫助，但如果下班後仍要更新就沒有解決邊界。",
    ]);
    await continueTo(page, "/learn/worksheet/08");

    await fillLabel(page, "A 端：他想要這個", "對家長負責");
    await fillLabel(page, "B 端：他也想要這個", "下班後休息");
    await page.getByLabel("我會選 B").check();
    await fillLabel(page, "為什麼", "如果沒有休息，長期會連教學品質都被拖垮。");
    await continueTo(page, "/learn/worksheet/09");

    await page.getByLabel("其他（手動找）").check();
    await fillLabel(page, "來源", "教師論壇：補習班老師下班後訊息討論", 0);
    await fillLabel(page, "引用片段（不能只貼連結）", "很多老師說晚上十點後還會收到家長訊息。", 0);
    await fillLabel(page, "為什麼這段跟我有關", "同樣是下班後被溝通拉回工作。", 0);
    await page.getByRole("button", { name: "＋ 加一段證據" }).click();
    await page.getByRole("button", { name: "＋ 加一段證據" }).click();
    await fillLabel(page, "來源", "教育新聞：教師工時延伸", 1);
    await fillLabel(page, "引用片段（不能只貼連結）", "行政和溝通工作常常超出課堂時間。", 1);
    await fillLabel(page, "為什麼這段跟我有關", "說明工作外溢不是個案。", 1);
    await fillLabel(page, "來源", "訪談節錄：導師夜間聯絡壓力", 2);
    await fillLabel(
      page,
      "引用片段（不能只貼連結）",
      "老師提到最怕休息時收到需要立刻處理的訊息。",
      2,
    );
    await fillLabel(page, "為什麼這段跟我有關", "呼應休息邊界被打破。", 2);
    await page.getByLabel("看起來是 common pain").check();
    await fillLabel(
      page,
      "一句話寫你看到了什麼",
      "這不是單一老師懶得回，而是工作邊界被訊息工具稀釋。",
    );
    await continueTo(page, "/learn/worksheet/10");

    await fillLabel(page, "這三個人的共同背景", "三位都有補習或課後輔導經驗。");
    await fillAllByLabel(page, "姓名", ["王老師", "陳老師", "張老師"]);
    await fillAllByLabel(page, "聯絡方式", ["LINE wang", "LINE chen", "LINE chang"]);
    await fillAllByLabel(page, "你跟他的關係", ["同行", "前同事", "朋友介紹"]);
    await fillAllByLabel(page, "為什麼想找他聊", [
      "他常處理家長訊息。",
      "他帶過很多國中學生。",
      "他剛換過溝通流程。",
    ]);
    const peopleCards = page.locator("section").filter({ hasText: /^第 [123] 個人/ });
    await expect(peopleCards).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      await addItemsToList(
        peopleCards.nth(i).getByRole("group", { name: "你預先猜他會說的答案（3-5 個）" }),
        "＋ 再加一個猜想",
        [`猜想 ${i + 1}-1`, `猜想 ${i + 1}-2`, `猜想 ${i + 1}-3`],
      );
    }
    await continueTo(page, "/learn/worksheet/11");

    await fillAllByLabel(page, "我目前的假設", [
      "老師在意的是下班界線。",
      "家長其實也不清楚什麼時候適合問。",
    ]);
    await fillAllByLabel(page, "我手上的證據", [
      "抱怨裡反覆提到週六晚上。",
      "多段證據都提到訊息時間混亂。",
    ]);
    await fillAllByLabel(page, "訪談中要聽到什麼，我才會修正", [
      "如果他說真正痛點是內容很難寫。",
      "如果家長其實願意接受固定回覆時間。",
    ]);
    await fillLabel(
      page,
      "偏見自我提醒：我容易帶哪些偏見",
      "我可能太快假設大家都想要工具，而不是流程約定。",
    );
    await continueTo(page, "/learn/worksheet/12");

    await page.getByLabel("王老師").check();
    await page.getByLabel("時間").fill("2026-05-21T10:00");
    await page.getByLabel("視訊通話").check();
    await page.getByLabel("已取得對方做訪談記錄的同意（建議先取得對方同意再做記錄）").check();
    await addItemsToList(page.getByRole("group", { name: "印象深刻的原話" }), "＋ 再加一句原話", [
      "我最怕晚上十一點還被問明天小考。",
    ]);
    await addItemsToList(
      page.getByRole("group", { name: "哪些是猜錯的（驚訝）" }),
      "＋ 再加一條驚訝",
      ["他不討厭回覆，只討厭沒有時間邊界。"],
    );
    await addItemsToList(page.getByRole("group", { name: "哪些是猜對的" }), "＋ 再加一條", [
      "確實常在休息時被打斷。",
    ]);
    await addItemsToList(page.getByRole("group", { name: "新的線索" }), "＋ 再加一條", [
      "家長也想知道什麼時間能期待回覆。",
    ]);
    await continueTo(page, "/learn/worksheet/13");

    await fillLabel(page, "主題名", "下班界線被訊息工具稀釋");
    await addItemsToList(
      page.getByRole("group", { name: "支持這個主題的原話" }),
      "＋ 再加一條引用",
      ["我最怕晚上十一點還被問明天小考。"],
    );
    await fillLabel(
      page,
      "用你自己的話寫一段沉澱",
      "這次訪談讓我更確定，林老師卡住的地方不是單純不想回家長，而是訊息工具把下班時間和責任感綁在一起。他需要的可能不是更快回覆，而是讓家長、老師都知道什麼時候會回、什麼事情才需要立刻處理。",
    );
    await addItemsToList(
      page.getByRole("group", { name: "想回頭跟受訪者再 confirm 的問題（member check）" }),
      "＋ 再加一個問題",
      ["如果固定晚上八點前回覆，家長能接受嗎？"],
    );
    await continueTo(page, "/learn/worksheet/result", "走到結尾的 Pain ID 卡片 →");

    await fillLabel(page, "一句話的故事", "老師需要的不是更快回訊息，而是可被尊重的下班邊界。");
    await page.getByLabel("這條故事還想再多聽幾個聲音").check();
    await page
      .getByPlaceholder("想多寫一點關於你的下一步嗎？")
      .fill("再訪談兩位老師和一位家長，確認固定回覆時間是否可行。");

    await expect(
      page.getByRole("button", { name: "帶這張 Pain ID 卡片走（.md） →" }),
    ).toBeEnabled();
    await expect(page.getByRole("button", { name: "下載 JSON 快照" })).toBeEnabled();
    const emailLink = page.getByRole("link", { name: "寄到 hpyuan1220@gmail.com" });
    await expect(emailLink).toHaveAttribute("href", /mailto:hpyuan1220%40gmail.com/);
    await expect(emailLink).toHaveAttribute("href", /PainMap%20Pain%20ID/);
  });
});
