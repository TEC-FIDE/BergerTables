/*
Copyright 2024, Otto Milvang
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ÔÇ£SoftwareÔÇØ), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Created on Mon Nov  7 18:38:23 2017
@author: Otto Milvang, sjakk@milvang.no
*/


var langlabels = {};
var names = new Array();
var perm = new Array();
var keyslabel = null;
var languages = null;


function asyncGetJson(file) {
	var res;
	console.log(file);
	$.ajaxSetup({
    async: false
  });
  $.when($.getJSON(file, function () {
  }, function () {
  })).done(function(data) {
    res = data;
  });
  return res;
}



var labels = {
	 "font": "OpenSans",
	 "input-tournament": "My tournament",
   "input-startno" : "Start no:",
   "input-name" : "Name:",
   "input-round" : "Round:",
   "input-points" : "Points",
   "input-tiebreak": "Tie break",
   "input-place": "Place",
   "input-descr": "Start no. {players} plays with black in round 1",
   "input-reversed" : "The order of the last two rounds of the first cycle is reversed"
};

$(document).ready(function() {
  var innerplayers = '';
  var innerlabel = '';
  keyslabel = Object.keys(labels);
  var pno; 
  var langoptions = "";
  languages = asyncGetJson("languages.json");
    for (let i = 0; i< languages.length; i++) {
    	langlabels[languages[i]] = asyncGetJson( "languages/lang-" + languages[i] + ".json");
    	langoptions = langoptions + "<option value='" + languages[i] + "'>" + langlabels[languages[i]]['language'] + "</option>";
    }
  console.log(langlabels);
  $('#language').html(langoptions);
  setlanguage(languages[0]);
  console.log(labels);

  var fontoptions = "";
  let fd = new jsPDF();
  fonts = Object.keys(fd.getFontList());
  fonts.push('OpenSans');
  fonts.push('Merriweather');
  console.log(fonts);
  fd = null;
  for (let i = 0; i< fonts.length; i++) {
  	if (fonts[i][0] !== fonts[i][0].toLowerCase()) {
        let selected = (fonts[i] == labels['font']) ? " SELECTED" : "";
    	  fontoptions = fontoptions + "<option value='" + fonts[i] + "'" + selected + ">" + fonts[i] + "</option>";
      }
    }
  $('#font').html(fontoptions);

  
  
  document.title = labels['title'];
  
  for (pno =1; pno <= 50; pno++) {
	  perm[pno] = pno;
      innerplayers = innerplayers + 
        "<div id='div-" + pno + "' style='display:" + (pno <= 12 ? "block" : "none") + "'>" +
        "<div style='width: 20pt; text-align: right; float: left;'>" +pno + ": </div>" +
        "<div style='float: clear;'></div> <input type='text' size=30' id='name-" + pno +"' value=''></div>" + 
        "</div>" + "\n";  
  }
  $('#playerlist').html(innerplayers);
  
  
  loadAndResize();
  bergerupdate();
  $("input").change(function() {
    bergerupdate();
  });
  $("#language").change(function() {
  	console.log($("#language option:selected").val());
  	setlanguage($("#language option:selected").val());
  	loadAndResize();
  	bergerupdate();
  });
  $("#font").change(function() {
  	console.log($("#font option:selected").val());
  	labels['font'] = $("#font option:selected").val();
  	loadAndResize();
  	bergerupdate();
  });
});
$("#double").change(function() {
  //bergerupdate();
  let double = $('#double').prop("checked");
  if (double) $('#swapid').show(); 
  else $('#swapid').hide(); 
  
});
$("#btn-save").click(function() {
  bergerupdate().save('berger.pdf');
});
$("#btn-print").click(function() {
	let d = bergerupdate();
	d.autoPrint();
	window.open(d.output('bloburl'), '_blank');
	
});

function makerandom(players, rand)
{
  var pno;
  for (pno =1; pno <= 50; pno++) perm[pno] = pno;
  if (!rand) return;
  for (pno = players; pno > 1; pno--) {
    var rand = Math.floor(Math.random() * pno) + 1; 
    var temp = perm[pno];
    perm[pno] = perm[rand];
    perm[rand] = temp;	
  }
}

function setlanguage(language)
{
	console.log (language);
  var keyslabel = Object.keys(langlabels[language]);
  console.log(keyslabel);
  for (let i=0; i< keyslabel.length ;i++) {
  	let key = keyslabel[i];
  	labels[key] = langlabels[language][key];
  }
  for (let i=0; i< keyslabel.length ;i++) {
  	let key = keyslabel[i];
  //	$('#labellist').html("");
  	if (key.substr(0,6) == "input-") {
  		console.log($('#' + key).val());
  		if ($('#' + key).val() == undefined) {
  	    innerlabel = "<div><input type='text' size='40' id='" + key + "' value='"+ labels[key] +"'></div>";
        $('#labellist').html($('#labellist').html() + innerlabel);
      } else {
      	$('#' + key).val(labels[key]);
      }
    }
  	if (key.substr(0,4) == "txt-" || key.substr(0,4) == "btn-") {
  	  $('#' + key ).html(labels[key]);
  	}
  };
	
}


function loadAndResize()
{
  var pt20 = $('#players').height();
  var documentWidth = $(document).width();
  var leftpanWidth = $('#input-tournament').offset().left + $('#input-tournament').width();
  if (leftpanWidth + 550 * pt20/20 < documentWidth) {
    var newWidth =	parseInt(0.9 *(documentWidth - leftpanWidth));
    var newHeight =	parseInt(newWidth/1.414 + 60);
    $('#pdf').width(newWidth);
    $('#pdf').height(newHeight);
  }
  let double = $('#double').prop("checked");
  if (double) $('#swapid').show(); 
  else $('#swapid').hide(); 
}


$(window).resize(loadAndResize);

function bergerupdate()
{
  var players = parseInt($('#players').val());
  var oldplayers = parseInt($('#oldplayers').val());
  var random = $('#random').prop("checked");
  var oldrandom = $('#oldrandom').val();
  if ('' + random != oldrandom || players != oldplayers) {
     $('#oldplayers').val(players);
 	  $('#oldrandom').val('' + random);
	  makerandom(players, random);
  }  
  
  var dr = $('#double').prop("checked");
  var swap = $('#swap').prop("checked");
  if (isNaN(players)) return(alert(labels['validate-number']));
  if (players<2) return(alert(labels['validate-low']));
  if (players>50 && !dr) return(alert(labels['validate-high1']));
  if (players>24 && dr) return(alert(labels['validate-high2']));
  for (pno =1; pno <= 50; pno++) {
	  names[pno] = $('#name-' + perm[pno]).val();
	  $('#div-' + pno).css("display", (pno <= players ? "block" : "none"));
  }
  for (let i=0; i< keyslabel.length ;i++) {
  	let key = keyslabel[i];
  	if (key.substr(0,6) == "input-") {
  	  labels[key] = $('#' + key).val();
  	}
  }
  
  doc = BergerPDF(labels, names, players, dr , swap);
  var string = doc.output('bloburi');
  $('.preview-pane').attr('src', string);
  return(doc);
}

