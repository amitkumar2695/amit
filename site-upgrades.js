/* Portfolio enhancements: intro-only cursor water effect and publication research highlights.
   Only the Latest News article uses a GIF (gifs/Paper8.gif).
   Until supplied, that panel displays a labeled animated graphical-abstract preview. */
(() => {
  "use strict";
  const settings = {
    doi: "https://doi.org/10.1002/adhm.71804"
  };
  const studies = {
    "10.1002/adhm.71804": {
      impact: "A dual-responsive hydrogel–elastomer actuator uses stimulus-controlled bidirectional motion to disrupt established biofilms. In the reported experiments, cyclic actuation removed more than 70% of biofilm, suggesting a possible nonchemical approach to antifouling medical surfaces.",
      keywords: ["Biofilm disruption", "Bidirectional actuation", "Responsive hydrogels", "Soft actuators", "Medical surfaces"]
    },
    "10.1021/acsaenm.5c00225": {
      impact: "Investigates how the distribution of bending strain can be built into 4D-printed soft structures to program the topology of their resulting shape transformations.",
      keywords: ["4D printing", "Bending strain", "Shape programming", "Soft actuators"]
    },
    "10.1016/j.ijbiomac.2025.144701": {
      impact: "Uses a pH-responsive chitosan/carboxymethyl-cellulose bilayer to couple shape change with multidrug release, targeting the distinctive acidity of the cancer microenvironment in experimental models.",
      keywords: ["Cancer microenvironment", "pH-responsive materials", "Chitosan", "Multidrug release"]
    },
    "10.1016/j.eurpolymj.2024.113581": {
      impact: "Demonstrates how material choice and printed bilayer architecture can program pH-driven shape shifting in 4D-printed soft structures.",
      keywords: ["4D printing", "pH-responsive bilayers", "Programmable shape change", "Hydrogels"]
    },
    "10.1016/j.cej.2024.154772": {
      impact: "Develops asymmetric superhydrophobic, pH-responsive soft actuators and explores their potential to resist unwanted adhesion on medical-device surfaces.",
      keywords: ["Superhydrophobicity", "Antifouling", "pH-responsive actuators", "Biomedical devices"]
    },
    "10.1016/j.actbio.2023.09.024": {
      impact: "Explores how engineering the surrounding medium reduces unwanted scrolling of delicate Descemet membrane endothelial keratoplasty grafts, with implications for surgical handling.",
      keywords: ["DMEK", "Corneal grafts", "Biomaterial mechanics", "Surgical handling"]
    },
    "10.1016/j.jmapro.2022.11.065": {
      impact: "Shows solvent-triggered shape morphing in 4D-printed hydrogels, linking printable material architectures to predictable soft-system movement.",
      keywords: ["4D printing", "Solvent actuation", "Shape morphing", "Printed hydrogels"]
    },
    "10.1021/acsami.2c16658": {
      impact: "Engineers the nonmorphing point of pH-sensitive hydrogel bilayers, using controlled bending behavior to influence model-drug release.",
      keywords: ["Nonmorphing point", "Hydrogel bilayers", "pH-responsive", "Controlled release"]
    }
  };
  function node(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function makeLink(url, label, cls) {
    const el = node("a", cls, label);
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    return el;
  }
  function addInsights(parent, study) {
    const wrap = node("div", "upgrade-insights");
    wrap.append(node("h4", "upgrade-subhead", "Key research impact"));
    wrap.append(node("p", "upgrade-impact", study.impact));
    wrap.append(node("h4", "upgrade-subhead", "Keywords"));
    const chips = node("div", "upgrade-chips");
    study.keywords.forEach(keyword => chips.append(node("span", "upgrade-chip", keyword)));
    wrap.append(chips);
    parent.append(wrap);
  }
  function gifPath(poster) {
    // News only: the biofilm-disruption paper uses the user's future research GIF.
    return poster === "Paper8.png" ? "gifs/Paper8.gif": "";
  }
  function makeGifCard(poster, label) {
    const card = node("div", "upgrade-media-card upgrade-gif-card");
    card.append(node("h4", "upgrade-subhead", "Research GIF"));
    const stage = node("div", "upgrade-gif-stage");
    const preview = node("img", "upgrade-gif-preview");
    preview.src = poster;
    preview.alt = "Illustrative animated preview of the existing graphical abstract";
    preview.loading = "lazy";
    stage.append(preview);
    const status = node("p", "upgrade-media-status", "Animated graphical abstract preview");
    const gifSrc = gifPath(poster);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (gifSrc && !reducedMotion) {
      const gif = node("img", "upgrade-gif-image");
      gif.alt = label || "Research animation for this publication";
      // Loading while display:none can deadlock lazy-loaded images:
      // the CSS keeps this image in layout (transparent) until its load event.
      gif.loading = "eager";
      gif.decoding = "async";
      gif.addEventListener("load", () => {
        gif.classList.add("is-ready");
        preview.hidden = true;
        status.textContent = "Research GIF";
      }, {once:true});
      gif.addEventListener("error", () => {
        gif.remove();
        status.textContent = "Research GIF could not load — showing animated graphical abstract preview";
      }, {once:true});
      gif.src = gifSrc;
      stage.append(gif);
    } else if (reducedMotion) {
      status.textContent = "Static preview (reduced-motion setting)";
    }
    card.append(stage, status);
    return card;
  }
  function enhancePublications() {
    document.querySelectorAll("#publications .publication-list .publication-item").forEach(article => {
      const main = article.querySelector(".publication-main");
      const paperLink = main && main.querySelector('a[href*="doi.org/"]');
      if (!paperLink) return;
      let doi;
      try { doi = new URL(paperLink.getAttribute("href").trim(), location.href).pathname.replace(/^\//, "").toLowerCase(); }
      catch { return; }
      if (studies[doi] && !article.querySelector(".upgrade-insights")) addInsights(main, studies[doi]);
      const media = article.querySelector(".publication-visuals");
      const figure = media && media.querySelector(".pub-figure");
      if (!media || !figure || media.classList.contains("upgrade-paper-media")) return;
      const graphicCard = node("div", "upgrade-media-card upgrade-graphic-card");
      graphicCard.append(node("h4", "upgrade-subhead", "Graphical abstract"));
      // Preserve the original graphical abstract and its keyboard-accessible lightbox.
      figure.before(graphicCard);
      graphicCard.append(figure);
      media.classList.add("upgrade-paper-media");
    });
  }
  function makeGraphicCard() {
    const card = node("div", "upgrade-media-card upgrade-graphic-card");
    card.append(node("h4", "upgrade-subhead", "Graphical abstract"));
    const anchor = makeLink("Paper8.png", "", "upgrade-image-link");
    anchor.setAttribute("aria-label", "Open the paper's graphical abstract");
    const img = node("img", "upgrade-news-image");
    img.src = "Paper8.png";
    img.alt = "Graphical abstract for dual-responsive bidirectional biofilm-disrupting actuators";
    img.loading = "lazy";
    img.addEventListener("error", () => {
      img.hidden = true;
      anchor.append(node("p", "upgrade-image-fallback", "Graphical abstract: Paper8.png"));
    }, {once:true});
    anchor.append(img);
    card.append(anchor);
    return card;
  }
  function addLatestNews() {
    const section = document.querySelector("section.snapshot");
    if (!section || section.querySelector(".upgrade-latest-news")) return;
    const title = section.querySelector(".section-heading");
    if (!title) return;

    // Editorial feature layout: header across the card, followed by
    // graphical abstract | stacked research impact + keywords | GIF.
    const article = node("article", "publication-item upgrade-latest-news");
    article.setAttribute("aria-label", "Latest published research: dual-responsive biofilm-disrupting actuator");

    const header = node("header", "upgrade-news-header");
    const headerSpacer = node("span", "upgrade-news-header-spacer");
    headerSpacer.setAttribute("aria-hidden", "true");
    const heading = node("div", "upgrade-news-heading");
    heading.append(node("p", "year upgrade-news-date", "6 October 2026  ·  New publication"));
    heading.append(node("h3", "", "Dual-Responsive Bidirectional Actuator for Biofilm Disruption on Medical Surfaces"));
    heading.append(node("p", "upgrade-citation", "Amit Kumar, Anas Saifi, Kumari Kiran, Sanjib Senapati, Nitish R. Mahapatra, Pijush Ghosh"));
    heading.append(node("p", "upgrade-citation upgrade-journal", "Advanced Healthcare Materials (2026)"));
    header.append(headerSpacer, heading, makeLink(settings.doi, "Read Article ↗", "upgrade-paper-link"));

    const research = studies["10.1002/adhm.71804"];
    const center = node("div", "upgrade-news-center");
    const impact = node("section", "upgrade-news-detail upgrade-news-impact");
    impact.append(node("h4", "upgrade-subhead", "Key research impact"));
    impact.append(node("p", "upgrade-impact", research.impact));
    const keywords = node("section", "upgrade-news-detail upgrade-news-keywords");
    keywords.append(node("h4", "upgrade-subhead", "Keywords"));
    const chips = node("div", "upgrade-chips");
    research.keywords.forEach(keyword => chips.append(node("span", "upgrade-chip", keyword)));
    keywords.append(chips);
    center.append(impact, keywords);

    const visualRow = node("div", "upgrade-news-layout");
    visualRow.append(
      makeGraphicCard(),
      center,
      makeGifCard("Paper8.png", "Dual-responsive Bilayer Actuator")
    );
    article.append(header, visualRow);
    title.insertAdjacentElement("afterend", article);
  }
  // Keep the water animation and cursor ripples within the introductory hero only.
  // Pointer coordinates are relative to the hero, not the full viewport.
  function makeWaterEffect() {
    const hero = document.querySelector("#home.hero");
    if (!hero || hero.querySelector(".upgrade-water")) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const touchOnly = matchMedia("(hover: none)");
    const layer = node("div", "upgrade-water");
    layer.setAttribute("aria-hidden", "true");
    const canvas = node("canvas", "upgrade-water-canvas");
    layer.append(canvas);
    hero.insertBefore(layer, hero.firstChild);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const state = {w:0,h:0,ripples:[],last:0,paused:false,visible:true};
    let raf = 0;
    const clamp = (v,low,high) => Math.min(high,Math.max(low,v));
    function resize() {
      const bounds = hero.getBoundingClientRect();
      state.w = Math.max(1,bounds.width);
      state.h = Math.max(1,bounds.height);
      const dpr = Math.min(devicePixelRatio || 1,1.75);
      canvas.width = Math.round(state.w * dpr);
      canvas.height = Math.round(state.h * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw(performance.now());
    }
    function pointer(event) {
      if (reduce.matches || touchOnly.matches || state.paused) return;
      const bounds = hero.getBoundingClientRect();
      const x = clamp(event.clientX-bounds.left,0,state.w);
      const y = clamp(event.clientY-bounds.top,0,state.h);
      if (state.ripples.length < 14) state.ripples.push({x,y,r:1,a:.24});
    }
    function water(t) {
      ctx.clearRect(0,0,state.w,state.h);
      const gradient = ctx.createLinearGradient(0,0,state.w,state.h);
      gradient.addColorStop(0,"#fff8f5");
      gradient.addColorStop(.7,"#f7e6e8");
      gradient.addColorStop(1,"#edc8bf");
      ctx.fillStyle=gradient; ctx.fillRect(0,0,state.w,state.h);
      ctx.lineWidth=1.1;
      for(let y=-10;y<state.h+30;y+=33){
        const phase=t*.00025+y*.025;
        ctx.beginPath();
        for(let x=-10;x<state.w+20;x+=10) {
          const yy=y+Math.sin(x*.018+phase)*6+Math.sin(x*.04-phase*.8)*2;
          if(x===-10) ctx.moveTo(x,yy); else ctx.lineTo(x,yy);
        }
        ctx.strokeStyle="rgba(70,62,111,.10)"; ctx.stroke();
      }
      state.ripples.forEach(r=>{
        ctx.beginPath(); ctx.ellipse(r.x,r.y,r.r*1.25,r.r*.46,0,0,Math.PI*2);
        ctx.strokeStyle="rgba(153,65,107,"+r.a+")"; ctx.stroke();
      });
    }
    function draw(t) { water(t); }
    function tick(t) {
      if (state.paused || reduce.matches || touchOnly.matches || !state.visible || document.hidden) {raf=0;return;}
      const dt=clamp((t-(state.last||t))/16.67,.4,2.5);state.last=t;
      state.ripples=state.ripples.filter(r=>(r.a-=.006*dt)>0 && (r.r+=.44*dt)>0);
      draw(t);raf=requestAnimationFrame(tick);
    }
    function start() {
      cancelAnimationFrame(raf);state.last=0;
      if(!state.paused && !reduce.matches && !touchOnly.matches && state.visible && !document.hidden)raf=requestAnimationFrame(tick);
      else draw(performance.now());
    }
    hero.addEventListener("pointermove",pointer,{passive:true});
    const toggle=node("button","upgrade-water-toggle","Pause animation");
    toggle.type="button";toggle.setAttribute("aria-pressed","false");
    toggle.addEventListener("click",()=>{
      state.paused=!state.paused;
      toggle.textContent=state.paused?"Play animation":"Pause animation";
      toggle.setAttribute("aria-pressed",String(state.paused));start();
    });
    hero.append(toggle);
    if(touchOnly.matches)toggle.hidden=true;
    window.addEventListener("resize",resize,{passive:true});
    document.addEventListener("visibilitychange",start);
    if("ResizeObserver" in window)new ResizeObserver(resize).observe(hero);
    if("IntersectionObserver" in window)new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;start();},{threshold:.05}).observe(hero);
    if(reduce.addEventListener)reduce.addEventListener("change",start);
    resize();start();
  }
  function init(){addLatestNews();enhancePublications();makeWaterEffect();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
