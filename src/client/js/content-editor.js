const PENCIL_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';

const state = {
  dialog: null,
  textarea: null,
  hint: null,
  status: null,
  saveButton: null,
  current: null,
};

/**
 * Adds a small pencil button to every element that carries data-edit-path.
 * Clicking it opens a dialog and PATCHes /api/content, which updates the
 * single MongoDB content document. No login yet, by design for this phase.
 */
export function initContentEditor() {
  const fields = document.querySelectorAll('[data-edit-path]');
  if (!fields.length) return;

  fields.forEach(prepareField);
  buildDialog();
}

function prepareField(element) {
  if (element.dataset.editReady === '1') return;
  element.dataset.editReady = '1';

  const path = element.dataset.editPath;
  if (!path) return;

  const label = element.dataset.editLabel || 'Text';
  const anchor = element.closest('a');
  const button = element.closest('button');
  const placeAfter = element.dataset.editChip !== 'inside' && Boolean(anchor || button);

  // Wrap the current text so later updates replace only the text, never the
  // pencil button itself.
  const textSpan = document.createElement('span');
  textSpan.className = 'editable-text';
  while (element.firstChild) textSpan.appendChild(element.firstChild);
  element.appendChild(textSpan);

  const pencil = document.createElement('button');
  pencil.type = 'button';
  pencil.className = 'edit-pencil';
  pencil.innerHTML = PENCIL_ICON;
  pencil.title = 'Text bearbeiten';
  pencil.setAttribute('aria-label', 'Text bearbeiten: ' + label);
  pencil.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openEditor(path, textSpan, label);
  });

  if (placeAfter) {
    (anchor || button || element).insertAdjacentElement('afterend', pencil);
  } else {
    element.appendChild(pencil);
  }
}

function buildDialog() {
  if (state.dialog) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'edit-dialog';
  dialog.innerHTML =
    '<form class="edit-dialog__form" method="dialog" novalidate>' +
    '<h2>Text bearbeiten</h2>' +
    '<p class="edit-dialog__hint"></p>' +
    '<textarea rows="6" maxlength="5000" spellcheck="true" aria-label="Text"></textarea>' +
    '<p class="edit-dialog__status" role="status" aria-live="polite"></p>' +
    '<div class="edit-dialog__actions">' +
    '<button type="button" class="btn btn--ghost" data-action="cancel">Abbrechen</button>' +
    '<button type="submit" class="btn btn--accent" data-action="save">Speichern</button>' +
    '</div>' +
    '</form>';

  document.body.appendChild(dialog);

  state.dialog = dialog;
  state.textarea = dialog.querySelector('textarea');
  state.hint = dialog.querySelector('.edit-dialog__hint');
  state.status = dialog.querySelector('.edit-dialog__status');
  state.saveButton = dialog.querySelector('[data-action="save"]');

  const form = dialog.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void save();
  });

  dialog.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    dialog.close();
  });
}

function openEditor(path, textSpan, label) {
  buildDialog();
  state.current = { path, textSpan, label };
  state.hint.textContent = label + ' – Änderungen sind sofort für alle sichtbar.';
  state.textarea.value = textSpan.textContent;
  state.status.textContent = '';
  state.dialog.showModal();
  state.textarea.focus();
  state.textarea.setSelectionRange(state.textarea.value.length, state.textarea.value.length);
}

async function save() {
  if (!state.current) return;

  const value = state.textarea.value;
  state.saveButton.disabled = true;
  state.status.textContent = '';

  try {
    const response = await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: state.current.path, value }),
    });

    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.error || 'Speichern fehlgeschlagen.');
    }

    state.current.textSpan.textContent = typeof data.value === 'string' ? data.value : value;
    const savedLabel = state.current.label;
    state.dialog.close();
    showToast('Gespeichert: ' + savedLabel);
  } catch (error) {
    state.status.textContent = error.message || 'Speichern fehlgeschlagen.';
  } finally {
    state.saveButton.disabled = false;
  }
}

let toastTimer = null;

function showToast(message) {
  let toast = document.querySelector('.edit-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'edit-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('edit-toast--visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('edit-toast--visible');
  }, 2600);
}
