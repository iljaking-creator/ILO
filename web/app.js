// Renders the clip gallery from clips.json.
// Each clip is "pending" (storyboard only), "completed" (has a video), or "failed".

const STATUS_LABEL = {
  completed: { text: "Fertig", cls: "tag--ok" },
  pending: { text: "Wartet auf Generierung", cls: "tag--pending" },
  failed: { text: "Fehlgeschlagen", cls: "tag--failed" },
};

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function mediaFor(clip) {
  const wrap = el("div", "card__media");
  const status = clip.status ?? "pending";
  const label = STATUS_LABEL[status] ?? STATUS_LABEL.pending;
  wrap.appendChild(el("span", `tag ${label.cls}`, label.text));

  if (status === "completed" && clip.videoUrl) {
    const video = document.createElement("video");
    video.src = clip.videoUrl;
    if (clip.imageUrl) video.poster = clip.imageUrl;
    video.controls = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    wrap.appendChild(video);
  } else if (clip.imageUrl) {
    const img = document.createElement("img");
    img.src = clip.imageUrl;
    img.alt = clip.title;
    wrap.appendChild(img);
  } else {
    const ph = el("div", "card__placeholder");
    ph.appendChild(el("span", "dot"));
    ph.appendChild(el("span", null, status === "failed" ? "—" : "Storyboard bereit"));
    wrap.appendChild(ph);
  }
  return wrap;
}

function cardFor(clip) {
  const card = el("article", "card");
  card.appendChild(mediaFor(clip));

  const body = el("div", "card__body");
  body.appendChild(el("h3", null, clip.title));
  body.appendChild(el("p", null, clip.caption));
  if (clip.social) body.appendChild(el("div", "card__social", clip.social));

  const actions = el("div", "card__actions");
  const dl = el("a", "btn btn--primary", "Video");
  if (clip.videoUrl) {
    dl.href = clip.videoUrl;
    dl.setAttribute("download", "");
  } else {
    dl.setAttribute("aria-disabled", "true");
    dl.href = "#";
  }
  actions.appendChild(dl);
  body.appendChild(actions);

  card.appendChild(body);
  return card;
}

async function load() {
  const gallery = document.getElementById("gallery");
  const statusEl = document.getElementById("status");

  let data;
  try {
    const res = await fetch("clips.json", { cache: "no-store" });
    data = await res.json();
  } catch {
    statusEl.textContent = "clips.json nicht gefunden — bitte den Generator ausführen.";
    return;
  }

  const clips = data.clips ?? [];
  const done = clips.filter((c) => c.status === "completed").length;
  statusEl.textContent =
    done === clips.length && done > 0
      ? `${done} Clips fertig — bereit zum Hochladen.`
      : `${done}/${clips.length} Clips generiert. Storyboards stehen bereit.`;

  gallery.replaceChildren(...clips.map(cardFor));
}

load();
