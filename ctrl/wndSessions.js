/* global dhxWims */
'use strict';
function wndSessions(dhxWins)
{
    var dhxWins = dhxWins;
    var win = null;
    var sessionsGrid,sessionsLayout,sessionsToolbar  = null;
    var skin = "dhx_skyblue";
    var iconsPath = {
			dhx_skyblue: "imgs",
			dhx_web: "icons_web",
			dhx_terrace: "icons_terrace",
			material: "icons_material"
                    };
    var vStatusText = "";
    this.id = "sessionsWnd";
    this.savePosition = function()
    {
        if (dhxWins !== null)
        {
            if (dhxWins.isWindow(this.id))
            {
                win = dhxWins.window(this.id); 
                var dim = win.getDimension();
                var pos = win.getPosition();
                var vParams = {left:pos[0],top:pos[1],width:dim[0],height:dim[1]};
                localStorage.setItem("sessionWndParams",JSON.stringify(vParams));
                return true;
            } else { return false; };
        };
    };
    this.init = function(serverInfo)
    {  
        var vServerTime = serverInfo.serverDateTime === serverInfo.dbTime ? serverInfo.serverDateTime: 'Not syncronized!' ;
        vStatusText = "Core: " + serverInfo.serverVersion + " Server time: " + vServerTime ;
        if (dhxWins.isWindow(this.id)) { win = dhxWins.window(this.id); win.show();} 
        else {
            var v_left = 20;
            var v_top = 30;
            var v_width = 320;
            var v_height = 200;
            var v_is_stick = sessionStorage.getItem("isSessionsWindow");
            if (localStorage.getItem("sessionWndParams"))
            {
                var vSavedPos = JSON.parse(localStorage.getItem("sessionWndParams"));
                v_left = vSavedPos.left;
                v_top = vSavedPos.top;
                v_width = vSavedPos.width;
                v_height = vSavedPos.height;
            }
            dhxWins.setSkin(skin);
            win = dhxWins.createWindow( { id: this.id, left: v_left, top: v_top, width: v_width, height: v_height, 
                text: "Сессии", keep_in_viewport: true, resize: true});
            win.button("stick").show();
            win.attachEvent("onStick", function(win){
			sessionStorage.setItem("isSessionsWindow", true);	
			});
            win.attachEvent("onUnStick", function(win){
			sessionStorage.removeItem("isSessionsWindow");	
			});
            sessionsToolbar = win.attachToolbar({
				icons_path: "/img/icons/",
				xml: "js/ctrl/toolbar_sessions.xml"
			});
            sessionsToolbar.attachEvent('onClick', function(id){
		switch (id) {
                    case 'refresh':
                        sessionsGrid.clearAll(); 
                        sessionsGrid.load("/api/GetSessions","json");
                        break;
                    default:
                        
                        break;
                }
            });
            sessionsGrid = win.attachGrid();
            sessionsGrid.setImagePath("/codebase/imgs/");
            sessionsGrid.setSkin(skin);
            sessionsGrid.setHeader("sId,Browser,Netinfo,Signed,Minutes");
            sessionsGrid.setColAlign("center,center,center,center,center");
            sessionsGrid.setColTypes("ro,ro,ro,ch,ro")
            sessionsGrid.setInitWidths("70,*,100,50,50");
            sessionsGrid.init();
            sessionsGrid.load("/api/GetSessions","json");
            win.attachStatusBar({text: vStatusText });
            win.attachEvent("onClose", function(win) {
				var dim = win.getDimension();
				var pos = win.getPosition();
				var vParams = {left:pos[0],top:pos[1],width:dim[0],height:dim[1]};
				localStorage.setItem("sessionWndParams",JSON.stringify(vParams));
				return true;
            });
            if (v_is_stick) { win.stick(); };
            
        };
    };
};


