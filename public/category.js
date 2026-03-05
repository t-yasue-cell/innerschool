document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('new-category');
  if (!input) return; // ← ページに無い場合は何もしない

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  });
});

function addCategory() {
  const input = document.getElementById('new-category');
  if (!input) return;

  const name = input.value.trim();
  if (!name) return;

  const exists = [...document.querySelectorAll(
    'input[name="category[]"]'
  )].some(cb => cb.value === name);

  if (exists) {
    alert('すでに追加されています');
    return;
  }

  const label = document.createElement('label');
  label.style.display = 'block';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = 'category[]';
  checkbox.value = name;
  checkbox.setAttribute('form','edit');
  checkbox.checked = true;

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(' ' + name));

  document.getElementById('category-checkboxes')
    .appendChild(label);

  input.value = '';
}

