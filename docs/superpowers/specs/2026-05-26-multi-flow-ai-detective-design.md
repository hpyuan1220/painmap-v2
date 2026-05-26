# Multi-Flow AI Detective Worksheet Design

## 背景

目前 APP 已有一條 `/learn/worksheet-lite` 的 6 卡 condensed flow，但卡數、步驟順序、每卡內容、驗證規則與 AI 互動方式大多是寫死在 route 與 helper 中。這造成兩個問題：

1. 無法快速產生多種 worksheet 版本，例如 6 卡版、8 卡版、訪談加強版、AI 深互動版。
2. AI 目前多半只是單次提示，缺少在關鍵時刻扮演「痛點偵探」進行追問、質疑與分流的能力。
3. 目前的 AI 體驗大多停留在顯示建議，而不是真正把卡片內容送去 LLM、拿回可操作結果、再寫回 card。

本次設計的目標不是再做一條新的硬編碼 flow，而是建立一個可支援多版本 worksheet flow 的底層架構，並先附上一個加強版 flow 作為第一個實作版本。

## 目標

- 支援多個 worksheet flow 版本並存。
- 讓每個 flow 的卡數、步驟順序、文案、欄位、驗證規則、AI 行為可以配置。
- 讓 AI 在需要時進入多輪互動，而不是每張卡都強制聊天。
- 讓 AI 的主角色明確定位為「痛點偵探」，優先挑戰假設、辨認真假痛、抓矛盾與指出跳步。
- 讓 AI interaction 成為真正的 round-trip 工具鏈，而不是只顯示 LLM 答案。
- 保持目前 card-based 體驗，採「卡片內嵌小教練」為主、「可展開深聊區」為輔。

## 非目標

- 這一輪不做完整的後台流程編輯器。
- 不把產品改造成以聊天為主體的 chat app。
- 不在第一階段追求完全自由組裝任意欄位 schema 的 low-code builder。
- 不改變 PainMap 的核心任務：使用者是在完成 pain discovery flow，不是在和 AI 漫無目的聊天。

## 使用者體驗方向

### 整體入口

首頁或 worksheet 入口頁應讓使用者選擇 flow 版本，例如：

- 6 卡快速版
- AI 偵探加強版
- 訪談加強版

未來也可支援根據使用者狀態推薦某一種 flow，但第一階段只需要明確列出可選版本。

### 單卡體驗

每張卡分成兩層互動：

1. **主卡內容**
   - 卡片標題、規則、簡介
   - 使用者輸入欄位
   - 返回 / 下一步操作

2. **AI 小教練**
   - 預設收斂成 2 到 4 個輕量操作
   - 例如：`幫我收斂`、`挑戰我的假設`、`指出哪裡太模糊`、`幫我決定下一步`
   - AI 回應預設嵌在卡片內，不跳出獨立聊天主畫面

當系統判定或使用者主動要求 deeper help 時，才展開：

3. **深聊區**
   - 附屬於當前卡片
   - 可進行多輪 AI 互動
   - 對話有明確任務，不是自由閒聊
   - 對話結束時要能將結果回填到欄位或產生「採納 / 不採納」的結論

### 使用者實際操作的 AI 流程

每一次 AI interaction 都應是清楚可操作的流程，而不是單純看回答：

1. 使用者先填入這張卡目前的原始內容。
2. 使用者點一個明確 AI 動作，例如 `幫我收斂`、`挑戰我的假設`、`幫我補缺口`。
3. 系統把以下內容送去 LLM：
   - 當前卡片內容
   - 這張卡的任務說明
   - flow 目標
   - `痛點偵探` prompt
   - 本次 AI 動作類型
4. LLM 回來後，前端不直接整段貼出，而是拆成可操作區塊。
5. 使用者可以：
   - 採用
   - 修改後採用
   - 再追問一輪
   - 忽略
6. 只有被採用的內容，才寫回目前 card 的欄位或 AI 結果槽位。

這樣使用者會清楚知道：AI 不是代答，而是在幫他把這張卡寫得更清楚、更可驗證。

### AI 角色定位

AI 預設人格是「痛點偵探」，不是文案潤飾器。其優先任務排序：

1. 指出使用者把問題講太大、太空、太表面。
2. 抓出使用者前後矛盾或跳步。
3. 區分「真痛 / 假痛 / 還不能判斷」。
4. 指出目前缺少哪種證據或真人樣本。
5. 在必要時才協助改寫，但改寫目的是讓判斷更準，不是更漂亮。

## 方案比較

### 方案 A：延續現有 route 結構，為每個新 flow 再寫一組 pages

優點：
- 速度快
- 對既有程式碼改動小

缺點：
- 很快又會回到 hard-coded
- 每加一個 flow 就複製一次頁面
- AI 互動模型難以共享

### 方案 B：建立 flow configuration layer + shared renderer

優點：
- flow 可配置
- 可共用卡片 UI 結構與 AI interaction shell
- 後續新增 flow 成本低
- 最符合這次需求

