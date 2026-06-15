const SUPABASE_URL = "https://xbevxjrokzwdvmgyxeix.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6_5wq5yp-dQOS5N710ZASQ_byuNszZw";
const TABLE_NAME = "avaliacoes";

let rating = 5;
let form = null;
let comments = null;
let starButtons = [];

const hasSupabase =
  typeof window.supabase !== "undefined" &&
  typeof window.supabase.createClient === "function" &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes("COLE_SUA_CHAVE_PUBLICA_AQUI");

const sb = hasSupabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function syncStarUI() {
  if (!starButtons.length) return;

  starButtons.forEach((btn, index) => {
    const active = index < rating;
    btn.style.background = active ? "#111111" : "#ffffff";
    btn.style.color = active ? "#ffffff" : "#111111";
    btn.style.borderColor = active ? "#111111" : "#dddddd";
  });
}

function setRating(value) {
  rating = Math.max(1, Math.min(5, Number(value) || 5));
  syncStarUI();
}

window.setRating = setRating;

function buildCommentCard(row) {
  const item = document.createElement("article");
  item.className = "comment";
  item.dataset.id = row.id;
  item.dataset.likes = String(row.likes ?? 0);
  item.dataset.dislikes = String(row.dislikes ?? 0);

  const note = Math.max(1, Math.min(5, Number(row.nota) || 1));
  const likes = Number(row.likes) || 0;
  const dislikes = Number(row.dislikes) || 0;

  item.innerHTML = `
    <strong>${escapeHtml(row.nome)}</strong>
    <p>${"⭐".repeat(note)}</p>
    <p>${escapeHtml(row.comentario)}</p>
    <div class="actions">
      <button type="button" data-action="like">👍 ${likes}</button>
      <button type="button" data-action="dislike">👎 ${dislikes}</button>
    </div>
  `;

  const likeBtn = item.querySelector('[data-action="like"]');
  const dislikeBtn = item.querySelector('[data-action="dislike"]');

  likeBtn.addEventListener("click", () => vote(item, "like"));
  dislikeBtn.addEventListener("click", () => vote(item, "dislike"));

  return item;
}

function syncVoteButtons(item) {
  const likeBtn = item.querySelector('[data-action="like"]');
  const dislikeBtn = item.querySelector('[data-action="dislike"]');

  likeBtn.textContent = `👍 ${Number(item.dataset.likes) || 0}`;
  dislikeBtn.textContent = `👎 ${Number(item.dataset.dislikes) || 0}`;
}

async function vote(item, type) {
  const id = item.dataset.id;
  let likes = Number(item.dataset.likes) || 0;
  let dislikes = Number(item.dataset.dislikes) || 0;

  if (type === "like") likes += 1;
  if (type === "dislike") dislikes += 1;

  item.dataset.likes = String(likes);
  item.dataset.dislikes = String(dislikes);
  syncVoteButtons(item);

  if (!sb || !id) return;

  const payload = type === "like" ? { likes } : { dislikes };

  const { error } = await sb
    .from(TABLE_NAME)
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar voto:", error);
  }
}

async function loadComments() {
  if (!comments) return;

  comments.innerHTML = `<p class="small">Carregando avaliações...</p>`;

  if (!sb) {
    comments.innerHTML = `<p class="small">Conecte o Supabase para salvar avaliações públicas.</p>`;
    return;
  }

  const { data, error } = await sb
    .from(TABLE_NAME)
    .select("id,nome,nota,comentario,likes,dislikes,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar avaliações:", error);
    comments.innerHTML = `<p class="small">Não foi possível carregar as avaliações.</p>`;
    return;
  }

  comments.innerHTML = "";

  if (!data || data.length === 0) {
    comments.innerHTML = `<p class="small">Ainda não há avaliações. Seja o primeiro.</p>`;
    return;
  }

  data.forEach((row) => {
    comments.appendChild(buildCommentCard(row));
  });
}

