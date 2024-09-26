/*
Copyright 2024, Otto Milvang
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ÔÇ£SoftwareÔÇØ), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Created on Mon Nov  7 18:38:23 2017
@author: Otto Milvang, sjakk@milvang.no
*/


// 
// roundrobinpairing is the core of the program, 
// n is he number of players, odd nubers are lifted to the first even number
// returns a 3-dimentional zero-based array
//   1-dim - 0 .. n-2 is [round_number - 1]
//   2-dim - 0 .. n/2 is [pair_number - 1]
//   3-dim - 0 .. 1 is [white, black] - players numbered 1 .. n 
//


function roundrobinpairing(n)
{
    if ((n % 2) ==1 ) n++;
    var bergertab = new Array();
    
    var pairing = new Array();
    var pair;
    for (pair = 0; pair<n/2; pair++) {
       pairing[pair] = new Array(pair+1, n-pair);
    }
    bergertab[0] = pairing;
    var round;
    for (round=1; round < n-1; round++) {
      var newpairing = new Array();
      if ((round%2) == 1) {
        newpairing[0] = new Array( pairing[0][1],pairing[n/2-1][1])
        newpairing[n/2-1] = new Array(pairing[0][0], pairing[1][0]) 
      } else {
        newpairing[0] = new Array(pairing[n/2-1][1], pairing[0][0])
        newpairing[n/2-1] = new Array(pairing[0][1], pairing[1][0]) 
      } 
      for (pair = 1; pair<n/2-1; pair++) {
        newpairing[pair] = new Array(pairing[n/2-pair-1][1], pairing[n/2-pair][0]) 
      }
      bergertab[round] = newpairing;
      pairing = newpairing;
    }
    return bergertab;
}



