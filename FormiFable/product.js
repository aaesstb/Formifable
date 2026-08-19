document.addEventListener("DOMContentLoaded", function () {

    const languageStorageKey = "formifable-language";
    const cartStorageKey = "formifable-cart";


    const products = {

        dragon: {
            price: 24.90,
            category: "printedToy",
            images: [
                "images/toy-dragon.jpg",
                "images/toy-coral.webp",
                "images/toy-dark.jpg"
            ]
        },

        dinosaur: {
            price: 18.90,
            category: "printedToy",
            images: [
                "images/toy-dinosaur.jpeg"
            ]
        },

        octopus: {
            price: 21.90,
            category: "printedToy",
            images: [
                "images/toy-octopus.jpeg"
            ]
        },

        cube: {
            price: 16.90,
            category: "sensoryToy",
            images: [
                "images/toy-cube.jpg"
            ]
        }

    };


    let translations = {};
    let currentLanguage =
        localStorage.getItem(languageStorageKey) || "en";

    const urlProductId =
        new URLSearchParams(window.location.search).get("id");

    const productId =
        products[urlProductId] ? urlProductId : "dragon";

    const product = products[productId];


    const productMainImage =
        document.getElementById("productMainImage");

    const productThumbnails =
        document.getElementById("productThumbnails");

    const productCategory =
        document.getElementById("productCategory");

    const productName =
        document.getElementById("productName");

    const productShortDescription =
        document.getElementById("productShortDescription");

    const productPrice =
        document.getElementById("productPrice");

    const productDetails =
        document.getElementById("productDetails");

    const productFeatures =
        document.getElementById("productFeatures");

    const toast =
        document.getElementById("toast");


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


    async function loadLanguage(language) {

        try {

            const response =
                await fetch(`languages/${language}.json`);

            if (!response.ok) {
                throw new Error(`Could not load ${language}.json`);
            }

            translations = await response.json();
            currentLanguage = language;

            localStorage.setItem(
                languageStorageKey,
                language
            );

            document.documentElement.lang = language;

            document
                .querySelectorAll("[data-i18n]")
                .forEach(function (element) {

                    const translationKey =
                        element.dataset.i18n;

                    const translatedText =
                        getTranslation(translationKey);

                    if (translatedText !== translationKey) {
                        element.textContent = translatedText;
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

            updateProductContent();
            updateCartCount();

        } catch (error) {

            console.error(
                "Language loading error:",
                error
            );

        }

    }


    function updateProductContent() {

        const productTranslationKey =
            `products.items.${productId}`;


        const productNameText =
            getTranslation(
                `${productTranslationKey}.name`
            );


        const productFeaturesList =
            getTranslation(
                `${productTranslationKey}.features`
            );


        const productCategoryKey =
            productId === "cube"
                ? "sensoryToy"
                : "printedToy";

        document.title =
            `FormiFable | ${productNameText}`;

        productCategory.textContent =
            getTranslation(
                `productPage.categories.${productCategoryKey}`
            );

        productName.textContent =
            productNameText;

        productShortDescription.textContent =
            getTranslation(
                `${productTranslationKey}.shortDescription`
            );

        productDetails.textContent =
            getTranslation(
                `${productTranslationKey}.details`
            );

        productPrice.textContent =
            formatPrice(product.price);

        productMainImage.alt =
            productNameText;

        document.getElementById("backLink").textContent =
            getTranslation("productPage.backToShop");

        document.getElementById("continueShoppingLink").textContent =
            getTranslation("buttons.continueShopping");

        document.getElementById("detailsTitle").textContent =
            getTranslation("productPage.details");

        document.getElementById("featuresTitle").textContent =
            getTranslation("productPage.features");

        productFeatures.innerHTML = "";

        productFeaturesList.forEach(function (feature) {

            const item = document.createElement("li");
            item.textContent = feature;
            productFeatures.appendChild(item);

        });

    }


    function buildGallery() {

        productMainImage.src =
            product.images[0];

        productThumbnails.innerHTML = "";

        product.images.forEach(function (image, index) {

            const button = document.createElement("button");
            button.className = "product-thumbnail";
            button.type = "button";
            button.setAttribute(
                "aria-label",
                `Show product photo ${index + 1}`
            );

            if (index === 0) {
                button.classList.add("active");
            }

            const thumbnail = document.createElement("img");
            thumbnail.src = image;
            thumbnail.alt = "";

            button.appendChild(thumbnail);

            button.addEventListener(
                "click",
                function () {

                    productMainImage.src = image;

                    productThumbnails
                        .querySelectorAll(".product-thumbnail")
                        .forEach(function (thumbnailButton) {

                            thumbnailButton.classList.remove("active");

                        });

                    button.classList.add("active");

                }
            );

            productThumbnails.appendChild(button);

        });

    }


    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem(cartStorageKey)
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

    }


    function updateCartCount() {

        const cart = getCart();

        const totalQuantity =
            cart.reduce(
                function (total, item) {

                    return total + item.quantity;

                },
                0
            );

        document
            .getElementById("cartCount")
            .textContent = totalQuantity;

    }


    function addProductToCart() {

        const cart = getCart();

        const existingProduct =
            cart.find(function (item) {

                return item.productId === productId;

            });

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                productId: productId,
                quantity: 1,
                price: product.price
            });
        }

        saveCart(cart);

        showToast(
            getTranslation("messages.addedToCart")
        );

    }


    function showToast(message) {

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(window.formifableToastTimer);

        window.formifableToastTimer =
            setTimeout(function () {

                toast.classList.remove("show");

            }, 2500);

    }


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

    document
        .getElementById("addToCartButton")
        .addEventListener(
            "click",
            addProductToCart
        );

    document
        .getElementById("cartButton")
        .addEventListener(
            "click",
            function () {

                const cart = getCart();

                if (cart.length === 0) {

                    showToast(
                        getTranslation("cart.empty")
                    );

                    return;

                }

                const totalQuantity =
                    cart.reduce(
                        function (total, item) {

                            return total + item.quantity;

                        },
                        0
                    );

                showToast(
                    `${getTranslation("cart.items")}: ${totalQuantity}`
                );

            }
        );


    buildGallery();
    loadLanguage(currentLanguage);

});
