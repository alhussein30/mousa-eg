(() => {
  const B = {
    ig: "https://www.instagram.com/mousa_accessoriess/",
    dm: "https://ig.me/m/mousa_accessoriess",
    items: [
      { n: "خاتم مرصّع", d: "مع أسورة سلسلة", img: "ring-stones", f: "rings" },
      { n: "خواتم", d: "دهبي وفضي", img: "rings", f: "rings" },
      { n: "غوايش بفصوص", d: "دهبي", img: "bangles", f: "bracelets" },
      { n: "غويشة بوردة فصوص", d: "دهبي وفصوص", img: "bangle-clover", f: "bracelets" },
      { n: "أساور رفيعة", d: "دهبي وفصوص", img: "bracelets", f: "bracelets" },
      { n: "أساور بفصوص خضرا", d: "دهبي", img: "bracelets-green", f: "bracelets" },
    ],
    faqs: [
      ["إزاي أطلب؟", "من رسايل إنستجرام على @mousa_accessoriess. اختاري القطعة من الموقع، والرسالة هتتنسخ جاهزة تلصقيها في الشات."],
      ["الصور حقيقية؟", "أيوه. زي ما مكتوب في البايو: كل الصور على الطبيعة."],
      ["الأسعار؟", "اسألي على السعر في الرسايل، وهيوصلك الرد بالسعر والمتاح."],
      ["فين آراء العملاء؟", "في هايلايت Feedback على حساب إنستجرام."],
    ],
  };
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  ["#igLink", "#fIg", "#hdIg"].forEach((s) => ($(s).href = B.ig));
  ["#dmBtn", "#drDm", "#heroDm"].forEach((s) => ($(s).href = B.dm));

  // toast + "copy message, then open the Instagram chat"
  const toast = $("#toast"); let tt;
  const say = (m) => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); };
  const ask = async (msg) => {
    let ok = false;
    try { await navigator.clipboard.writeText(msg); ok = true; } catch {}
    say(ok ? "اتنسخت الرسالة. الصقيها في شات إنستجرام" : "افتحي الشات واكتبي اسم القطعة");
    window.open(B.dm, "_blank", "noopener");
  };

  // grid
  $("#grid").innerHTML = B.items.map((it, i) => `<article class="card rv" style="--d:${(i % 3) * 0.08}s" data-i="${i}" tabindex="0" role="button" aria-label="${it.n}، اسألي عن السعر"><div class="ci"><img src="img/${it.img}.jpg" alt="${it.n} ${it.d}" loading="lazy"></div><div class="row"><b>${it.n}</b><span>اسألي عن السعر</span></div></article>`).join("");
  const pick = (c) => { const it = B.items[+c.dataset.i]; ask(`أهلاً، عايزة أسأل عن السعر: ${it.n} (${it.d})`); };
  $("#grid").addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) pick(c); });
  $("#grid").addEventListener("keydown", (e) => { const c = e.target.closest(".card"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(c); } });
  ["#dmBtn", "#drDm", "#heroDm"].forEach((id) => $(id).addEventListener("click", (e) => { e.preventDefault(); ask("أهلاً، عايزة أسأل عن القطع المتاحة"); }));

  // filter pill
  const fl = $(".filter"), fb = $("#filterBtn");
  const setOpen = (o) => { fl.classList.toggle("open", o); fb.setAttribute("aria-expanded", o); };
  fb.onclick = (e) => { e.stopPropagation(); setOpen(!fl.classList.contains("open")); };
  document.addEventListener("click", (e) => { if (!fl.contains(e.target)) setOpen(false); });
  addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  $("#filterList").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("#filterList button").forEach((x) => x.classList.toggle("on", x === b));
    $("#filterLabel").textContent = b.textContent;
    $$(".card").forEach((c) => { const it = B.items[+c.dataset.i]; c.hidden = !(b.dataset.f === "all" || it.f === b.dataset.f); });
    setOpen(false);
  });

  $("#faqList").innerHTML = B.faqs.map(([q, a]) => `<details class="rv"><summary>${q}</summary><p>${a}</p></details>`).join("");

  // reveals
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    $$(".rv").forEach((e) => io.observe(e));
    // bottom-nav dots follow the section in view
    const so = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) $$(".bnav a").forEach((a) => a.classList.toggle("on", a.dataset.s === x.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
    ["shop", "about", "order", "faq"].forEach((id) => so.observe(document.getElementById(id)));
  } else $$(".rv").forEach((e) => e.classList.add("in"));

  // loader
  let started = false;
  const start = () => { if (started) return; started = true; $("#loader").classList.add("gone"); root.classList.remove("loading"); root.classList.add("ready"); };
  if (reduce) start();
  else {
    const min = new Promise((r) => setTimeout(r, 1400));
    const loaded = new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
    Promise.all([min, loaded]).then(start);
    setTimeout(start, 4000);
  }

  // header: transparent over the ink hero, solid after it, hides while scrolling down
  const hd = $("#hd"), hero = $(".hero");
  let lastY = scrollY, raf = 0;
  const frame = () => { raf = 0; const y = scrollY; hd.classList.toggle("solid", y > hero.offsetHeight - 70); if (!root.classList.contains("lock")) hd.classList.toggle("hide", y > lastY && y > hero.offsetHeight); lastY = y; };
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true }); frame();

  // side drawer
  const dr = $("#drawer"), scrim = $("#scrim"), bg = $("#burger");
  const setDrawer = (o) => {
    if (o) scrim.hidden = false;
    requestAnimationFrame(() => { dr.classList.toggle("open", o); scrim.classList.toggle("on", o); });
    dr.setAttribute("aria-hidden", !o); bg.setAttribute("aria-expanded", o); root.classList.toggle("lock", o);
    if (o) setTimeout(() => $("#drClose").focus(), 300);
    else { bg.focus({ preventScroll: true }); setTimeout(() => { if (!dr.classList.contains("open")) scrim.hidden = true; }, 450); }
  };
  bg.onclick = () => setDrawer(true);
  $("#drClose").onclick = () => setDrawer(false);
  scrim.onclick = () => setDrawer(false);
  addEventListener("keydown", (e) => e.key === "Escape" && dr.classList.contains("open") && setDrawer(false));
  $(".dr-links").addEventListener("click", (e) => {
    const l = e.target.closest("a"); if (!l) return;
    const f = l.dataset.filter || (l.getAttribute("href") === "#shop" ? "all" : "");
    if (f) $('#filterList [data-f="' + f + '"]').click();
    setDrawer(false);
  });

  // hero objects drift with the pointer (desktop only)
  if (!reduce && matchMedia("(hover: hover) and (min-width: 801px)").matches) {
    const objs = $$(".obj");
    hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; objs.forEach((o) => { const d = +o.dataset.depth; o.style.setProperty("--mx", x * d + "px"); o.style.setProperty("--my", y * d + "px"); }); });
    hero.addEventListener("pointerleave", () => objs.forEach((o) => { o.style.setProperty("--mx", "0px"); o.style.setProperty("--my", "0px"); }));
  }
})();
