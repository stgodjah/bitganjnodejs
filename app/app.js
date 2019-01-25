"use strict";
/* global JApp, http, dhtmlx, win, loadData, api  */
class BitGanj {
    constructor() {
        //var pageName = "";
        //var checkNonceURL = "";
        //var checkRefreshTimer = 0;
        //var vAuthenticator = null;
        //var api = new XHR();
        //var currentUser = null;
        //var currentOrder = null;
        //var sessionsWindow = null;
        //var activateControl = "";
        this.pageName = "";
        this.dhxWins = null;
        this.checkInterval = null;
        this.navMenu = null;
        this.vLastError = "";
        this.isActiveCallExists = false;
        this.isOrderFinished = false;
    }
    
    get page() {
        return this.pageName;
    }
    set page(value) {
        this.pageName = value;
    }
        
    setAuthResponce(StartAuthResponce) {
            if (StartAuthResponce !== null) {
                var authWindow = $("#accordion").children();
                var count = authWindow.length;
                if (count === 1) {
                    authWindow.children().show();
                };
                switch (StartAuthResponce.authType) {
                    case 'BitId':
                        $("#idImageNonce").attr('src', "/" + StartAuthResponce.qr_uri);
                        $("#idNonceLink").attr('href', StartAuthResponce.bitid_uri);
                        $("#idNonce").attr('href', StartAuthResponce.nonce);
                        vAuthenticator.checkNonceURL = StartAuthResponce.ajax_uri;
                        $("#idEmailIdIdent").remove();
                        $("#idTelegramIdIdent").remove();
                        vAuthenticator.refreshInterval = StartAuthResponce.refresh_interval;
                        break;
                    case 'TelegramId':
                        $("#idImageBotNonce").attr('src', "/" + StartAuthResponce.qr_uri);
                        $("#idBotNonceLink").attr('href', StartAuthResponce.bot_uri);
                        $("#idNonce").attr('href', StartAuthResponce.nonce);
                        $("#idImageBotNonce").on("click", function () {
                            console.log("tg://resolve?domain=");
                        });
                        vAuthenticator.checkNonceURL = StartAuthResponce.ajax_uri;
                        $("#idBitIdIdent").remove();
                        $("#idEmailIdIdent").remove();
                        vAuthenticator.refreshInterval = StartAuthResponce.refresh_interval;
                        break;
                    default:
                        break;
                };
            }
        }
    
    startControl(cntrl) {
            activateControl = cntrl;
            api.get("/api/GetVer", null, this.processServerInfo);
        }
    
    processServerInfo(data) {
            let srvInf = JSON.parse(data.responseText);
            let serverInfo = {
                serverVersion: srvInf.Core,
                serverDateTime: srvInf.ServerTime,
                dbTime: srvInf.DBTime
            };
            if (activateControl === "wndSessions") {
                if (sessionsWindow === null) {
                    sessionsWindow = new wndSessions(JApp.dhxWins);
                };
                sessionsWindow.init(serverInfo);
            }
        }
    
    registerUser() {
            api.post("/api/registerUser", null, this.processResponce);
        }
    
    checkMailCode() {
            var vCode = $('#inputVCode').val();
            var vParams = {
                mailCode: vCode
            };
            api.post("/api/checkMailCode", vParams, this.processResponce);
    }
        
    sendMailId() { let pMail = $('#inputEmail').val();
            let vAuthenticator = new AuthType('EmailId');
            vAuthenticator.mail = pMail;
            api.post("/api/sendMailId", vAuthenticator, this.processResponce);
    }
        
    static showErrorWindow(vMsg, vIsNeedRefresh, vIsNeedToKillSession) {
            dhtmlx.alert({
                title: "Ошибка!",
                type: "alert-error",
                text: vMsg,
                callback: function () {
                    if (vIsNeedToKillSession) {
                        JApp.activatePage('kill');
                    } else if (vIsNeedRefresh) {
                        JApp.refreshPage();
                    };
                }
            });
    }

