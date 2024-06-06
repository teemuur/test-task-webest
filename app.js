document.addEventListener("DOMContentLoaded", () => {
  updateValuesFromLocalStorage();
  const viewProductButtons = document.querySelectorAll(
    ".product-card__add-to-cart"
  );
  const overlay = document.querySelector(".overlay");
  const modal = document.querySelector(".modal");
  const modalContent = modal.querySelector(".modal-content");

  function addToLocalStorage(node, value) {
    localStorage.setItem(
      "data",
      JSON.stringify({ ...readFromLocalStorage(), [node]: value })
    );
  }

  function readFromLocalStorage() {
    return JSON.parse(localStorage.getItem("data")) || {};
  }

  function updateValuesFromLocalStorage() {
    const storedData = readFromLocalStorage();
    Object.keys(storedData).forEach((key) => {
      document.getElementById(key).querySelector(".counter__input").value =
        storedData[key];
    });
  }

  function addToCart() {
    const cart = document.querySelector(".cart-count");
    const currentValue = Number(cart.textContent);
    cart.textContent = currentValue + 1;
  }

  viewProductButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      // Получаем верстку
      const res = await fetch(window.location.href);
      const html = await res.text();

      // Создаем временный контейнер
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = html;

      // Находим карточку товара
      const productCardNodes = tempContainer.querySelectorAll(".product-card");
      const selectedProductCard = Array.from(productCardNodes).find(
        (card) => card.id === e.target.parentNode.id
      );
      selectedProductCard
        .querySelector(".product-card__description")
        .removeAttribute("hidden");
      modalContent.innerHTML = selectedProductCard.outerHTML;
      modalContent.querySelector(".counter__input").value =
        readFromLocalStorage()[selectedProductCard.id];

      const viewButton = modalContent.querySelector(
        ".product-card__add-to-cart"
      );
      viewButton.textContent = "Добавить в корзину";

      viewButton.addEventListener("click", () => {
        alert("Товар добавлен в корзину");
        addToCart();
      });
      modal.classList.add("active");
      overlay.classList.add("active");
    });
  });

  overlay.addEventListener("click", () => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Управление счетчиками
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("counter__increase")) {
      const input =
        e.target.previousElementSibling.querySelector(".counter__input");
      input.value = parseInt(input.value) + 1;
      const nodeId = e.target.closest(".product-card").id;
      addToLocalStorage(nodeId, input.value);
      updateValuesFromLocalStorage();
    }

    if (e.target.classList.contains("counter__decrease")) {
      const input =
        e.target.nextElementSibling.querySelector(".counter__input");
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        const nodeId = e.target.closest(".product-card").id;
        addToLocalStorage(nodeId, input.value);
        updateValuesFromLocalStorage();
      }
    }
  });
});
