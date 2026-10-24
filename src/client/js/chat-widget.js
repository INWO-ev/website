/**
 * Gesell chat mockup (spec section 8.1). Talks to POST /api/chat, which in
 * Phase 1 is backed by a static JSON file, not a real RAG pipeline. Already
 * uses the future API shape so the UI will not need rebuilding later.
 */
export function initChatWidget() {
  const fab = document.getElementById('chat-fab');
  const dialog = document.getElementById('chat-dialog');
  const closeBtn = document.getElementById('chat-dialog-close');
  const messages = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const chips = Array.from(document.querySelectorAll('[data-chat-question]'));

  if (!fab || !dialog || !closeBtn || !messages || !form || !input) return;

  const open = () => {
    dialog.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    input.focus();
  };

  const close = () => {
    dialog.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
  };

  fab.addEventListener('click', () => {
    if (dialog.hidden) open();
    else close();
  });

  closeBtn.addEventListener('click', close);

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  function appendMessage(role, text, source) {
    const el = document.createElement('p');
    el.className = `chat-message chat-message--${role}`;
    el.textContent = text;
    if (source) {
      const sourceEl = document.createElement('span');
      sourceEl.className = 'chat-message__source';
      sourceEl.textContent = `Quelle: ${source}`;
      el.appendChild(sourceEl);
    }
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(message) {
    appendMessage('user', message);
    input.value = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) {
        appendMessage('bot', data.error ?? 'Es ist ein Fehler aufgetreten.');
        return;
      }
      appendMessage('bot', data.answer, data.source);
    } catch (error) {
      appendMessage('bot', 'Der Prototyp ist gerade nicht erreichbar. Bitte später erneut versuchen.');
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    sendMessage(message);
  });

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-chat-question');
      if (question) sendMessage(question);
    });
  }
}