function init() {
  form = document.getElementById("commentForm");
  comments = document.getElementById("comments");
  starButtons = Array.from(document.querySelectorAll(".stars button"));

  syncStarUI();

  if (!form || !comments) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const commentInput = document.getElementById("comment");

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (!name || !comment) return;

    const row = {
      nome: name,
      nota: rating,
      comentario: comment,
      likes: 0,
      dislikes: 0
    };

    if (sb) {
      const { data, error } = await sb
        .from(TABLE_NAME)
        .insert(row)
        .select("id,nome,nota,comentario,likes,dislikes,created_at")
        .single();

      if (error) {
        console.error("Erro ao salvar avaliação:", error);
        alert("Não foi possível enviar a avaliação.");
        return;
      }

      comments.prepend(buildCommentCard(data));
    } else {
      const tempRow = {
        ...row,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      comments.prepend(buildCommentCard(tempRow));
    }

    form.reset();
    rating = 5;
    syncStarUI();
    nameInput.focus();
  });

  loadComments();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
    }  rating = Math.max(1, Math.min(5, Number(value) || 5));
  updateStarUI();
}

window.setRating = setRating;

function buildCommentCard(row) {
  const item = document.createElement("article");
  item.className = "comment";
  item.dataset.id = row.id;
  item.dataset.likes = row.likes ?? 0;
  item.dataset.dislikes = row.dislikes ?? 0;

  const note = Math.max(1, Math.min(5, Number(row.nota) || 1));
  const likes = Number(row.likes) || 0;
  const dislikes = Number(row.dislikes) || 0;

  item.innerHTML = `
    <strong>${escapeHtml(row.nome)}</strong>
    <p>${"⭐".repeat(note)}</p>
    <p>${escapeHtml(row.comentario)}</p>
    <div class="actions">
      <button type="button" data-action="like">👍 ${likes}</button>
      <button type="button" data-action="dislike">👎 ${dislikes}</button>
    </div>
  `;

  const likeBtn = item.querySelector('[data-action="like"]');
  const dislikeBtn = item.querySelector('[data-action="dislike"]');

  likeBtn.addEventListener("click", () => vote(item, "like"));
  dislikeBtn.addEventListener("click", () => vote(item, "dislike"));

  return item;
}

function syncVoteButtons(item) {
  const likeBtn = item.querySelector('[data-action="like"]');
  const dislikeBtn = item.querySelector('[data-action="dislike"]');
  likeBtn.textContent = `👍 ${Number(item.dataset.likes) || 0}`;
  dislikeBtn.textContent = `👎 ${Number(item.dataset.dislikes) || 0}`;
}

async function vote(item, type) {
  const id = item.dataset.id;
  let likes = Number(item.dataset.likes) || 0;
  let dislikes = Number(item.dataset.dislikes) || 0;

  if (type === "like") likes += 1;
  if (type === "dislike") dislikes += 1;

  item.dataset.likes = String(likes);
  item.dataset.dislikes = String(dislikes);
  syncVoteButtons(item);

  if (!sb || !id) return;

  const payload = type === "like" ? { likes } : { dislikes };

  const { error } = await sb
    .from(TABLE_NAME)
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar voto:", error);
  }
}

async function loadComments() {
  if (!comments) return;

  comments.innerHTML = `<p class="small">Carregando avaliações...</p>`;

  if (!sb) {
    comments.innerHTML = `<p class="small">Conecte o Supabase para salvar avaliações públicas.</p>`;
    return;
  }

  const { data, error } = await sb
    .from(TABLE_NAME)
    .select("id,nome,nota,comentario,likes,dislikes,criado_em")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao carregar avaliações:", error);
    comments.innerHTML = `<p class="small">Não foi possível carregar as avaliações.</p>`;
    return;
  }

  comments.innerHTML = "";

  if (!data || data.length === 0) {
    comments.innerHTML = `<p class="small">Ainda não há avaliações. Seja o primeiro.</p>`;
    return;
  }

  data.forEach((row) => {
    comments.appendChild(buildCommentCard(row));
  });
}

if (form && comments) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const commentInput = document.getElementById("comment");

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (!name || !comment) return;

    const row = {
      nome: name,
      nota: rating,
      comentario: comment,
      likes: 0,
      dislikes: 0
    };

    if (sb) {
      const { data, error } = await sb
        .from(TABLE_NAME)
        .insert(row)
        .select("id,nome,nota,comentario,likes,dislikes,criado_em")
        .single();

      if (error) {
        console.error("Erro ao salvar avaliação:", error);
        alert("Não foi possível enviar a avaliação.");
        return;
      }

      comments.prepend(buildCommentCard(data));
    } else {
      const tempRow = { ...row, id: Date.now(), criado_em: new Date().toISOString() };
      comments.prepend(buildCommentCard(tempRow));
    }

    form.reset();
    rating = 5;
    updateStarUI();
    nameInput.focus();
  });
}

updateStarUI();
loadComments();
