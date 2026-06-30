/**
 * K&I Kundenwerke chat widget — dependency-free IIFE.
 * Embed with: <script src="/widget.js" data-api-base="https://your-host"></script>
 * Talks to POST /api/chat and renders the SSE stream. All bot text is inserted
 * via textContent (never innerHTML) to prevent HTML/script injection.
 */
(function () {
  "use strict";
  var script = document.currentScript;
  var API_BASE = (script && script.getAttribute("data-api-base")) || "";
  var LS_CONV = "ki_conversation_id";
  var LS_SESSION = "ki_session_id";

  function uuid() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    return "s-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  var sessionId = localStorage.getItem(LS_SESSION) || uuid();
  localStorage.setItem(LS_SESSION, sessionId);

  // Auto-load the stylesheet so a single <script> tag is enough to embed.
  if (!document.querySelector('link[data-kiw-css]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = API_BASE + "/widget.css";
    link.setAttribute("data-kiw-css", "1");
    document.head.appendChild(link);
  }

  // --- DOM ---------------------------------------------------------------
  var root = document.createElement("div");
  root.className = "kiw";
  root.innerHTML =
    '<button class="kiw-launch" aria-label="Chat öffnen">💬</button>' +
    '<div class="kiw-panel" hidden>' +
    '  <div class="kiw-head"><span>KI-Assistent von K&amp;I Kundenwerke</span>' +
    '    <button class="kiw-close" aria-label="Schließen">×</button></div>' +
    '  <div class="kiw-msgs" role="log" aria-live="polite"></div>' +
    '  <div class="kiw-consent">Mit dem Schreiben stimmst du der Verarbeitung deiner ' +
    "Angaben zur Bearbeitung deiner Anfrage zu (DSGVO).</div>" +
    '  <form class="kiw-form"><input class="kiw-input" placeholder="Nachricht…" ' +
    'autocomplete="off" maxlength="4000" /><button class="kiw-send">Senden</button></form>' +
    "</div>";
  document.body.appendChild(root);

  var panel = root.querySelector(".kiw-panel");
  var msgs = root.querySelector(".kiw-msgs");
  var form = root.querySelector(".kiw-form");
  var input = root.querySelector(".kiw-input");

  root.querySelector(".kiw-launch").onclick = function () {
    panel.hidden = false;
    input.focus();
    if (!msgs.childElementCount) addBubble("bot", "Hallo! Wie kann ich dir helfen?");
  };
  root.querySelector(".kiw-close").onclick = function () {
    panel.hidden = true;
  };

  function addBubble(who, text) {
    var b = document.createElement("div");
    b.className = "kiw-bubble kiw-" + who;
    b.textContent = text; // escape — never innerHTML
    msgs.appendChild(b);
    msgs.scrollTop = msgs.scrollHeight;
    return b;
  }

  function addCitations(bubble, urls) {
    if (!urls || !urls.length) return;
    var c = document.createElement("div");
    c.className = "kiw-cite";
    c.textContent = "Quellen: " + urls.join(", ");
    bubble.appendChild(c);
  }

  form.onsubmit = function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    addBubble("user", text);
    var bot = addBubble("bot", "");
    bot.classList.add("kiw-typing");
    stream(text, bot);
  };

  function stream(text, bot) {
    var body = { message: text, sessionId: sessionId };
    var conv = localStorage.getItem(LS_CONV);
    if (conv) body.conversationId = conv;

    fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(function (res) {
        if (!res.ok || !res.body) throw new Error("HTTP " + res.status);
        var reader = res.body.getReader();
        var dec = new TextDecoder();
        var buf = "";
        var acc = "";
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) {
              bot.classList.remove("kiw-typing");
              return;
            }
            buf += dec.decode(r.value, { stream: true });
            var parts = buf.split("\n\n");
            buf = parts.pop();
            parts.forEach(function (block) {
              var ev = "", data = "";
              block.split("\n").forEach(function (line) {
                if (line.indexOf("event:") === 0) ev = line.slice(6).trim();
                else if (line.indexOf("data:") === 0) data += line.slice(5).trim();
              });
              if (ev === "delta") {
                bot.classList.remove("kiw-typing");
                acc += data;
                bot.textContent = acc;
              } else if (ev === "done") {
                try {
                  var info = JSON.parse(data);
                  if (info.conversationId) localStorage.setItem(LS_CONV, info.conversationId);
                  addCitations(bot, info.citations);
                } catch (_) {}
              } else if (ev === "error") {
                bot.textContent = "Es ist ein Fehler aufgetreten. Bitte später erneut versuchen.";
              }
              msgs.scrollTop = msgs.scrollHeight;
            });
            return pump();
          });
        }
        return pump();
      })
      .catch(function () {
        bot.classList.remove("kiw-typing");
        bot.textContent = "Verbindung fehlgeschlagen. Bitte später erneut versuchen.";
      });
  }
})();
