"use strict";
/* global JApp */
class BitGanjOrder {
    constructor() {
        var api = new XHR();
        var vOrderId = null;
        var vOrderState = null;
        var vPoints = [];
        var vInvoices = [];
        var vProviders = [];
        var vActualPointIndex = 0;
        var vActualInvoiceIndex = 0;
        this.feedbackFormUrl = "//help.bitganj.website/index.php/questionary/embed/(theme)/2";
        this.isInitialized = false;
        this.orderDialog = $("#dialogOrder");
        this.getHeader = function () {
            var vResult = '<div id="dialogOrder" title="Заказ ';
            if (vOrderId !== null) {
                vResult += " №" + vOrderId;
            }
            ;
            return vResult + '"><form id="frmProcessOrder" method="POST" action="#"></div>';
        };
        this.updateOrder = function (data) {
            vOrderState = data.OrderState;
            if (data.OrderId !== undefined) {
                vOrderId = data.OrderId;
            }
            ;
            if (this.isInitialized === false) {
                this.initDialiog();
            }
            ;
            if (data.CurrentBookmarks.length > 0) {
                $.each(data.CurrentBookmarks, function (key, value) {
                    vActualPointIndex = key;
                    vPoints[key] = new BitGanjPoint(value);
                });
            }
            if (data.CurrentInvoices !== undefined && data.CurrentInvoices.length > 0) {
                $.each(data.CurrentInvoices, function (key, value) {
                    vActualInvoiceIndex = key;
                    vInvoices[key] = new BitGanjInvoice(value);
                });
            }
            var vResultContext = "";
            switch (vOrderState) {
                case 'Created':
                    vProviders = data.CurrentPaymentProviders;
                    var vProvidersContext = "<center><div id=\"dialogSelectpaymentProvider\" title=\"Метод оплаты!\" class=\"panel panel-warning\"><div class=\"panel-heading\">Укажите метод оплаты</div><div id=\"dialogSPBody\" class=\"panel-body\"><form id=\"chosePaymentProvider\" method=\"POST\" action=\"#\" >";
                    $.each(vProviders, function (key, value) {
                        var vDisableAttr = value.inited !== true ? "disabled='disabled' data-toggle=\"tooltip\" title=\"" + value.error_message + "\"" : " ";
                        vProvidersContext += "<button type=\"button\" name=\"getPRovider\" value=\"" + key + "\"  onclick=\"JApp.selectPayProvider('" + key + "');\"\n\
                                  class=\"btn pp-button\" " + vDisableAttr + " ><img class=\"pp-logo\" src='" + value.logo + "'/>" + value.title + "</button></br>";
                    });
                    vProvidersContext += "</form></div></div></center>";
                    vResultContext = vPoints[vActualPointIndex].getHTML();
                    vResultContext += vProvidersContext;
                    break;
                case 'Preparig':
                    var vDialogSelectProvider = $("#dialogSelectpaymentProvider");
                    vDialogSelectProvider.remove();
                    vResultContext = vPoints[vActualPointIndex].getHTML();
                    vResultContext += vInvoices[vActualInvoiceIndex].getHTML();
                    break;
                case 'Confirmed':
                    var vDialogSelectProvider = $("#dialogConfirmOrderInfo");
                    vDialogSelectProvider.remove();
                    vResultContext = vPoints[vActualPointIndex].getHTML();
                    vResultContext += vInvoices[vActualInvoiceIndex].getHTML();
                    break;
                case 'Paid':
                    if ($('#dialogInvoiceInfo').length) {
                        $('#dialogInvoiceInfo').remove();
                    }
                    ;
                    var vLockedPoints = data.LockedPoints;
                    var vUnLockedPoints = data.UnLockedPoints;
                    if (vUnLockedPoints !== undefined && !isNaN(vUnLockedPoints.id)) {
                        $('#dialogPointInfo').remove();
                    }
                    ;
                    vResultContext = vPoints[vActualPointIndex].getHTML();
                    if (vLockedPoints !== undefined && !isNaN(vLockedPoints.id)) {
                        vResultContext += "<center><div id=\"dialogOrderPaid\" title=\"Заказ оплачен!\" class=\"panel panel-success\"><div class=\"panel-heading\">Приём заказа</div><div id=\"dialogSPBody\" class=\"panel-body\"><form id=\"getBookmarks\" method=\"POST\" action=\"#\" >";
                        vResultContext += "<center><button type=\"button\" name=\"unlockBookmark\" value=\"true\"  onclick=\"JApp.unlockBookmark(" + vLockedPoints.id + ");\" class=\"btn btn-success\" >Открыть закладку!</button></center>";
                        vResultContext += "</form></div></div></center>";
                    }
                    else {
                        $('#dialogOrderPaid').remove();
                    }
                    ;
                    break;
                case 'WaitForPayment':
                    vResultContext = vPoints[vActualPointIndex].getHTML();
                    vResultContext += vInvoices[vActualInvoiceIndex].getHTML();
                    vInvoices[vActualInvoiceIndex].checkForm();
                    break;
                case 'Canceled':
                    break;
                case 'Finished':
                    this.orderDialog.children().empty();
                    vResultContext += "<div id=\"lhc_questionary_embed_container\" ></div>\n" +
                        "<script type=\"text/javascript\">(function() { var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;" +
                        "po.src = '" + this.feedbackFormUrl + "';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);})();</script>";
                    vResultContext += "<center><button type=\"button\" name=\"finishOrder\" value=\"true\"  onclick=\"JApp.finishOrder();\" class=\"btn btn-success\" >Завершить заказ</button></center>";
                    break;
                default:
                    break;
            }
            ;
            sessionStorage.setItem("currentOrderInfo", JSON.stringify(data));
            $("#imgWaitForPaymentProviders").remove();
            if (Number.isInteger(vOrderId)) {
                $("#ui-id-1").text("Заказ №" + vOrderId);
            }
            ;
            this.orderDialog.children().append(vResultContext);
            this.orderDialog.dialog("open");
        };
        this.initDialiog = function () {
            if (document.getElementById('dialogOrder') instanceof Object !== true) {
                $("#frontshop").append(this.getHeader());
            }
            ;
            this.orderDialog = $("#dialogOrder");
            this.orderDialog.children().empty();
            this.orderDialog.children().append("<img id='imgWaitForPaymentProviders' src='/img/WaitCover.gif'/>");
            this.orderDialog.dialog({
            autoOpen: false,
                modal: true,
                draggable: true,
                resizable: false,
                fluid: true,
                width: "auto",
                beforeClose: function (event, ui) {
                    JApp.cancelCurrentOrder();
                    event.preventDefault();
                },
                show: {
                    effect: JApp.getEffect(),
                    duration: 2500
                },
                position: { my: "center", at: "center", of: window }
            });
            this.isInitialized = true;
        };
        //    this.showDialog = function()
        //    {
        //        this.orderDialog.dialog({autoOpen: false,
        //            modal: true,
        //            draggable: true,
        //            resizable: false,
        //            fluid: true,
        //            width: "auto",
        //            beforeClose: function(event, ui) {
        //                    JApp.cancelCurrentOrder();
        //                    event.preventDefault();
        //            },
        //            show: {
        //                effect: JApp.getEffect(),
        //                duration: 2500
        //            },
        //            position: { my: "center", at: "center", of: window }
        //        });
        //    };
        this.finishOrder = function () {
            if (vOrderState === 'Finished') {
                sessionStorage.removeItem("currentOrderInfo");
                $("#dialogOrder").remove();
                JApp.refreshPage();
                return true;
            }
            ;
            return false;
        };
        this.restoreDialog = function () {
            var orderInfo = sessionStorage.getItem("currentOrderInfo");
            if (orderInfo !== null) {
                this.updateOrder(JSON.parse(orderInfo));
            }
        };
    }
}
;