    getCurrentUser() {
            return currentUser !== null ? currentUser : false;
    }
        
    buttonPush() {
            if (!api.busy()) {
                BitGanj.clickSound();
                if (currentUser !== null) {
                    currentUser.openNav();
                } else {
                    dhtmlx.confirm({
                        title: "Внимание!",
                        type: "confirm-warning",
                        text: "Вы действительно желаете закрыть текущую сессию?",
                        callback: function (result) {
                            if (result) {
                                JApp.activatePage('kill');
                            }
                        }
                    });
                }
            };
    }
        
    selectPayProvider(pProvider) {
            if ((currentOrder !== null) && (pProvider !== null)) {
                var vDialogPointInfo = $("#dialogSPBody");
                vDialogPointInfo.children().empty();
                vDialogPointInfo.children().append("<img id='imgWaitForPaymentProviders' src='/img/WaitCover.gif'/>");
                var vParams = {
                    pProvider: pProvider
                };
                api.post("/api/Order", vParams, JApp.processResponce);
            }
    }
        
    checkOrderPayment() {
            var vD = $("#dialogConfirmOrderInfo");
            vD.children(".panel-body").empty();
            vD.children(".panel-body").append("<img id='imgWaitForPaymentProviders' src='/img/WaitCover.gif'/>");
            var vID = $("#dialogInvoiceInfo");
            vID.children(".panel-body").empty();
            vID.children(".panel-body").append("<img id='imgWaitForPaymentProviders' src='/img/WaitCover.gif'/>");
            var vParams = {
                checkOrderPayment: true
            };
            api.post("/api/Order", vParams, JApp.processResponce);
    }
       
    unlockBookmark(id) {
            $("#dialogOrderPaid").remove();
            $("#dialogOrder").append("<img id='imgWaitForPaymentProviders' src='/img/WaitCover.gif'/>");
            var vParams = { unlockBookmark: id };
            api.post("/api/Order", vParams, JApp.processResponce);
    }
        
    confirmCatchBookmark(id) {
            var vParams = { bookmarkCatched: id };
            api.post("/api/Order", vParams, JApp.processResponce);
    }
        
    cancelCurrentOrder() {
            var vParams = { cancelOrder: true };
            api.post("/api/Order", vParams, JApp.processResponce);
    }
        
    confirmOrder() {
            var vD = $("#dialogConfirmOrderInfo");
            vD.children(".panel-body").empty();
            vD.children(".panel-body").append("<img id='imgWaitForPaymentProviders' src='/img/WaitCover.gif'/>");
            var vParams = {
                confirmOrder: true
            };
            api.post("/api/Order", vParams, JApp.processResponce);
    }
        