缺點：
- 第一階段重構成本較高
- 需要定義一套清楚但不過度複雜的 config schema

### 方案 C：直接做 UI flow builder

優點：
- 長期最靈活

缺點：
- 首輪工程量過大
- 會把焦點從 worksheet 體驗轉移到 builder 本身

### 推薦

採用 **方案 B**。

也就是先建立可配置底層架構，再附上一個「AI 偵探加強版 flow」作為首個配置實例。這能同時滿足可擴充與近期可交付兩個需求。

## 架構設計

### 1. Flow Registry

建立一個 flow registry，負責管理系統中有哪些 flow，例如：

- `worksheet-lite`
- `worksheet-ai-detective`
- 未來的 `worksheet-interview-deep`

每個 flow 至少包含：

- `id`
- `title`
- `description`
- `entryPath`
- `stepCount`
- `steps`
- `resultConfig`

這一層的責任是列出「有哪些 flow」，讓入口頁與 router 能找到對應版本。

### 2. Step Definition Schema

每個 flow 的每一步都應改為由設定定義，而不是由 route 名稱隱含。每個 step 定義至少包含：

- `id`
- `order`
- `label`
- `title`
- `intro`
- `rule`
- `fields`
- `validation`
- `aiMode`
- `aiActions`
- `deepChatEnabled`
- `nextStep`

其中最重要的是：

- `aiMode`
  - `off`
  - `assist`
  - `detective`
  - `required`

- `aiActions`
  - 輕量按鈕列表，例如 `challenge_assumption`, `narrow_scope`, `find_missing_evidence`

- `deepChatEnabled`
  - 是否允許從本卡展開多輪互動

### 3. Shared Card Renderer

建立共用 card renderer，負責根據 step config 組出畫面。它應該處理：

- 卡頭資訊
- 欄位渲染
- validation feedback
- 小教練區塊
- 深聊區展開與收合
- 返回 / 下一步

這樣 route 的責任就會變薄，只剩：

- 讀取當前 flow id 與 step id
- 取出 config
- 交給共用 renderer

### 4. Field Binding Layer

雖然畫面會變成 config-driven，但第一階段不需要重做整個 store schema。比較穩妥的做法是：

- 保留既有 `PainCard` store 作為資料來源
- 讓每個 field config 指向既有資料路徑
- 用 mapping layer 把 config field 與 store path 接起來

這樣可以避免第一輪就同時重構 UI 與資料模型。

### 5. AI Interaction Layer

AI interaction layer 要和一般欄位渲染分開，因為它有自己的狀態與任務類型。

它應支援兩個層級：

- **Inline Coach**
  - 卡內輕量回應
  - 單次 AI 動作，但必須是真正送出到 LLM 再回來
  - 輸出通常是：一個觀察、兩個追問、三個候選收斂方向、或一個「你現在缺什麼」

- **Deep Chat Panel**
  - 卡片附屬的多輪互動區
  - 針對當前卡的任務持續推進
  - 對話狀態必須與當前 step 綁定
  - 每一輪都要保留「寫回卡片 / 不寫回」的明確操作

深聊區必須有明確 completion output，例如：

- `refinedStatement`
- `chosenHypothesis`
- `evidenceGaps`
- `interviewQuestionDrafts`

也就是對話結束後必須能把結果變成結構化輸出，而不是只留對話文本。

### 5.1 LLM Round-Trip Contract

AI interaction 必須走完整資料流：

`card input -> payload orchestration -> LLM -> structured response -> user action -> card write-back`

每次送去 LLM 的 payload 至少包含：

- `flowId`
- `stepId`
- `stepGoal`
- `actionType`
- `currentCardFields`
- `acceptedAiOutputsSoFar`

每次回來的內容至少整理成：

- `observation`
- `challenge`
- `suggestions`
- `followUpQuestions`
- `writeBackCandidates`

其中 `writeBackCandidates` 是候選內容，不是自動覆蓋欄位。

### 5.2 Write-Back Model

AI 回應的價值在於幫使用者把內容帶回卡片，因此每輪互動至少要支援：

- `accept`
  - 直接採用某個候選輸出並寫回指定欄位
- `edit_then_accept`
  - 使用者先改一版，再寫回欄位
- `reject`
  - 不寫回，只當參考
- `continue`
  - 以上一輪結果再追問

## 第一個加強版 Flow 設計

### 名稱

`AI 偵探加強版`

### 定位

給需要更多挑戰與追問的使用者，重點不是更快填完，而是更高機率抓出假痛、模糊痛、跳步痛。

### 建議步驟

第一版可先做 8 卡，而不是直接從 6 卡跳到過度細碎的 10+ 卡。

建議順序：

1. 原句抱怨
   - 收原句
   - AI 偵測是否太抽象

2. 範圍收斂
   - 從大問題縮到一個場景
   - AI 挑戰「你是不是講太大」

3. 真正卡點
   - 不是抱怨什麼，而是卡在哪一步
   - AI 追問「哪一步真的動不了」

