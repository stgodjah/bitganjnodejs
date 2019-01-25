"use strict";
class BitGanjPoint {
    constructor(data) {
        this.isInitialized = false;
        this.id = data.id;
        this.Title = data.Title;
        this.RegionTitle = data.RegionTitle;
        this.Latitude = data.Latitude;
        this.Longitude = data.Longitude;
        this.LocationLink = data.LocationLink;
        this.Link = data.Link;
        this.Description = data.Description;
        this.Unlocked = data.Unlocked;
        this.getHTML = function () {
            var vBookmarkContext = "";
            if (!$('#dialogPointInfo').length) {
                vBookmarkContext = "<center><div id=\"dialogPointInfo\" class=\"panel panel-info\"><div class=\"panel-heading\">Содержимое закладки</div><div class=\"panel-body\">";
                vBookmarkContext += "<form  id=\"frmPoint" + this.id + "\" action=\"#\"  method=\"post\">";
                vBookmarkContext += "<table><tbody><tr><td colspan=\"2\"><center>" + this.Title + "</center></td></tr>";
                if (this.RegionTitle !== null) {
                    vBookmarkContext += "<tr><td colspan=\"2\"><center><span class=\"badge\">" + this.RegionTitle + "</span></center></td></tr>";
                }
                ;
                if (this.Unlocked === true) {
                    vBookmarkContext += "<tr><td><center><a  target=\"_blank\" class=\"pointLocation\" href=\"" + this.LocationLink + "\">";
                    vBookmarkContext += "<img src=\"img/Google_Maps_Icon.png\" border=\"0\" width=\"64\" height=\"64\" alt=\"Look map\" align=\"center\">";
                    vBookmarkContext += "<p>Карта</p></a></center></td>";
                    vBookmarkContext += "<td><center><a target=\"_blank\" href=\"" + this.Link + "\">";
                    vBookmarkContext += "<img src=\"img/photos.png\" border=\"0\" width=\"64\" height=\"64\" alt=\"Look map\" align=\"center\">";
                    vBookmarkContext += "<p>Фото</p></a></center></td></tr>";
                    vBookmarkContext += "<tr><td colspan=\"2\"><center><div class=\"panel panel-body\">" + this.Description + "</div></center></td></tr>";
                    vBookmarkContext += "<tr><td colspan=\"2\"><center><button type=\"button\" name=\"confirmCatchBookmark\" value=\"true\"  onclick=\"JApp.confirmCatchBookmark(" + this.id + ");\" class=\"btn btn-success\" >Забрал закладку!</button></center></td></tr>";
                }
                ;
                vBookmarkContext += "</tbody></table></form></div></div><center>";
            }
            ;
            return vBookmarkContext;
        };
    }
}
;
