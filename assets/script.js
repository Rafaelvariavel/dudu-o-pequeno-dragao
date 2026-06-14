let rating = 5;

function setRating(value) {
  rating = value;
}

const form = document.getElementById("commentForm");
const comments = document.getElementById("comments");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function like(btn) {
  const count = parseInt(btn.textContent.replace(/\D/g, ""), 10) || 0;
  btn.textContent = `👍 ${count + 1}`;
}

function dislike(btn) {
  const count = parseInt(btn.textContent.replace(/\D/g, ""), 10) || 0;
  btn.textContent = `👎 ${count + 1}`;
}

if (form && comments) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!name || !comment) return;

    const item = document.createElement("div");
    item.className = "comment";

    item.innerHTML = `
      <strong>${escapeHtml(name)}</strong>
      <p>${"⭐".repeat(rating)}</p>
      <p>${escapeHtml(comment)}</p>
      <div class="actions">
        <button type="button">👍 0</button>
        <button type="button">👎 0</button>
      </div>
    `;

    const [likeBtn, dislikeBtn] = item.querySelectorAll(".actions button");
    likeBtn.addEventListener("click", () => like(likeBtn));
    dislikeBtn.addEventListener("click", () => dislike(dislikeBtn));

    comments.prepend(item);
    form.reset();
    rating = 5;
  });
      }  });
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
