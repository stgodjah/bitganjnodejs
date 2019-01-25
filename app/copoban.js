/* global App */

function doOnLoad()
{
    App.init();
}

function doOnUnload()
{
    App.finalize();
}

function updateSessionState(newstate)
{
   var sess_id = 0;
   App.set_state(newstate, sess_id); 
}

function btnPush()
{
    if (!App.vAuthBusy)
    {
        App.playClick();
        App.logoBtnClick();   
    }
}

function ShowLoginWindow()
{
    $(document.getElementById('copobanId')).show('slow');
    localStorage.setItem('isLoginWindowVisible', true);
}

function HideLoginWindow()
{
    $(document.getElementById('copobanId')).hide("slow");
    localStorage.setItem('isLoginWindowVisible', false);
}


function confirmOrder(isConfirmed)
{
    $(document.getElementById('dialog')).parent().hide("slow");
    $(document.getElementById('orderConfirmator')).val(isConfirmed);
    $("#frmConfirmOrder").submit(); 
}

function createNewUser()
{
    $(document.getElementById('dialog')).parent().hide("slow");
    App.createUsr();
}

function userCreateResult(res)
{
    if (res == true)
    {
        App.showRegisterOk();
    }
    else
    {
        App.showRegisterFail();
    }
}

function saveWinPos(win)
{
    localStorage.setItem('wLeft', win.left);
    localStorage.setItem('wTop', win.top);
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
    }
    return null;
}
