document.addEventListener("DOMContentLoaded", function () {

    const languageStorageKey = "formifable-language";


    let currentLanguage =
        localStorage.getItem(languageStorageKey) || "en";


    let translations = {};


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


    async function loadLanguage(language) {

        try {

            const response =
                await fetch(`languages/${language}.json`);


            if (!response.ok) {

                throw new Error(
                    `Language file ${language}.json could not be loaded`
                );

            }


            translations = await response.json();


            currentLanguage = language;


            localStorage.setItem(
                languageStorageKey,
                language
            );


            document.documentElement.lang = language;


            const pageTitle =
                getTranslation("home.meta.title");


            if (pageTitle !== "home.meta.title") {
                document.title = pageTitle;
            }


            document
                .querySelectorAll("[data-i18n]")
                .forEach(function (element) {

                    const translationKey =
                        element.dataset.i18n;


                    const translatedText =
                        getTranslation(translationKey);


                    if (translatedText !== translationKey) {

                        element.textContent =
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

        } catch (error) {

            console.error(
                "Language loading error:",
                error
            );

        }

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


    loadLanguage(currentLanguage);

});