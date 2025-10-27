// --- Robust normalizer: accepteert object of string met/of zonder ```json fences ---
  function normalizeAiJson(content) {
    if (content == null) throw new Error("Lege content");
    if (typeof content === "object") return content;

    let s = String(content).trim();
    s = s.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    s = s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
    return JSON.parse(s);
  }

// --- Veilig lezen van (mogelijk lege) responses ---
  async function readMaybeJson(res) {
    if (res.status === 204) return null;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    const text = await res.text();
    if (!text) return null;
    if (ct.includes("application/json")) {
      try { return JSON.parse(text); } catch { return text; }
    }
    return text;
  }

  let lastAIContent = null;

// Ophalen van AI-antwoord
  document.getElementById("submit_ai_button").addEventListener("click", async () => {
  try {
    document.getElementById("submit_ai_spinner").style.display = 'flex';

    const text = (document.getElementById("input_ai_field").value || "").trim();
    if (!text) {
      alert("Vul eerst een prompt in.");
      return;
    }

    const res = await fetch("https://datatosharefunctions.azurewebsites.net/api/OpenAI", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ prompt: text })
    });

    // Nettere foutmelding bij non-2xx
    let payloadText = await res.text();
    let payload;
    try { payload = JSON.parse(payloadText); } catch { payload = { _raw: payloadText }; }

    if (!res.ok) {
      const msg = (payload && (payload.error || payload.message)) ? (payload.error || payload.message) : `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = payload;
    lastAIContent = data?.content ?? data?.choices?.[0]?.message?.content ?? data;

    document.getElementById("ai_response").textContent =
      (typeof lastAIContent === "string")
        ? lastAIContent
        : "```json\n" + JSON.stringify(lastAIContent, null, 2) + "\n```";

    } catch (e) {
        console.error(e);
        alert("Kon AI-antwoorden niet ophalen: " + (e?.message || e));
    } finally {
        document.getElementById("submit_ai_spinner").style.display = 'none';
    }
    });

  // Wissen
  document.getElementById("clear_ai_button").addEventListener("click", () => {
    document.getElementById("input_ai_field").value = "";
    document.getElementById("ai_response").textContent = "";
    lastAIContent = null;
  });

// Opslaan naar Excel
    document.getElementById('save_ai_response').addEventListener('click', async () => {
    document.getElementById("save_ai_spinner").style.display = 'flex';

    try {
        if (!lastAIContent) throw new Error("Geen AI-data beschikbaar");

        // Parse LLM-output robuust
        const parsed = normalizeAiJson(lastAIContent);

        // Lees de waarde uit het textarea-veld
        const aiInput = document.getElementById("input_ai_field");
        const aiInputRaw = aiInput ? aiInput.value : "";
        // optioneel: trim + respecteer (extra) max lengte
        const aiInputFinal = (aiInputRaw || "").trim().slice(0, 100000);

        // Bouw payload:
        const payload = {
        ...parsed,
        opdracht_omschrijving: aiInputFinal,
        };

        const res = await fetch("https://datatosharefunctions.azurewebsites.net/api/AddOpdrachtToExcel", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload)
        });

        if (!res.ok) {
        const errBody = await readMaybeJson(res);
        throw new Error(typeof errBody === 'string' ? errBody : JSON.stringify(errBody));
        }

        const result = await readMaybeJson(res);
        alert("✅ Data succesvol opgeslagen in Excel!");
    } catch (err) {
        console.error(err);
        const preview = typeof lastAIContent === 'string' ? ("\n\nVoorbeeld:\n" + lastAIContent.slice(0, 150) + "…") : "";
        alert("❌ Fout bij opslaan: " + err.message + preview);
    } finally {
        document.getElementById("save_ai_spinner").style.display = 'none';
    }
});