4. 現有 workaround
   - 現在怎麼硬撐
   - AI 挑戰「這是沒有工具，還是沒有共識」

5. 兩難取捨
   - 找出真正不能失去的那一邊
   - AI 抓前後矛盾

6. 市場證據
   - 找公開證據
   - AI 幫你分辨哪些不是同一類痛

7. 真人樣本
   - 選 3 個可接觸的人
   - AI 協助判斷樣本是否偏掉，但不代填名字

8. 訪談與 verdict
   - 寫訪談題
   - 做真假痛判斷
   - AI 挑戰是否已經下結論太早

### 第一個加強版 Flow 的使用者流程

這條 flow 不應是「填卡 -> 看 AI 回答 -> 下一張」，而應是：

1. 使用者先寫當前卡片內容。
2. AI 小教練顯示 2 到 4 個可按的操作。
3. 使用者選一個操作後，系統送本卡上下文到 LLM。
4. LLM 回來後，前端把結果拆成：
   - 偵探觀察
   - 風險提醒
   - 候選改寫
   - 下一輪追問
5. 使用者決定是否採用某個候選內容。
6. 如果採用，內容立即寫回目前卡片。
7. 如果還不夠清楚，再展開深聊區。
8. 完成本卡後進下一卡。

所以這個 user flow 的重點是：

- AI 幫忙看盲點
- 使用者對 AI 結果做決策
- 被採用的內容寫回卡片
- 卡片因而逐步變好

### 為什麼不是每卡都深聊

因為這會讓使用者疲勞，且會模糊主流程。設計上應採：

- 預設輕互動
- 條件式深聊

深聊觸發條件示例：

- 使用者答案過短或太抽象
- 同一卡內前後矛盾
- 點了 `挑戰我的假設`
- 點了 `我卡住了`
- 系統偵測現在不適合直接去下一步

## 路由與資訊架構

建議將路由改為 flow-aware，而不是只針對 lite 寫死。

方向例如：

- `/learn/:flowId`
- `/learn/:flowId/:stepId`
- `/learn/:flowId/result`

這樣之後新增 flow，不需要新增整串硬編碼 route 檔名。

若現有 TanStack route 生成方式讓完全動態路由過於昂貴，第一階段也可以採折衷方案：

- 保留 route 層
- 但 route 只做 thin wrapper，實際步驟內容由 flow config 驅動

## 驗證與錯誤處理

### Validation

Validation 應從 step config 讀取，而不是每頁自己寫 if 條件。每一步至少支援：

- 必填
- 最短字數
- 至少 N 個項目
- 選項必選
- 條件式驗證

### AI 錯誤處理

當 AI 動作失敗時：

- 不阻塞整張卡
- 顯示簡短錯誤訊息
- 保留使用者已填內容
- 允許重試或跳過

深聊區失敗時：

- 不應吃掉歷史內容
- 應保留上一次已完成的結構化輸出
- 不應清空先前已採用並寫回卡片的內容

## 測試策略

第一階段至少需要覆蓋：

- flow registry 能正確列出 flow
- step config 順序與跳轉正確
- shared renderer 能依 config 顯示對應欄位
- validation 規則正確阻止 / 放行下一步
- AI 小教練在不同 `aiMode` 下顯示正確
- 深聊區開關與結果回填正確
- LLM 回應能正確整理為 `writeBackCandidates`
- 使用者採用 / 修改後採用 / 忽略時，card state 更新正確
- 不同 flow 間切換不會污染資料

## 實作切分建議

為降低風險，建議分兩段：

### 第一段：底層架構重整

- 建立 flow registry
- 建立 step config schema
- 建立 shared renderer
- 把現有 6 卡版遷移到 config-driven

### 第二段：AI 偵探加強版 flow

- 新增一個 8 卡 flow config
- 為關鍵卡片加入 inline coach
- 為需要深挖的卡加入 deep chat panel

## 開放問題與決策

本 spec 先做以下決策：

- 支援多 flow 版本並存
- 優先做底層架構，而不是先做 builder
- AI 主角色是「痛點偵探」
- 互動形態採「卡片內嵌小教練 + 可展開深聊區」
- 深聊是按需觸發，不是每卡強制多輪
- 第一個加強版 flow 採 8 卡方向

後續進入 implementation plan 前，仍需在實作層明確決定：

- 現有 `PainCard` store 要延用多少、抽象多少
- 深聊訊息與結構化輸出如何存到 store
- route 動態化要走到什麼程度

## 成功標準

完成後，系統應能做到：

- 使用者可以看到不只一種 worksheet flow
- 新增一個 flow 主要是新增 config，而不是複製整套頁面
- 單卡能同時支援表單輸入與 AI 偵探互動
- AI 可以在必要時進入多輪，但不會搶走主流程
- AI 回應不是只顯示答案，而是可被採用並寫回卡片
- 團隊後續可以調整卡數與步驟，而不必再次大規模重寫 route/page
