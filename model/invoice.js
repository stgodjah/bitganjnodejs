"use strict";
class BitGanjInvoice {
    constructor(data) {
        this.isInitialized = false;
        this.created = data.created;
        this.logo = data.logo;
        this.currencyTitle = data.currencyTitle;
        this.price = data.price;
        this.priceDate = data.priceDate;
        this.address = data.address;
        this.balance = data.balance;
        this.balanceDate = data.balanceDate;
        this.state = data.state;
        this.idInvoice = data.idInvoice === undefined ? null : data.idInvoice;
        this.getForm = function () {
            var vFormContext = "<form id=\"frmWaitForPayment\" method=\"POST\" action=\"#\" ><p>В системе:" + this.currencyTitle + "</p>";
            vFormContext += "<p class=\"lead text-info\" >Ожидается сумма: " + this.price + "<img class=\"pp-logo\" src='" + this.logo + "'/></p>";
            vFormContext += "<p class=\"lead text-info\" >На адресс:</p>";
            vFormContext += "<p class=\"lead text-info\" >" + this.address + "</p>";
            vFormContext += "<p class=\"lead text-danger\" >Внесенно: " + this.balance + "</p>";
            vFormContext += "<button type=\"button\" name=\"checkOrderPayment\" value=\"true\"  onclick=\"JApp.checkOrderPayment();\" class=\"btn btn-success\" >Проверить оплату</button></form>";
            return vFormContext;
        };
        this.checkForm = function () {
            if ($('#dialogInvoiceInfo').length) {
                if (!$('#frmWaitForPayment').length) {
                    $('#dialogInvoiceInfo').children('.panel-body').append(this.getForm());
                }
            }
        };
        this.getHTML = function () {
            var vResult = "";
            if (this.idInvoice === null) {
                if (!$('#dialogConfirmOrderInfo').length) {
                    var vInvoicePreview = "<center><div id=\"dialogConfirmOrderInfo\" class=\"panel panel-success\"><div class=\"panel-heading\">Подтверждение заказа</div><div class=\"panel-body\">";
                    vInvoicePreview += "<form id=\"confirmOrder\" method=\"POST\" action=\"#\" ><p>Cумма которую надо будет внести за заказ </p>";
                    vInvoicePreview += "<p class=\"lead text-info\" >в системе " + this.currencyTitle + "</p>";
                    vInvoicePreview += "<p class=\"lead text-danger\" >" + this.price + "<img class=\"pp-logo\" src='" + this.logo + "'/></p>";
                    vInvoicePreview += "<button type=\"button\" name=\"confirmOrder\" value=\"true\"  onclick=\"JApp.confirmOrder();\" class=\"btn btn-success\" >Подтверждаю !</button>";
                    vInvoicePreview += "</form></div></div></center>";
                    vResult = vInvoicePreview;
                }
                ;
            }
            else {
                if (!$('#dialogInvoiceInfo').length) {
                    var vInvoiceContext = "<center><div id=\"dialogInvoiceInfo\" class=\"panel panel-success\"><div class=\"panel-heading\">Ожидается оплата!</div><div class=\"panel-body\">";
                    vInvoiceContext += this.getForm();
                    vInvoiceContext += "</div></div></center>";
                    vResult = vInvoiceContext;
                }
                ;
            }
            ;
            return vResult;
        };
    }
}
;