    processResponce(data) {
            var vResponce = JSON.parse(data.responseText);
            if (vResponce.OrderResult !== undefined) {
                currentUser.hasActiveOrder = vResponce.OrderResult;
                if (vResponce.OrderResult) {
                    if (vResponce.OrderInfo !== undefined) {
                        if ((vResponce.OrderInfo.length === 0) || (vResponce.OrderInfo.OrderState === 'Canceled')) {
                            currentUser.hasActiveOrder = false;
                            currentOrder = null;
                            var vMsg = "";
                            sessionStorage.removeItem("currentOrderInfo");
                            if (JApp.isOrderFinished) {
                                vMsg = "Заказ, успешно завершён!";
                                JApp.isOrderFinished = false;
                            } else {
                                vMsg = "Заказ, успешно отменён!";
                            };
                            dhtmlx.message({
                                text: vMsg,
                                expire: 5000
                            });
                            api.get("/api/getSessionState", null, JApp.processResponce);
                            JApp.refreshPage();
                        } else {
                            if (currentOrder === null) {
                                currentOrder = new BitGanjOrder();
                            };
                            currentOrder.updateOrder(vResponce.OrderInfo);
                        }
                    } else {
                        JApp.showErrorWindow("Critical error Order result true, but no info!Ask to god Jah about that!", true, true);
                    }
                } else {
                    JApp.showErrorWindow(vResponce.Error, false, false);
                };
            }
            if (vResponce.UserInfo !== undefined) {
                if (currentUser === null) {
                    currentUser = new BitGanjUser(vResponce.UserInfo);
                } else {
                    currentUser.update(vResponce.UserInfo);
                };
                if (currentUser.hasActiveOrder) {
                    if (pageName === 'frontshop') {
                        var orderInfo = sessionStorage.getItem("currentOrderInfo");
                        if (orderInfo !== null) {
                            currentOrder = new BitGanjOrder();
                            currentOrder.updateOrder(JSON.parse(orderInfo));
                        } else {
                            api.get("/api/getActiveOrder", null, JApp.processResponce);
                            return;
                        }
                    } else {
                        currentUser.notifyAboutOrder();
                    }
                }
            }
            if (vResponce.checkMailCodeResponce !== undefined) {
                if (vResponce.checkMailCodeResponce) {
                    dhtmlx.message({
                        text: "Код принят!",
                        expire: 5000
                    });
                    BitGanj.hide($("#loginDialog"));
                    $("#frmLoginMail").submit();
                } else {
                    JApp.showErrorWindow(vResponce.Error, false, false);
                }
            }
            if (vResponce.sendMailIdResponce !== undefined) {
                if (vResponce.sendMailIdResponce === true) {
                    var vStartAuthParams = {
                        authType: vAuthenticator.authType,
                        mail: vAuthenticator.mail
                    };
                    JApp.setAuthResponce(vStartAuthParams);
                    dhtmlx.message({
                        text: "Письмо с кодом, успешно отправленно!",
                        expire: 5000
                    });
                    $('#inputEmail').attr("disabled", true);
                    $('#idMailSend').attr("disabled", true);
                    $('#frmLoginMail').submit();
                } else {
                    $('#inputEmail').attr("disabled", false);
                    $('#idMailSend').attr("disabled", false);
                    JApp.showErrorWindow(vResponce.Error, false, false);
                }
            }
            if (vResponce.registerUserResult !== undefined) {
                if (vResponce.registerUserResult !== false) {
                    dhtmlx.message({
                        text: "Вы успешно зарегистрировали акаунт!",
                        expire: 5000
                    });
                    BitGanj.hide($("#dialogRegister"));
                    $("#registerForm").submit();
                } else {
                    JApp.showErrorWindow(vResponce.Error, false, true);
                }
            }
            if (vResponce.checkNonceResult !== undefined) {
                if (vResponce.checkNonceResult !== false) {
                    clearInterval(JApp.checkInterval);
                    switch (vAuthenticator.authType) {
                        case 'BitId':
                            $('#frmLoginBitId').submit();
                            break;
                        case 'TelegramId':
                            $('#frmLoginTelegramId').submit();
                            break;
                        default:
                            break;
                    };
                }
                return;
            }
            if ((vResponce.StartAuthResponce !== undefined) && (vResponce.StartAuthResponce !== false)) {
                if (vAuthenticator === null) {
                    vAuthenticator = new AuthType(vResponce.StartAuthResponce.authType);
                };
                JApp.setAuthResponce(vResponce.StartAuthResponce);
            }
            if (vResponce.SessionState !== undefined) {
                switch (vResponce.SessionState) {
                    case 'GUEST':
                        $('#idMainButton').addClass('logo_auth').fadeIn('5000');
                        $('#copobanId').addClass('guest_reg_frm').slideUp('5000');
                        break;
                    case 'ROOT':
                    case 'USER':
                        if ((vResponce.UserInfo === undefined) && (currentUser === null)) {
                            api.get("/api/getUserInfo", null, JApp.processResponce);
                        }
                        break;
                    case 'AUTH_PROCESS':
                        if (pageName === 'main') {
                            BitGanj.show($('#loginDialog'));
                            if (vAuthenticator instanceof Object) {
                                if ((vAuthenticator.authType === 'BitId') || (vAuthenticator.authType === 'TelegramId')) {
                                    if (JApp.checkInterval === null) {
                                        checkNonceURL = vAuthenticator.checkNonceURL;
                                        checkRefreshTimer = vAuthenticator.refreshInterval;
                                        JApp.checkInterval = setInterval(function () {
                                            JApp.checkNonce();
                                        }, checkRefreshTimer);
                                    }
                                };
                            } else {
                                if (JApp.checkInterval !== null) {
                                    clearInterval(JApp.checkInterval);
                                }
                            }
                        }
                        break;
                    case 'BANNED':
                        $('#idMainButton').addClass('logo_auth').fadeIn('5000');
                        break;
                    case 'UNAUTHENTICATED':
                        sessionStorage.clear();
                        BitGanj.show($('#loginDialog'));
                        break;
                    default:
                        break;
                };
                sessionStorage.setItem("lastState", vResponce.SessionState);
            };
            sessionStorage.setItem("lastResponce", JSON.stringify(vResponce));
        };
        
