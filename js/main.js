/* ============================================================
   CHICO MARTINS — portfólio · js/main.js
   menu móvel · seção ativa · reveal · carrossel creators ·
   serviços (lista de dados) · formulário com estados
   ============================================================ */
(function () {
  "use strict";
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. SERVIÇOS: lista simples de dados ----------
     Para adicionar um serviço novo, basta acrescentar um objeto aqui. */
  const SERVICOS = [
    { icone: "monitor",  titulo: "Vídeos para Redes Sociais", desc: "Reels, vídeos de YouTube, gameplays, vlogs e conteúdo otimizado para engajamento." },
    { icone: "globo",    titulo: "Animação de Branding",      desc: "Identidade visual animada, logos em movimento e elementos de marca dinâmicos." },
    { icone: "camera",   titulo: "Edição Institucional",      desc: "Vídeos corporativos, apresentações e conteúdo profissional para empresas." },
    { icone: "camadas",  titulo: "Motion Design",             desc: "Animações 2D, transições criativas e efeitos visuais para qualquer projeto." }
  ];
  /* ícones provisórios (traço): substituir pelos definitivos quando existirem */
  const ICONES = {
    monitor: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/></svg>',
    globo:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
    camera:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.5-2.5h5L16 7"/><circle cx="12" cy="13.5" r="3.5"/></svg>',
    camadas: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>'
  };
  const lista = document.getElementById("lista-servicos");
  if (lista) {
    lista.innerHTML = SERVICOS.map(function (s) {
      return '<li class="svc">' +
        '<span class="svc-ic" title="ícone provisório">' + (ICONES[s.icone] || "") + '</span>' +
        '<h3>' + s.titulo + '</h3><p>' + s.desc + '</p></li>';
    }).join("");
  }

  /* ---------- 2. menu móvel acessível ---------- */
  const toggle = document.getElementById("nav-toggle");
  const painel = document.getElementById("menu-mobile");
  function fecharMenu() {
    if (!painel || painel.hidden) return;
    painel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "abrir menu");
  }
  if (toggle && painel) {
    toggle.addEventListener("click", function () {
      const aberto = painel.hidden;
      painel.hidden = !aberto;
      toggle.setAttribute("aria-expanded", String(aberto));
      toggle.setAttribute("aria-label", aberto ? "fechar menu" : "abrir menu");
      if (aberto) { const primeiro = painel.querySelector("a"); if (primeiro) primeiro.focus(); }
    });
    painel.addEventListener("click", function (e) { if (e.target.closest("a")) fecharMenu(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !painel.hidden) { fecharMenu(); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!painel.hidden && !e.target.closest(".topo")) fecharMenu();
    });
  }

  /* ---------- 3. indicação da seção ativa (somente home) ---------- */
  const linksSecao = document.querySelectorAll("[data-section]");
  if (linksSecao.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        linksSecao.forEach(function (l) {
          if (l.getAttribute("aria-current") === "page") return;
          if (l.dataset.section === en.target.id) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "works", "contato", "sobre"].forEach(function (id) {
      const s = document.getElementById(id);
      if (s) obs.observe(s);
    });
  }

  /* ---------- 4. reveal sóbrio ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduzMovimento) {
    const obsR = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); obsR.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { obsR.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

/* ---------- 5. carrossel creators — infinito ---------- */
const linha = document.getElementById("crew-row");
if (linha) {
  const originais = Array.from(linha.children);
  const REP_UNIDADE = 3;   // repetições da base por unidade (unidade > janela)
  const COPIAS_EXTRA = 2;  // unidades extras (B e C) para fechar o loop

  /* unidade = base ×3; clones marcados aria-hidden para não duplicar leitura */
  const nosUnidade = originais.slice();
  for (let r = 1; r < REP_UNIDADE; r++) {
    originais.forEach(function (li) {
      const c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      nosUnidade.push(c);
    });
  }
  nosUnidade.slice(originais.length).forEach(function (n) { linha.appendChild(n); });
  const tamUnidade = nosUnidade.length;
  for (let k = 0; k < COPIAS_EXTRA; k++) {
    nosUnidade.forEach(function (li) {
      const c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      linha.appendChild(c);
    });
  }

  /* W = largura de uma unidade; o loop soma/subtrai W sem mudança visual */
  let W = 0;
  function medir() {
    W = linha.children[tamUnidade]
      ? linha.children[tamUnidade].offsetLeft - linha.children[0].offsetLeft
      : 0;
  }
  function normalizar() {
    if (!W) return;
    const s = linha.scrollLeft;
    if (s >= 2 * W) linha.scrollLeft = s - W;
    else if (s <= 0) linha.scrollLeft = s + W;
  }
  medir();
  linha.scrollLeft = W;   // começa na cópia do meio: dá para rolar nos dois sentidos

  let tick = false;
  linha.addEventListener("scroll", function () {
    if (tick) return;
    tick = true;
    requestAnimationFrame(function () { tick = false; normalizar(); });
  }, { passive: true });

  window.addEventListener("resize", function () {
    const relativo = W ? (linha.scrollLeft - W) % W : 0;
    medir();
    linha.scrollLeft = W + (relativo + W) % W;
  });

  document.querySelectorAll(".crew-btn").forEach(function (btn) {
     btn.addEventListener("click", function () {
       const item = linha.querySelector(".crew-item");
       const estilo = getComputedStyle(linha);
       const gap = parseFloat(estilo.columnGap || estilo.gap) || 0;
       const passo = item ? item.offsetWidth + gap : 200;   /* 1 item = 1 passo = +1 visível */
       linha.scrollBy({ left: Number(btn.dataset.dir) * passo, behavior: reduzMovimento ? "auto" : "smooth" });
     });
});
}

  /* ---------- 6. formulário: validação + estados ----------
     modo "mailto": abre o app de e-mail preenchido (comportamento atual).
     modo "direto": envio pelo site — ligar SOMENTE após configurar o domínio
     autenticado do remetente; definir endpoint abaixo. */
  const CONFIG_ENVIO = { modo: "mailto", destino: "francisco.maemd@gmail.com", endpoint: "" };

  const form = document.getElementById("form-contato");
  if (form) {
    const status = document.getElementById("form-status");
    const botao = document.getElementById("btn-enviar");
    /* guarda o markup original do botão (texto + SVG da seta) para restaurar depois */
    const rotuloOriginal = botao ? botao.innerHTML : "";
    const REGRA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const CAMPOS = [
      { id: "nome",      msg: "informe seu nome." },
      { id: "email",     msg: "informe um e-mail válido.", teste: function (v) { return REGRA_EMAIL.test(v); } },
      { id: "assunto",   msg: "diga qual é o assunto." },
      { id: "mensagem",  msg: "escreva sua mensagem." }
    ];
    function setStatus(tipo, texto) {
      status.hidden = false;
      status.className = "form-status " + tipo;
      status.textContent = texto;
    }
    function erroDe(campo, msg) {
      const el = document.getElementById(campo.id);
      const err = document.getElementById("erro-" + campo.id);
      if (msg) { el.setAttribute("aria-invalid", "true"); err.textContent = msg; err.classList.add("show"); }
      else { el.removeAttribute("aria-invalid"); err.textContent = ""; err.classList.remove("show"); }
    }
    function validar() {
      let primeiroInvalido = null;
      CAMPOS.forEach(function (c) {
        const el = document.getElementById(c.id);
        const v = el.value.trim();
        let msg = "";
        if (!v) msg = c.msg;
        else if (c.teste && !c.teste(v)) msg = c.msg;
        erroDe(c, msg);
        if (msg && !primeiroInvalido) primeiroInvalido = el;
      });
      if (primeiroInvalido) primeiroInvalido.focus();
      return !primeiroInvalido;
    }
    CAMPOS.forEach(function (c) {
      document.getElementById(c.id).addEventListener("input", function () { erroDe(c, ""); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.hidden = true;
      if (!validar()) return;
      const dados = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        assunto: document.getElementById("assunto").value.trim(),
        mensagem: document.getElementById("mensagem").value.trim()
      };
      botao.disabled = true;
      botao.innerHTML = "enviando…";
      setStatus("info", "enviando…");

      function liberar() {
        botao.disabled = false;
        botao.innerHTML = rotuloOriginal;
      }

      if (CONFIG_ENVIO.modo === "direto" && CONFIG_ENVIO.endpoint) {
        fetch(CONFIG_ENVIO.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados)
        })
          .then(function (r) { if (!r.ok) throw new Error("http " + r.status); })
          .then(function () { setStatus("ok", "mensagem enviada! retorno em até 48h úteis."); form.reset(); })
          .catch(function () { setStatus("erro", "não consegui enviar agora. tente de novo ou me chame no WhatsApp."); })
          .finally(liberar);
      } else {
        /* provisório: app de e-mail com a mensagem pronta */
        setTimeout(function () {
          const corpo =
            "nome: " + dados.nome + "\n" +
            "e-mail: " + dados.email + "\n\n" + dados.mensagem;
          window.location.href = "mailto:" + CONFIG_ENVIO.destino +
            "?subject=" + encodeURIComponent(dados.assunto + " — via site") +
            "&body=" + encodeURIComponent(corpo);
          setStatus("ok", "pronto! abrimos seu app de e-mail com tudo preenchido. se não abriu, escreva para " + CONFIG_ENVIO.destino + ".");
          liberar();
        }, reduzMovimento ? 0 : 450);
      }
    });
  }
})();
