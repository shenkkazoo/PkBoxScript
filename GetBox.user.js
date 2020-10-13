// ==UserScript==
// @name         GetBox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate flavortables for the pokemon in a field. Wait this doesn't f
// @author       You
// @match        https://pokefarm.com/fields
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

//When the page loads, run render
$(document).ready(function() {
   render();
});

//links up button functionality
$(document).on('click', '#boxButton', function (clickEvent) {
    Display();
});

//sets up the extra css/html
function render() {
    $("<div id=\"outputBox\"><textarea id=\"textBoxOut\" rows=\"1\"></textarea><button id=\"boxButton\">Get Box</button>").insertAfter("#field_field");

    $('#outputBox').css({
        "margin":"auto",
        "width":"600px",
        "display":"flex"
    });
    $('#textBoxOut').css({
        "resize":"none",
        "height":"21px",
    });
}

//makes the list of pokemon
function Display(){
    document.getElementById("textBoxOut").value = "";
    var field = $(".field .fieldmontip"); //every pokemon in the field

    //Go through every pokemon and print out their attributes into the textbox
    for (var i = 0; i < field.length; i++) {
        var species = field.eq(i).children().eq(3).text().split("Species:  ")[1].slice(0,-1);
        var code = field.eq(i).children().eq(1).html().split("summary/")[1].split("\">")[0];

        var test = "";
        var color = "";

        //if casing for normal and deltas.
        if (field.eq(i).children().eq(3).children().children().length == 1) {
            //normal pokemon
            color = "normal";
        }
        else if (field.eq(i).children().eq(3).children().children().length == 2) {
            //normal delta or shiny
            if(field.eq(i).children().eq(3).children().eq(2).html().split("><")[1].split("pkmn/")[1].split(".png")[0] == "shiny" ||
               field.eq(i).children().eq(3).children().eq(2).html().split("><")[1].split("pkmn/")[1].split(".png")[0] == "albino") {
                color = field.eq(i).children().eq(3).children().eq(2).html().split("><")[1].split("pkmn/")[1].split(".png")[0];
            }
            else {
                color = "delta " + field.eq(i).children().eq(3).children().eq(2).html().split("><")[1].split("delta/")[1].split(".png")[0];
            }
        }
        else {
            //delta s/a
            var delta = "delta " + field.eq(i).children().eq(3).children().eq(2).html().split("><")[2].split("delta/")[1].split(".png")[0];
            color = delta + "+" + field.eq(i).children().eq(3).children().eq(2).html().split("><")[1].split("pkmn/")[1].split(".png")[0];

        }

        var gender = field.eq(i).children().eq(3).children().eq(2).html().split("><")[0].split("gender_")[1].split(".png")[0];

        field.eq(i).children().eq(8).children().eq(1).remove(); //it HATES these nodes specifically
        field.eq(i).children().eq(8).children().eq(0).remove();
        var nature = field.eq(i).children().eq(8).text().trim();

        //Some pokemon have the nature node higher up in the heirarchy.. I Don't Know Why.
        if (nature.length == 0) {
            field.eq(i).children().eq(7).children().eq(1).remove();
            field.eq(i).children().eq(7).children().eq(0).remove();
            nature = field.eq(i).children().eq(7).text().trim();
        }

        document.getElementById("textBoxOut").value += `${species},${code},${color},${gender},${nature}\n`;
        //document.getElementById("textBoxOut").value += "hi";
    }

}
