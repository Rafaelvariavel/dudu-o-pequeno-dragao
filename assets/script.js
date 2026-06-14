let rating = 5;

function setRating(value) {
  rating = value;
}

const form = document.getElementById("commentForm");
const comments = document.getElementById("comments");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!name || !comment) return;

    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <strong>${escapeHtml(name)}</strong>
      <p>${"⭐".repeat(rating)}</p>
      <p>${escapeHtml(comment)}</p>

      <div class="actions">
        <button type="button" onclick="like(this)">👍 0</button>
        <button type="button" onclick="dislike(this)">👎 0</button>
      </div>
    `;

    comments.prepend(div);

    form.reset();
    rating = 5;
  });
}

function like(btn) {
  const count = parseInt(btn.textContent.replace(/\D/g, "")) || 0;
  btn.textContent = `👍 ${count + 1}`;
}

function dislike(btn) {
  const count = parseInt(btn.textContent.replace(/\D/g, "")) || 0;
  btn.textContent = `👎 ${count + 1}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
      }
