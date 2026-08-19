document.addEventListener("DOMContentLoaded", function () {

    const languageStorageKey = "formifable-language";
    const cartStorageKey = "formifable-cart";


    const productCatalog = {

        dragon: {
            image: "./images/toy-dragon.jpg",
            price: 24.90
        },

        dinosaur: {
            image: "./images/toy-dinosaur.jpeg",
            price: 18.90
        },

        octopus: {
            image: "./images/toy-octopus.jpeg",
            price: 21.90
        },

        cube: {
            image: "./images/toy-cube.jpg",
            price: 16.90
        }

    };


    let translations = {};


    let currentLanguage =
        localStorage.getItem(languageStorageKey) || "en";


    let selectedProductId = null;


    const productModal =
        document.getElementById("productModal");


    const cartModal =
        document.getElementById("cartModal");


    const cartItems =
        document.getElementById("cartItems");


    const cartEmpty =
        document.getElementById("cartEmpty");


    const cartTotal =
        document.getElementById("cartTotal");


    const cartModalTitle =
        document.getElementById("cartModalTitle");


    const cartTotalLabel =
        document.getElementById("cartTotalLabel");


    const checkoutButton =
        document.getElementById("checkoutButton");


    const modalProductImage =
        document.getElementById("modalProductImage");


    const modalProductName =
        document.getElementById("modalProductName");


    const modalProductDescription =
        document.getElementById("modalProductDescription");


    const modalProductDetails =
        document.getElementById("modalProductDetails");


    const modalProductPrice =
        document.getElementById("modalProductPrice");


    const modalDetailsLink =
        document.getElementById("modalDetailsLink");


    const toast =
        document.getElementById("toast");


    /* Übersetzung abrufen */

    function getTranslation(key) {

        const keyParts = key.split(".");

        let value = translations;


        for (const part of keyParts) {

            if (
                value === undefined ||
                value === null
            ) {
                return key;
            }


            value = value[part];

        }


        return value ?? key;

    }


    /* Preis formatieren */

    function formatPrice(price) {

        return new Intl.NumberFormat(
            currentLanguage === "de"
                ? "de-DE"
                : "en-GB",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(price);

    }


    /* Sprache laden */

    async function loadLanguage(language) {

        try {

            const response =
                await fetch(`./languages/${language}.json`);


            if (!response.ok) {

                throw new Error(
                    `Could not load ${language}.json`
                );

            }


            translations =
                await response.json();


            currentLanguage = language;


            localStorage.setItem(
                languageStorageKey,
                language
            );


            document.documentElement.lang =
                language;


            document.title =
                getTranslation("meta.title");


            document
                .querySelectorAll("[data-i18n]")
                .forEach(function (element) {

                    const translationKey =
                        element.dataset.i18n;


                    const translatedText =
                        getTranslation(translationKey);


                    if (
                        translatedText !== translationKey
                    ) {

                        element.textContent =
                            translatedText;

                    }

                });


            document
                .querySelectorAll(
                    "[data-i18n-placeholder]"
                )
                .forEach(function (element) {

                    const translationKey =
                        element.dataset.i18nPlaceholder;


                    const translatedText =
                        getTranslation(translationKey);


                    if (
                        translatedText !== translationKey
                    ) {

                        element.placeholder =
                            translatedText;

                    }

                });


            document
                .querySelectorAll(".language-button")
                .forEach(function (button) {

                    button.classList.toggle(
                        "active",
                        button.dataset.language === language
                    );

                });


            if (
                productModal.classList.contains("open") &&
                selectedProductId
            ) {

                updateModalContent(
                    selectedProductId
                );

            }


            if (
                cartModal.classList.contains("open")
            ) {

                renderCart();

            }


            updateCartCount();

        } catch (error) {

            console.error(
                "Language loading error:",
                error
            );

        }

    }


    /* Sprache wechseln */

    document
        .querySelectorAll(".language-button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    loadLanguage(
                        button.dataset.language
                    );

                }
            );

        });


    /* Produkt öffnen */

    document
        .querySelectorAll("[data-product-id]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    openProductModal(
                        button.dataset.productId
                    );

                }
            );

        });


    function openProductModal(productId) {

        if (!productCatalog[productId]) {
            return;
        }


        selectedProductId = productId;


        updateModalContent(productId);


        productModal.classList.add("open");


        productModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );

    }


    function updateModalContent(productId) {

        const product =
            productCatalog[productId];


        modalProductImage.src =
            product.image;


        modalProductImage.alt =
            getTranslation(
                `products.items.${productId}.name`
            );


        modalProductName.textContent =
            getTranslation(
                `products.items.${productId}.name`
            );


        modalProductDescription.textContent =
            getTranslation(
                `products.items.${productId}.shortDescription`
            );


        modalProductDetails.textContent =
            getTranslation(
                `products.items.${productId}.details`
            );


        modalProductPrice.textContent =
            formatPrice(product.price);


        modalDetailsLink.href =
            `./product.html?id=${productId}`;

    }


    /* Produkt schließen */

    function closeProductModal() {

        productModal.classList.remove("open");


        productModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );

    }


    function openCartModal() {

        renderCart();


        cartModal.classList.add("open");


        cartModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );

    }


    function closeCartModal() {

        cartModal.classList.remove("open");


        cartModal.setAttribute(
            "aria-hidden",
            "true"
        );


        if (
            !productModal.classList.contains("open")
        ) {

            document.body.classList.remove(
                "modal-open"
            );

        }

    }


    document
        .getElementById("closeModalButton")
        .addEventListener(
            "click",
            closeProductModal
        );


    productModal.addEventListener(
        "click",
        function (event) {

            if (event.target === productModal) {

                closeProductModal();

            }

        }
    );


    document
        .getElementById("closeCartButton")
        .addEventListener(
            "click",
            closeCartModal
        );


    cartModal.addEventListener(
        "click",
        function (event) {

            if (event.target === cartModal) {

                closeCartModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                cartModal.classList.contains("open")
            ) {

                closeCartModal();

                return;

            }


            if (
                event.key === "Escape" &&
                productModal.classList.contains("open")
            ) {

                closeProductModal();

            }

        }
    );


    /* Warenkorb */

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    cartStorageKey
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            cartStorageKey,
            JSON.stringify(cart)
        );


        updateCartCount();


        if (
            cartModal.classList.contains("open")
        ) {

            renderCart();

        }

    }


    function updateCartCount() {

        const cart = getCart();


        const totalQuantity =
            cart.reduce(
                function (total, item) {

                    return total +
                        item.quantity;

                },
                0
            );


        document
            .getElementById("cartCount")
            .textContent = totalQuantity;

    }


    function getCartProductName(productId) {

        return getTranslation(
            `products.items.${productId}.name`
        );

    }


    function getCartText(key) {

        if (key === "empty") {
            return getTranslation("cart.empty");
        }


        return getTranslation(
            `cart.modal.${key}`
        );

    }


    function renderCart() {

        const cart =
            getCart().filter(function (item) {

                return productCatalog[item.productId];

            });


        cartModalTitle.textContent =
            getCartText("title");


        cartEmpty.textContent =
            getCartText("empty");


        cartTotalLabel.textContent =
            getCartText("total");


        checkoutButton.textContent =
            getCartText("checkout");


        cartItems.innerHTML = "";


        if (cart.length === 0) {

            cartEmpty.classList.add("show");
            cartItems.hidden = true;
            checkoutButton.disabled = true;
            cartTotal.textContent =
                formatPrice(0);

            return;

        }


        cartEmpty.classList.remove("show");
        cartItems.hidden = false;
        checkoutButton.disabled = false;


        let total = 0;


        cart.forEach(function (item) {

            const product =
                productCatalog[item.productId];


            const quantity =
                Math.max(1, Number(item.quantity) || 1);


            const itemTotal =
                product.price * quantity;


            total += itemTotal;


            const row =
                document.createElement("article");


            row.className = "cart-item";


            const image =
                document.createElement("img");


            image.src = product.image;
            image.alt =
                getCartProductName(item.productId);


            const information =
                document.createElement("div");


            information.className =
                "cart-item-information";


            const name =
                document.createElement("h3");


            name.textContent =
                getCartProductName(item.productId);


            const price =
                document.createElement("p");


            price.textContent =
                formatPrice(product.price);


            information.appendChild(name);
            information.appendChild(price);


            const controls =
                document.createElement("div");


            controls.className =
                "quantity-control";


            const decreaseButton =
                document.createElement("button");


            decreaseButton.type = "button";
            decreaseButton.textContent = "−";
            decreaseButton.setAttribute(
                "aria-label",
                "Decrease quantity"
            );


            const quantityValue =
                document.createElement("span");


            quantityValue.textContent = quantity;


            const increaseButton =
                document.createElement("button");


            increaseButton.type = "button";
            increaseButton.textContent = "+";
            increaseButton.setAttribute(
                "aria-label",
                "Increase quantity"
            );


            decreaseButton.addEventListener(
                "click",
                function () {

                    changeCartQuantity(
                        item.productId,
                        quantity - 1
                    );

                }
            );


            increaseButton.addEventListener(
                "click",
                function () {

                    changeCartQuantity(
                        item.productId,
                        quantity + 1
                    );

                }
            );


            controls.appendChild(decreaseButton);
            controls.appendChild(quantityValue);
            controls.appendChild(increaseButton);


            const itemTotalElement =
                document.createElement("strong");


            itemTotalElement.className =
                "cart-item-total";


            itemTotalElement.textContent =
                formatPrice(itemTotal);


            const removeButton =
                document.createElement("button");


            removeButton.className =
                "cart-remove-button";


            removeButton.type = "button";
            removeButton.textContent =
                getCartText("remove");


            removeButton.addEventListener(
                "click",
                function () {

                    removeCartProduct(
                        item.productId
                    );

                }
            );


            row.appendChild(image);
            row.appendChild(information);
            row.appendChild(controls);
            row.appendChild(itemTotalElement);
            row.appendChild(removeButton);


            cartItems.appendChild(row);

        });


        cartTotal.textContent =
            formatPrice(total);

    }


    function changeCartQuantity(
        productId,
        quantity
    ) {

        const cart = getCart();


        const product =
            cart.find(function (item) {

                return item.productId === productId;

            });


        if (!product) {
            return;
        }


        product.quantity = quantity;


        saveCart(
            cart.filter(function (item) {

                return item.quantity > 0;

            })
        );

    }


    function removeCartProduct(productId) {

        saveCart(
            getCart().filter(function (item) {

                return item.productId !== productId;

            })
        );

    }


    function addSelectedProductToCart() {

        if (
            !selectedProductId ||
            !productCatalog[selectedProductId]
        ) {
            return;
        }


        const cart = getCart();


        const existingProduct =
            cart.find(function (item) {

                return (
                    item.productId ===
                    selectedProductId
                );

            });


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                productId:
                    selectedProductId,

                quantity: 1,

                price:
                    productCatalog[
                        selectedProductId
                    ].price

            });

        }


        saveCart(cart);


        showToast(
            getTranslation(
                "messages.addedToCart"
            )
        );

    }


    document
        .getElementById(
            "modalAddToCartButton"
        )
        .addEventListener(
            "click",
            addSelectedProductToCart
        );


    document
        .getElementById("cartButton")
        .addEventListener(
            "click",
            openCartModal
        );


    checkoutButton.addEventListener(
        "click",
        function () {

            showToast(
                getCartText("comingSoon")
            );

        }
    );


    /* Newsletter */

    document
        .getElementById("newsletterForm")
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const emailInput =
                    document.getElementById(
                        "emailInput"
                    );


                if (!emailInput.value.trim()) {
                    return;
                }


                showToast(
                    getTranslation(
                        "messages.subscribed"
                    )
                );


                emailInput.value = "";

            }
        );


    /* Benachrichtigung */

    function showToast(message) {

        toast.textContent = message;


        toast.classList.add("show");


        clearTimeout(
            window.formifableToastTimer
        );


        window.formifableToastTimer =
            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 2500);

    }


    /* Erster Ladevorgang */

    updateCartCount();


    loadLanguage(
        currentLanguage
    );

});