    refreshPage() { BitGanj.activatePage(this.pageName); }
        
    static activatePage(vPage) { document.location.href = location.protocol + '//' + location.host + '/p/' + vPage; }
        
    checkNonce() { if (checkNonceURL !== undefined) {
                api.get(checkNonceURL, null, this.processResponce);
                    } else {
                JApp.activatePage('kill'); };
        }
                
    auth(event, vAuthType) {
            BitGanj.clickSound();
            if (event.type === 'show') {
                let vAuthenticator = new AuthType(vAuthType);
                api.get("/api/startAuth", vAuthenticator, this.processResponce);
            } else {
                if ($("#accordion").children().length === 1) { event.preventDefault(); }
            }
        }
        
    onLoad() {
            this.pageName = $('article').attr('id');
            let skin = "dhx_skyblue";
            this.dhxWins = new dhtmlXWindows({
                image_path: "../../codebase/img/",skin: skin
            });
            api.get("/api/getSessionState", null, this.processResponce);
        }
        
    onUnload() {
            if (this.dhxWins !== null && this.dhxWins.unload !== null) {
                this.dhxWins.unload();
                this.dhxWins = null;
            }
        }
        
    openNav() {
            if ($("#myNav").length) {
                var currentHeight = document.getElementById("myNav").style.height;
                if (currentHeight === "0%") {
                    document.getElementById("myNav").style.height = "100%";
                } else {
                    document.getElementById("myNav").style.height = "0%";
                };
            };
        }
        
    getBookmark(idBookmark) {
            $(".bookmark").each(function () {
                this.remove();
            });
            var vParams = {
                idBookmark: idBookmark
            };
            api.post("/api/Order", vParams, JApp.processResponce);
        }
        
    finishOrder() {
        if (currentOrder !== null) {
            JApp.isOrderFinished = true;
            let vParams = { finishOrder: true };
                api.post("/api/Order", vParams, JApp.processResponce);
        };
    }

    static getEffect() {
        let vEffectTypes = ["blind", "bounce", "clip", "drop", "explode", "fade", "fold", "highlight", "puff", "shake", "slide"]; 
        return vEffectTypes[Math.floor(Math.random() * Math.floor(vEffectTypes.length))];
    }

    static hide(vWin) { vWin.hide(BitGanj.getEffect()); }

    static show(vWin) { vWin.show(BitGanj.getEffect()); }

    static clickSound() {
        const soundFile = '/js/app/sound_in.wav';
        var sndElement = document.createElement('audio');
        sndElement.innerHTML = '<source src="' + soundFile + '" type="audio/mpeg" />';
        sndElement.play();
    }
}

var JApp = new BitGanj();
