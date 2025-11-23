// Seleção de elementos
const menu = document.getElementById("menu");
const cartModal = document.getElementById("cart-modal");
const cartBtn = document.getElementById("cart-btn");
const cartItemsContainer = document.getElementById("card-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const adressInput = document.getElementById("adress");
const addressWarn = document.getElementById("address-warn");
let cart = [];

// Abrir Modal
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal clicando fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar ao clicar no botão
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = Number(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// Função para adcionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Atualiza carrinho

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
    <div class = "flex items-center justify-between">
    <div>
    <p class = "font-bold mb-2" >${item.name} </p>
     <p class = "font-medium" >Quantidade:${item.quantity} </p>
        <p class= "font-medium mt-2"> R$${item.price.toFixed(2)} </p>
    </div>

    <button class = "remove-from-cart-btn bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md cursor-pointer" data-name = "${
      item.name
    }">Remover</button>
   
    </div>
    `;
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });
  cartTotal.innerText = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  cartCounter.innerText = cart.length;
}

// Função para remover do carrinho

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

adressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    adressInput.classList.remove("border-red-500");
  }

  //
});

checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) return;

  const isOpen = checkRestaurantOpen();

  if (!isOpen) {
    Toastify({
      text: "Restaurante fechado. Nosso horário de funcionamento é das 18 as 22:00",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (adressInput.value === "") {
    addressWarn.classList.remove("hidden");
    adressInput.classList.add("border-red-500");
    return;
  }

  // Enviar pedido whatsapp

  let total = 0;
  const cartItems = cart

    .map((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      return `• *${item.name}*  
  Quantidade: ${item.quantity}  
  Preço: R$ ${item.price.toFixed(2)}  
  Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    })
    .join("\n");

  const message = `
🧾 *NOVO PEDIDO*  
----------------------------------  
${cartItems}
----------------------------------  
*TOTAL:* R$ *${total.toFixed(2)}*

📍 *Endereço:* ${adressInput.value}
  `;

  const phone = "5511987698148";

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
  cart.length = 0;
  updateCartModal();
});

function checkRestaurantOpen() {
  const data = new Date();
  const dia = data.getDay();
  const hora = data.getHours();
  const abreHoje = dia !== 1;
  const horarioValido = hora >= 18 && hora < 22;
  return abreHoje && horarioValido;
}

const SpanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  SpanItem.classList.remove("bg-red-500");
  SpanItem.classList.add("bg-green-600");
} else {
  SpanItem.classList.add("bg-red-500");
  SpanItem.classList.remove("bg-green-600");
}
