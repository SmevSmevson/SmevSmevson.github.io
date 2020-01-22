"use strict";

var usingSW = ("serviceWorker" in navigator);
var swRegistration;
var svcWorker;

initServiceWorker().catch(console.error);

// **********************************

async function initServiceWorker() {
    swRegistration = await navigator.serviceWorker.register("/sw.js", {
        updateViaCache: "none"
    });

    svcWorker = swRegistration.installing || swRegistration.waiting || swRegistration.active;

    navigator.serviceWorker.addEventListener("controllerchange", function onControllerChange() {
        svcWorker = navigator.serviceWorker.controller;
    })
};
