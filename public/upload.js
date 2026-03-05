const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const form = document.getElementById("uploadForm");

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("dragover", function (e) {
  e.preventDefault();
});

document.addEventListener("drop", function (e) {
  e.preventDefault();
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const dt = new DataTransfer();
  dt.items.add(file);
  fileInput.files = dt.files;

  form.submit();
});
