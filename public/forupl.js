const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const pictureIdInput = document.getElementById("pictureId");

imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];
  if (!file) return;

  // 即席プレビュー（確実）
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/bbs/pictures/temp", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  pictureIdInput.value = data.pictureId;
});