function BergerPDF(labels, names, players, double, swap) {
	  console.log(labels);
  
    doc = new jsPDF({
      orientation: "landscape",
      unit: "pt"
    });
    doc.addFileToVFS("OpenSans-Regular.ttf", OpenSansRegular);
    doc.addFont('OpenSans-Regular.ttf', 'OpenSans', 'normal');
    doc.addFileToVFS("OpenSans-Bold.ttf", OpenSansBold);
    doc.addFont('OpenSans-Bold.ttf', 'OpenSans', 'bold');
    doc.addFileToVFS("OpenSans-Italic.ttf", OpenSansItalic);
    doc.addFont('OpenSans-Italic.ttf', 'OpenSans', 'italic');

    doc.addFileToVFS("Merriweather-Regular.ttf", MerriweatherRegular);
    doc.addFont('Merriweather-Regular.ttf', 'Merriweather', 'normal');
    doc.addFileToVFS("Merriweather-Bold.ttf", MerriweatherBold);
    doc.addFont('Merriweather-Bold.ttf', 'Merriweather', 'bold');
    doc.addFileToVFS("Merriweather-Italic.ttf", MerriweatherItalic);
    doc.addFont('Merriweather-Italic.ttf', 'MerriweatherSans', 'italic');

    doc.setFont(labels['font']); // set font
    console.log(labels['font']);


  if (players >= names.length) return(doc);
  // n for beregning

  var n = players;
  if ((n % 2) ==1 ) n++;
  var wo = (n == players) ? 0 : n;
  var r = double ? 2 : 1;

  var xlimit = 842 - 60;
  var ylimit = 595 - 60;
  var xoff = 30;
  var yoff = 30;

  var xsize = 30;
  var ysize = 30;
  var head = 50;
  var name = 200;
  var x, y;

  var width = name + xsize * (4 +(n-1)*r);
  var height = head + ysize * (1+players);

  if (width > xlimit) {
    xsize = xsize * xlimit / width;
    name = name * xlimit / width;
    width = name + xsize * (4 +(n-1)*r);
  }

  if (height > ylimit) {
    ysize = ysize * ylimit / height;
    head = head * ylimit / height;
    height = head + ysize * (1+players);
  }

  // Lines

  doc.setLineWidth(1);
  doc.line(xoff, yoff, xoff + width, yoff);
  for (y=0; y<=players+1; y++) {
    doc.setLineWidth(y <= 1 || y == players+1 ? 1 : 0.5);
    doc.line(xoff, yoff + head + y*ysize, xoff + width, yoff + head + y*ysize); 
  }
  doc.setLineWidth(1);
  doc.line(xoff, yoff-0.5, xoff, yoff + height + 0.5);
  doc.line(xoff + width, yoff -0.5, xoff + width, yoff + height + 0.5);
  height = height-head;
  doc.line(xoff+xsize, yoff+head, xoff+xsize, yoff + head + height);
  for (x=0; x<(n-1)*r+4; x++) {
    doc.setLineWidth(x == 0 || x == (n-1)*r ? 1 : 0.5);
    doc.line(xoff+name+(x+1)*xsize, yoff+head, xoff+name+(x+1)*xsize, yoff + head + height);
  }

  // header 

  if (typeof(names) == "object") header = labels['input-tournament'];
  else if (typeof(names) == "string") header = names;
  else header = "";

  doc.setFontType("bold");
  var fontsize = head/2;
  var label;

  while(doc.setFontSize(fontsize).getTextWidth(header) > width - xsize - 10) fontsize--;
  var th = doc.getLineHeight();
  doc.text(xoff + xsize + 2, yoff + head - (head-th)/2, header );

  fontsize = ysize/2;
  doc.setFontSize(fontsize);
  for (x=1; x<=r*n; x++) {
    label = '' + x;
    tw = doc.getTextWidth(label);
    if (x <= players) doc.text(xoff + xsize/2 - tw/2, yoff + head + ysize *(x+1) -4, label); 
    if (x <= (n-1)*r) doc.text(xoff + 3*xsize/2 - tw/2 + name + (x-1) * xsize, yoff + head + ysize -4, label); 
  }  

  if (typeof(names) == "object") {
    var maxwidth = 0;
    for (x=1; x<=players; x++) {
      if (typeof(names[x]) == "string") {
        var w = doc.getTextWidth(names[x]);
        if (w > maxwidth) maxwidth = w;
      }
    }
    if (maxwidth > name - 8) {
        fontsize = fontsize * (name - 8) / maxwidth;
        doc.setFontSize(fontsize);
    }   
    for (x=1; x<=players; x++) {
        if (typeof(names[x]) == "string") 
          doc.text(xoff + xsize + 4, yoff + head + ysize * (x+1) -4, names[x]); 
    }
    
  }

  doc.setFontType("normal");
  fontsize = ysize/2;
  while(Math.max(doc.setFontSize(fontsize).getTextWidth(labels['input-startno']),
                 doc.setFontSize(fontsize).getTextWidth(labels['input-points']),
                 doc.setFontSize(fontsize).getTextWidth(labels['input-tiebreak']),
                 doc.setFontSize(fontsize).getTextWidth(labels['input-place'])) > xsize - 2) fontsize = fontsize - 0.5;

  label = labels['input-startno'];
  tw = doc.getTextWidth(label);
  doc.text(xoff + (xsize-tw)/2, yoff + head +ysize - 4, label);

  label = labels['input-name'];
  tw = doc.getTextWidth(label);
  doc.text(xoff + xsize + 4, yoff + head +ysize - 4, label);

  label = labels['input-round'];
  tw = doc.getTextWidth(label);
  doc.text(xoff + name + xsize-tw - 2, yoff + head +ysize - 4, label);

  label = labels['input-points'];
  tw = doc.getTextWidth(label);
  doc.text(xoff + name + xsize*(n-1)*r + xsize + (xsize-tw)/2, yoff + head +ysize - 4, label);

  label = labels['input-tiebreak'];
  tw = doc.getTextWidth(label);
  doc.text(xoff + name + xsize*(n-1)*r + 2*xsize + (xsize-tw)/2, yoff + head +ysize - 4, label);

  label = labels['input-place'];
  tw = doc.getTextWidth(label);
  doc.text(xoff + name + xsize*(n-1)*r + 3*xsize + (xsize-tw)/2, yoff + head +ysize - 4, label);

  fontsize = 12;
  doc.setFontSize(fontsize);
  label = labels['input-descr'];
  label = label.replace("{#}", "" + players);
  doc.text(xoff , yoff + height + head + doc.getLineHeight() +2, label);
  if (r ==2 && n > 2 && swap) {
    label = labels['input-reversed'];
    doc.text(xoff + width - doc.getTextWidth(label), yoff + height + head + doc.getLineHeight() +2, label);
  }
  // ---
  var berger = roundrobinpairing(n);

  var round;
  var fsize = ysize/3;
  doc.setFontSize(fsize);
  th = doc.getLineHeight();
  for (round=1; round<=(n-1)*r; round++) {
    var pairing;
    if (r == 1 || round < n-2 || !swap && round < n) pairing = berger[round-1];
    else if (n == 2) pairing = berger[0];
    else if (r == 2 && round == n-2) pairing = berger[round];
    else if (r == 2 && round == n-1) pairing = berger[round-2];
    else if (r == 2 && round >= n) pairing = berger[round-n];
    doc.setFontSize(fsize);
    for (pair = 0; pair<n/2; pair++) {
      var white = pairing[pair][(round<n) ? 0 : 1];
      var black = pairing[pair][(round<n) ? 1 : 0];
	    if (white != wo && black != wo) { 
        label = ''+black;
        tw = doc.getTextWidth(label);
        doc.text(xoff + name + xsize*round + (xsize-tw) -2, yoff + head + ysize*white + th, label);
        label = ''+white;
        tw = doc.getTextWidth(label);
        doc.text(xoff + name + xsize*round + 2, yoff + head + ysize*black + th, label);
      } else {
		    var blank = (white != wo) ? white : black;  
        doc.line(xoff + name + xsize*round+2, yoff + head + ysize*blank+2, xoff + name + xsize*(round+1) -2, yoff + head + ysize*(blank+1)-2);
        doc.line(xoff + name + xsize*round+2, yoff + head + ysize*(blank+1)-2, xoff + name + xsize*(round+1)-2 , yoff + head + ysize*blank+2);
 	    }
    }
 
  }  
  return doc;  
}

