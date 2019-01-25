"use strict";
/* global dhtmlx, JApp */
class BitGanjUser {
    constructor(data) {
        var keyExistsOn = (o, k) => k.split(".").reduce((a, c) => a.hasOwnProperty(c) ? a[c] || 1 : false, o) === false ? false : true;
        var vMenu = document.getElementById("myNav");
        this.isInitialized = false;
        this.userId = data.userId;
        this.userProperties = data.userProperties;
        this.userRights = data.userRights;
        this.hasActiveOrder = data.hasActiveOrder;
        var isSessionsWindow = sessionStorage.getItem("isSessionsWindow");
        if (isSessionsWindow === "true") {
            if (keyExistsOn(this.userRights, "SESSIONS")) {
                JApp.startControl("wndSessions");
            }
        }
        this.update = function (data) {
            if (data !== null) {
                this.userId = data.userId;
                this.userProperties = data.userProperties;
                this.userRights = data.userRights;
                this.hasActiveOrder = data.hasActiveOrder;
            }
        };
        this.openNav = function () {
            if ($("#myNav").length) {
                var currentHeight = document.getElementById("myNav").style.height;
                if (currentHeight === "0%") {
                    document.getElementById("myNav").style.height = "100%";
                }
                else {
                    document.getElementById("myNav").style.height = "0%";
                }
                ;
            }
            ;
        };
        this.getMenu = function () {
            return vMenu;
        };
        this.notifyAboutOrder = function () {
            if (this.hasActiveOrder === true) {
                dhtmlx.message({
                    type: "error",
                    text: "У Вас есть не завершённый заказ!",
                    expire: 5000
                });
            }
        };
    }
}
;
