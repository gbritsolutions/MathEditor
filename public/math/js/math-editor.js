/*
  MLQ - WYSIWYG MathML editor
  All rights reserved. CQRL Bits LLP © 2023 (suki@cqrl.in)
*/
var edit_state = 0;
var edit_history = [];
var yedit_caps_lock = false;
var capsKeyPressConfig = {
    "keys"          : "caps_lock",
    "is_solitary"  : true,
    "on_keyup"      : function(event) {
	yedit_caps_lock = !yedit_caps_lock;
    }
};

function gid(id) {
    return document.getElementById(id);
}

function addCopyCutMathMLEvent() {
    function copyMathMLtoClipboard(event) {
	sel = window.getSelection();
	range = sel.getRangeAt(0);
	commonAncestor = range.commonAncestorContainer;
	let mtag = commonAncestor.nodeName;
	let otag = "<" + mtag + ">";
	let etag = "</" + mtag + ">";
	let mml = commonAncestor.innerHTML.replace(/<mi id[^<>]+>/g,"<mi>");
	mml = otag + mml + etag;
	mml = addNamespaceForMathML(mml);
	event["clipboardData"].setData("text/plain", mml);
    }
    mathml = document.querySelector(".output");
    mathml.addEventListener("copy", (event) => {
	copyMathMLtoClipboard(event);
	event.preventDefault();
    });
    mathml.addEventListener("cut", (event) => {
	const sel = document.getSelection();
	copyMathMLtoClipboard(event);
	sel.deleteFromDocument();
	event.preventDefault();
    });
}


function addMessageListenerFromParentFrame() {
    const mis = "<mi>&#xA0;</mi>";
    window.addEventListener(
	"message",
	(event) => {
	    // Do we trust the sender of this message?  (might be
	    // different from what we originally opened, for example).
	    //console.log("message received from:",event.origin);
	    //console.log("message:",event.data);
	    if (event.origin == "http://localhost:8080") {
		// event.source is popup
		//console.log("message from localhost:8080:",event.data);
		mathml = event.data.replace(/(<\/math>)/, mis + "$1");
		document.querySelector(".output").innerHTML = mathml;
	    }
	},
	false
    );
}

// Define keypress events
function initKeypressEvents() {
    var el = document.body.querySelector(".output");
    var listener = new window.keypress.Listener(el);
    /*=======Track-changes=====================*/
    const track_changes = getTrackChangesKeyPressConfig();
    listener.register_many(track_changes);
}

function getTrackChangesKeyPressConfig() {
    var track_changes = [];
    const ascii = getAsciiKeyCmds();
    track_changes.push(capsKeyPressConfig);
    ascii.forEach(function(item,i) {
        track_changes.push(getKeyPressConfig(item));
    });
    return track_changes;
}
function getMathTagName(c) {
    tc = "mi";
    if(/^[\p{Letter}]+$/u.test(c)) {
	tc = "mi";
    }
    else if(/^[0-9]$/.test(c)) {
	tc = "mn";
    }
    else if(/^<m/.test(c)) {
	tc = "mrow";
    }
    else {
	tc = "mo";
    }
    return tc;
}
function getKeyPressConfig(key) {
    var chr = getCharFromKey(key);
    const cfg = {
        "keys": key,
	"is_solitary"  : true,
        "on_keyup"      : function(event) {
	    if(event) {
		//event.preventDefault();
	    }
	},
        "on_keydown"      : function(event) {
	    //console.log(key,chr,yedit_caps_lock);
	    if(yedit_caps_lock && !(/^shift/.test(key))) { chr = chr.toUpperCase();  }
	    if(yedit_caps_lock && (/^shift/.test(key))) { chr = chr.toLowerCase();  }
	    if(!yedit_caps_lock && !(/^shift/.test(key))) { chr = chr.toLowerCase();  }
	    if(!yedit_caps_lock && (/^shift/.test(key))) { chr = chr.toUpperCase();  }
	    event.preventDefault();
	    let hml = chr;
	    switch(chr) {
	    case "{":
		hml = "<mrow><mo>{</mo><mi>&square;</mi><mo>}</mo></mrow>";
		break;
	    case "(":
		hml = "<mrow><mo>(</mo><mi>&square;</mi><mo>)</mo></mrow>";
		break;
	    case "[":
		hml = "<mrow><mo>[</mo><mi>&square;</mi><mo>]</mo></mrow>";
		break;
	    case "|":
		hml = "<mrow><mo>|</mo><mi>&square;</mi><mo>|</mo></mrow>";
		break;
	    case "〈":
		hml = "<mrow><mo>〈</mo><mi>&square;</mi><mo>〉</mo></mrow>";
		break;
	    case "tab":
		hml = "<mtab/>";
		break;
	    default:
		hml = chr;
	    }
	    insertInMathML(hml);
	    addEditorClickEvents();
        }
    };
    return cfg;
}

function escapedMathMLtoTags(c) {
    return c.replace(/\&lt;(m[a-z]+[^\&]*)\&gt;/g,"<$1>").replace(/\&lt;\/(m[a-z]+)\&gt;/g,"</$1>").replace(/\&amp;([^&;]+);/g,"&$1;");
}

function insertInMathML(c) {
    const cursor_id = "__cursor__";
    c = removeNamespaceForMathML(c);
    c = c.replace(/<[\/]?math[^<>]*>/,"");
    if(c == "-") {
	c = "−";
    }
    let snode = gid("__cursor__");
    var sel = window.getSelection();
    var txt = sel.anchorNode.textContent;
    let selflag = false;
    if(/<selected>$/.test(c)) {
	c = c.replace(/<selected>$/,"");
	c = c.replace(/<mi>&square;<\/mi>/,"<mi>" + txt + "</mi><!--mi>&square;<\/mi-->");
	selflag = true;
    }
    if(snode) {
	snode.innerHTML += "___" + c + "___";
	if(/^___(.+)___$/.test(snode.textContent)) {
	    snode.innerHTML = c;
	    var range = document.createRange();
	    var sel = window.getSelection();
	    range.setStart(snode, 1);
	    range.setEnd(snode, 1);
	    range.collapse(true);
	    sel.removeAllRanges();
	    sel.addRange(range);
	    snode.setAttribute('data-cursor-offset','1')
	}
	else {
	    let loc = setCursorPosition();
	    const mi_html = snode.innerHTML;
	    const mrgxp = /^(.*)___(.+)___(.*)$/;
	    const string_before = mi_html.replace(mrgxp,"$1");
	    mi_char = escapedMathMLtoTags(mi_html.replace(mrgxp,"$2"));
	    snode.innerHTML = escapedMathMLtoTags(mi_html.replace(mrgxp,"$1$3"));
	    const mtag = getMathTagName(mi_char);
	    let mi = document.createElement(mtag);
	    if(mtag != "mrow") {
		mi.id = "__cursor__";
		mi.setAttribute('data-cursor-offset',loc);
	    }
	    mi.innerHTML = mi_char;
	    if (/^[\p{Ps}\p{Pe}]$/u.test(c)) {
		mi.setAttribute("stretchy","false");
	    }
	    const pnode = snode.parentNode;
	    if(loc > 0) {
		if(/^[\p{Pe}]$/u.test(snode.textContent)) {
		    pnode.after(mi);
		}
		else {
		    snode.after(mi);
		}
	    }
	    else {
		if(/^[\p{Ps}]$/u.test(snode.textContent)) {
		    pnode.before(mi);
		}
		else {
		    snode.before(mi);
		}
	    }
	    if(txt == "□" || selflag) {
		psnode = snode.previousElementSibling;
		if(psnode) {
		    psnode.id = cursor_id;
		    psnode.setAttribute('data-cursor-offset','1')
		}
		snode.remove();
	    }
	    else {
		removeCursorMarker();
	    }
	    var mathml = document.querySelector(".output > math");
	    let mhtml = mathml.innerHTML;
	    let cursor_mark = "<mi>&#xA0;</mi>";
	    if(mtag == "mrow") {
		cursor_mark = "<mi id='__cursor__' data-cursor-offset='0'>&#xA0;</mi>";
	    }
	    mhtml = mhtml.replace(/<mi>&#xA0;<\/mi>/g,"") + cursor_mark;
	    mathml.innerHTML = mhtml;
	    addStretchyForMo();
	    loc = setCursorPosition();
	}
    }
    createUrlFromMathML();
}

function addMrowForMtoken() {
    var mtokens = document.querySelectorAll(".output mi,.output mn,.output mo,.output mtext");
    mtokens.forEach(function(item,i) {
	const parent_name = item.parentNode.nodeName.toLowerCase();
	const name = item.nodeName.toLowerCase();
	if(!/^(mrow|math)$/.test(parent_name)) {
	    var mrow = document.createElement("mrow");
	    var mi = document.createElement(name);
	    mi.innerHTML = item.innerHTML;
	    mrow.appendChild(mi);
	    item.replaceWith(mrow);
	}
    });
    var mathml = document.querySelector(".output");
    mathml.innerHTML = mathml.innerHTML;
}

function removeCursorMarker() {
    let cursor = gid("__cursor__");
    if(cursor) {
	cursor.removeAttribute('id');
	cursor.removeAttribute('data-cursor-offset');
    }    
}

function restoreMath() {
    const mathml = document.querySelector(".output");
    br = mathml.querySelector("br")
    if(br) {
	br.remove();
    }
    empty_mrows = document.querySelectorAll(".output math mrow");
    empty_mrows.forEach(function(item,i) {
	if(item.childNodes.length == 0) {
	    item.innerHTML = "<mi>&#xA0;</mi>";
	}
    });
    empty_others = document.querySelectorAll(".output math mfrac, .output math msub, .output math msup, .output math msubsup, .output math munder, .output math mover, .output math munderover");
    empty_others.forEach(function(item,i) {
	if(item.childNodes.length == 0) {
	    item.innerHTML = "<mrow><mi>&#xA0;</mi></mrow>";
	}
    });
    ms = document.querySelectorAll(".output math mi,.output math mo,.output math mn,.output math ms");
    ms.forEach(function(item,i) {
	if(/<span/.test(item.innerHTML)) {
	    item.innerHTML = item.innerHTML.replace(/(<span[^<>]+>|<\/span>)/,"");
	    rgxp = /^(.)(.|&nbsp;)$/;
	    if(rgxp.test(item.innerHTML)) {
		let mtag = item.nodeName;
		let otag = "<" + mtag + ">";
		let etag = "</" + mtag + ">";
		item.innerHTML = item.innerHTML.replace(rgxp, otag + "$1" + etag);
	    }
	}
    });
    var brs = mathml.querySelectorAll("br");
    brs.forEach(function(item,i) {
	var txt = document.createTextNode(" ");
	item.replaceWith(txt);
    });
    var els = mathml.querySelectorAll(".output math *");
    els.forEach(function(item,i) {
	if(item.textContent.trim() == "") {
	    item.remove();
	}
    });
    const cursor_mark = "<mi id='__cursor__' data-cursor-offset='0'>&#xA0;</mi>";
    const m = document.querySelector(".output math");
    let mml = mathml.innerHTML.trim();
    if(!/^<math/.test(mml) || m.textContent.trim() == "") {
	mathml.innerHTML = "<math displaystyle='true'>" + cursor_mark + "</math>";
    }
    loc = setCursorPosition();
}
function removeSquareClassWithoutSquare() {
    mrowsquares = document.querySelectorAll(".output mrow");
    mrowsquares.forEach(function(item,i) {
	if(item.textContent != "□" && item.textContent != "&square;") {
	    item.classList.remove("square");
	}
    });
}
function setCursorPosition(flg) {
    let startOffset = 0;
    const cursor_id = "__cursor__";
    let cursor = gid(cursor_id);
    if(cursor) {
	startOffset = parseInt(cursor.getAttribute('data-cursor-offset'));
    }
    else {
	const mathml = document.querySelector(".output");
	cursor = mathml.querySelector("math > *:last-child");
	cursor.id = cursor_id;
    }
    mis = document.querySelectorAll(".output mi");
    let startNode = null;
    csquare = 0;
    mis.forEach(function(item,i) {
	if(item.textContent == "□" && startNode == null) {
	    csquare++;
	}
    });
    mis.forEach(function(item,i) {
	rgxp = /^(msqrt|mroot)$/;
	if(item.textContent == "□" && startNode == null && (csquare > 1 | rgxp.test(item.parentNode.parentNode.nodeName))) {
	    startNode = item;
	}
    });
    if(startNode != null) {
	var rangeobj = document.createRange();
	var selectobj = window.getSelection();
	rangeobj.setStart(startNode,0);
	rangeobj.setEnd(startNode,1);
	//rangeobj.collapse(true);
	selectobj.removeAllRanges();
	selectobj.addRange(rangeobj);
	insertCursorMarkerInMathML(null);
    }
    else {
	if(cursor && cursor.childNodes.length > 0) {
	    startNode = cursor.childNodes[0];
	    var rangeobj = document.createRange();
	    var selectobj = window.getSelection();
	    rangeobj.setStart(startNode, startOffset);
	    rangeobj.setEnd(startNode, startOffset);
	    rangeobj.collapse(true);
	    selectobj.removeAllRanges();
	    selectobj.addRange(rangeobj);
	}
    }
    return startOffset;
}
function insertCursorMarkerInMathML(evt) {
    let sel = window.getSelection();
    range = sel.getRangeAt(0);
    let lc = range.startOffset;
    if(sel && sel.anchorNode) {
	let snode = sel.anchorNode;
	if(snode.nodeType == 3) {
	    snode = snode.parentNode;
	}
	if(snode.closest(".output")) {
	    const cursor_id = "__cursor__";
	    let psnode = gid(cursor_id);
	    if(psnode) {
		psnode.removeAttribute('id');
		psnode.removeAttribute('data-cursor-offset');
	    }
	    snode.id = cursor_id;
	    snode.setAttribute('data-cursor-offset',lc);
	    if(snode.textContent == "□") {
		range.setStart(snode,0);
		range.setEnd(snode,1);
	    }
	}
    }
}
function getAsciiKeyCmds() {
    return ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","shift a","shift b","shift c","shift d","shift e","shift f","shift g","shift h","shift i","shift j","shift k","shift l","shift m","shift n","shift o","shift p","shift q","shift r","shift s","shift t","shift u","shift v","shift w","shift x","shift y","shift z", "0","1","2","3","4","5","6","7","8","9","-","=","+","[","]","\\",";","\'",",",".","/","shift 0","shift 1","shift 2","shift 3","shift 4","shift 5","shift 6","shift 7","shift 8","shift 9","shift -","shift =","shift +","shift [","shift ]","shift \\","shift ;","shift \'","shift ,","shift .","shift /","shift (","shift )","shift {","shift }","arrowright","arrowleft","shift |","shift <","shift >","tab"];
}

function getCharFromKey(key) {
    var chr = key;
    const rgxp_shift_letters = /^shift +([a-z])$/;
    const rgxp_shift_others = /^shift +([^a-z])$/;    
    if(rgxp_shift_letters.test(key)) {
	chr = key.replace(rgxp_shift_letters,"$1");
    }
    else if(rgxp_shift_others.test(key)) {
	var ch = key.replace(rgxp_shift_others,"$1");
	const skeys = {
	    "`": "~",
	    "1": "!",
	    "2": "@",
	    "3": "#",
	    "4": "$",
	    "5": "%",
	    "6": "^",
	    "7": "&",
	    "8": "*",
	    "9": "(",
	    "0": ")",
	    "-": "_",
	    "=": "+",
	    "[": "{",
	    "]": "}",
	    "\\": "|",
	    ",": ":",
	    "\'": "\"",
	    ",": "<",
	    ".": ">",
	    "/": "?"
	}
	chr = skeys[ch];
	if(!chr) {
	    chr = key.replace(/^shift /,"");
	}
    }
    return chr;
}

function addPasteEvent() {
    var el = document.body.querySelector(".output");
    el.addEventListener('paste', function(event) {
	let sel = window.getSelection();
	let snode = sel.anchorNode.parentNode;
	let txt = (event.clipboardData || window.clipboardData).getData('text');
	event.preventDefault();
	insertInMathML(txt);
    });
}

function undoEdit() {
    if(edit_state != 0) {
	edit_state -= 1;
    }
    if(edit_history.length > 0) {
	const smml = edit_history[edit_state];
	const mml = decodedMathML(smml);
	document.querySelector(".output").innerHTML = mml;
    }
}

function redoEdit() {
    if(edit_history.length > 0 && edit_state < edit_history.length-1) {
	edit_state += 1;
	const smml = edit_history[edit_state];
	const mml = decodedMathML(smml);
	document.querySelector(".output").innerHTML = mml;
    }
}

function copyMathML(evt) {
    let mml = document.querySelector(".output").innerHTML;
    mode = document.querySelector("#mode").value;
    output_text = "";
    if(mode == "txt") {
	output_text = latex_to_js(MathML2LaTeX.convert(mml));
    }
    else if(mode == "tex") {
	output_text = MathML2LaTeX.convert(mml);
    }
    else {
	output_text = addNamespaceForMathML(mml);
    }
    navigator.clipboard.writeText(output_text);
    document.querySelector("#output_text").value = output_text;
}

function copyLink(evt) {
    let mml = document.querySelector(".output").innerHTML;
    const smml = encodedMathML(mml);
    const url = new URL(location.href);
    url.hash= "#" + smml;
    navigator.clipboard.writeText(url);
}

function saveMath() {
    let mml = document.querySelector(".output").innerHTML;
    const smml = encodedMathML(mml);
    mify = localStorage.getItem('mathmlifyx');
    var ls = {};
    const name = document.querySelector("#mathname").value.toLowerCase();
    if(mify) {
	ls = JSON.parse(mify);
	if(!ls[name]) {
	    ls[name] = [];
	}
    }
    else {
	ls[name] = [];
    }
    ls[name].push(smml);
    console.log("ls:",ls);
    document.querySelector("#mathid").value = ls[name].length;
    localStorage.setItem('mathmlifyx', JSON.stringify(ls));
}

function loadMathFromFile(e) {
    var file = e.target.files[0];
    if (!file) {
	return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
	var contents = e.target.result;
	localStorage.setItem('mathmlifyx',contents);
	loadRecentMath();
    };
    reader.readAsText(file);
}

function saveMathToFile() {
    const mify = localStorage.getItem('mathmlifyx');
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(mify));
    const filename = prompt("Provide filename:",".mlq");
    a.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        a.dispatchEvent(event);
    }
    else {
        a.click();
    }
}

function deleteMath() {
    mify = localStorage.getItem('mathmlifyx');
    const name = document.querySelector("#mathname").value;
    const i = parseInt(document.querySelector("#mathid").value);
    if(mify && name && i) {
	ls = JSON.parse(mify);
	ls[name].splice(i-1,1);
    }
    localStorage.setItem('mathmlifyx', JSON.stringify(ls));
}


function getMathWithId(id) {
    let i = parseInt(id);
    const name = document.querySelector("#mathname").value.toLowerCase();
    mathify = localStorage.getItem('mathmlifyx');
    if(mathify) {
	ls = JSON.parse(mathify);
	var L = ls[name].length;
	if(i > L) {
	    i = L;
	}
	else if(i < 1) {
	    i = 1;
	}
	document.querySelector("#mathid").value = i;
	loadMathMLFromData(ls[name][i-1]);
    }
}

function loadRecentMath() {
    const mathify = localStorage.getItem('mathmlifyx');
    const select = document.querySelector("#mathname");
    const options = select.querySelectorAll("option");
    var name = "default";
    var L = 0;
    if(mathify) {
	var ls = JSON.parse(localStorage.getItem('mathmlifyx'));
	var name = "default";
	var N = ls[name].length;
	for(name in ls) {
	    L = L + 1;
	    N = ls[name].length;
	    if(name != "default") {
		var newOption = document.createElement("option");
		newOption.setAttribute("value", name.toLowerCase());
		newOption.innerHTML = name;
		select.insertBefore(newOption,options[options.length-1]);
	    }
	}
	select.selectedIndex = L-1;
	loadMathMLFromData(ls[name][N-1]);
	document.querySelector("#mathid").value = N;
    }
}

function loadMathLabel(cls) {
    const mathify = localStorage.getItem('mathmlifyx');
    const name = cls;
    if(mathify) {
	var ls = JSON.parse(mathify);
	var N = ls[name].length;
	loadMathMLFromData(ls[name][N-1]);
	document.querySelector("#mathid").value = N;
    }
}


function addEditorClickEvents() {
    var el = document.body.querySelector(".output");
    el.addEventListener('click', function(event) {
	insertCursorMarkerInMathML(event);
	//createUrlFromMathML();
    });
}

function solveMath() {
    try {
	const input_text = document.querySelector("#output_text").value;
	const output = document.querySelector("#solution_text");
	const options = { displayMode: true };
	output.innerHTML = katex.renderToString(solveWithNerdamer(input_text), options);
    }
    catch(error) {
	console.log(error);
    }
}

function solveWithNerdamer(input_text) {
    solution_text = "";
    const smode = document.querySelector("#smode").value;
    switch(smode) {
    case "simplify":
	solution_text = nerdamer(input_text).toTeX();
	break;
    case "evaluate":
	solution_text = nerdamer.evaluate(input_text,"x").toTeX();
	break;
    case "expand":
	solution_text = nerdamer.expand(input_text).toTeX();
	break;
    case "solve":
	if (/,/.test(input_text)) {
	    input_text_array = input_text.split(/,/);
	    console.log(input_text_array);
	    solution_text_array = nerdamer.solveEquations(input_text_array);
	    solution_text_arr = []
	    solution_text_array.forEach((item) => {
		solution_text_arr.push(item[0] + " = " + item[1]);
	    });
	    solution_text = solution_text_arr.join(", ");
	}
	else {
	    solution_text = nerdamer.solve(input_text,"x").toTeX();
	}
	break;
    case "plot":
	plotMath();
	break;
    case "diff":
	solution_text = nerdamer("diff(" + input_text + ",x)").toTeX();
	break;
    case "integrate":
	solution_text = nerdamer("integrate(" + input_text + ",x)").toTeX();
	break;
    default:
    }
    return solution_text;
}

function plotMath() {
    const fn = document.querySelector("#output_text").value;
    functionPlot({
	target: '#plot',
	data: [
	    {
		fn: fn
	    }
	]
    });
}

function addButtonClickEvents() {
    var file_input = document.body.querySelector("#file-input");
    file_input.addEventListener('change', function(event) {
	loadMathFromFile(event);
    });
    var file = document.body.querySelector("#save2file");
    file.addEventListener('click', function(event) {
	saveMathToFile();
    });

    var submit = document.body.querySelector("#submit");
    submit.addEventListener('click', function(event) {
	solveMath();
    });
    var undo = document.body.querySelector("#undo");
    undo.addEventListener('click', function(event) {
	undoEdit();
    });
    var redo = document.body.querySelector("#redo");
    redo.addEventListener('click', function(event) {
	redoEdit();
    });
    var copymml = document.body.querySelector("#copymml");
    copymml.addEventListener('click', function(event) {
	copyMathML(event);
    });
    var copylink = document.body.querySelector("#copylink");
    copylink.addEventListener('click', function(event) {
	copyLink(event);
    });
    var savemath = document.body.querySelector("#savemath");
    savemath.addEventListener('click', function(event) {
	saveMath(event);
    });
    var deletemath = document.body.querySelector("#deletemath");
    deletemath.addEventListener('click', function(event) {
	deleteMath(event);
    });
    var mathid = document.body.querySelector("#mathid");
    mathid.addEventListener('click', function(event) {
	getMathWithId(this.value);
    });
    mathid.addEventListener('keyup', function(evt){
	getMathWithId(this.value);
    });
    var mathname = document.body.querySelector("#mathname");
    mathname.addEventListener('change', function(event) {
	if(this.value == "new") {
	    addNewCategory(this);
	}
	else {
	    loadMathLabel(this.value);
	}
    });
}

function addNewCategory(e) {
    const cat = prompt("Add a new math category","");
    if(cat) {
	const options = e.querySelectorAll("option");
	const L = options.length;
	var lastOption = options[L-1];
	var newOption = document.createElement("option");
	newOption.setAttribute("value", cat.toLowerCase());
	newOption.innerHTML = cat;
	e.insertBefore(newOption,lastOption);
	e.selectedIndex = L-1;
	document.querySelector("#mathid").value = "0";
    }
    else {
	e.selectedIndex = 0;
    }
}

function setSelectionAtCursorMarker() {
    const cursor = gid("__cursor__");
    let sel = window.getSelection();
    range = sel.getRangeAt(0);
    var L = cursor.textContent.length;
    if(L > 0) {
	L = L-1
    }
    range.setStart(cursor,L);
    range.setEnd(cursor,L);
}

function closeAllOpenMenus() {
    let uls = document.querySelectorAll(".menus ul");
    uls.forEach(function(ul,i) {
	ul.remove();
    });
}

function sendMathML() {
    let pwin = window.parent;
    let mathml = document.querySelector(".output").innerHTML;
    if(window.self !== window.top) {
	pwin.postMessage(mathml,"*");
	//console.log("mathml:",mathml);
    }
    else {
	let mathmlcode = document.querySelector("#mathmlcode");
	mathmlcode.style.display = "block";
	mathmlcode.value = mathml;
    }
}

function getMatrixHtml(m,n) {
    var mhtml = "";
    for(var i=0;i<m; i++) {
	if(i != 0) {
	    mhtml += "</mtr>";
	}
	mhtml += "<mtr>";
	for(var j=0;j<n; j++) {
	    mhtml += "<mtd><mrow><mi>&square;</mi></mrow></mtd>";
	}
    }
    // mhtml = "<mrow><mo>(</mo><mtable>" + mhtml + "</mtable><mo>)</mo></mrow>";
    mhtml = "</mo><mtable>" + mhtml + "</mtable><mo>";
    return mhtml;
}

function getMathMLFromTeX(tex) {
    let mml = "";
    try {
	var html = katex.renderToString(tex);
	//katex_div.style.display = "block";
	//mml = html.replace(/^.*<math/,"<math").replace(/<\/math>.*$/,"</math>");
	//console.log(mml);
	mml = temml.renderToString(tex);
	//console.log(mml);
    } catch (e) {
	if (e instanceof katex.ParseError) {
            // KaTeX can't parse the expression
            alert("Error in LaTeX '" + tex + "': " + e.message);
	} else {
            throw e;  // other error
	}
    }
    return mml;
}

function getKaTeXFromMathML() {
    const kml = document.querySelector("#katex_display");
    const mml = document.querySelector(".output").innerHTML;
    let tex = MathML2LaTeX.convert(mml);
    tex = tex.replace(/\\limits/g,"");
    kml.innerHTML = katex.renderToString("\\displaystyle " + tex);
    const kwd = document.querySelector("#kwd");
    kwd.innerHTML = getKeywordsFromMathML().join("; ");
    //console.log(kml.querySelector(".katex-html").textContent);
    //console.log(tex.replace(/\\[a-z]+/g,"").replace(/[\{\}_\^]/g,""));
}

function addInsertButton() {
    btn = document.querySelector("#insmath");
    if(btn) {
	btn.addEventListener("click", function() {
	    sendMathML();
	});
	if(window.self !== window.top) {
	    btn.style.display = "block";
	    btn.innerHTML = "InsertMath";
	}
    }
}

function addLaTeXInput() {
    btn = document.querySelector("#latex");
    btn.addEventListener("click", function() {
	const kml = document.querySelector("#katex_display");
	let tex = "";
	const khtml = kml.innerHTML;
	if(!/<math/.test(khtml)) {
	    tex = khtml;
	}
	$('#latexModal').modal();
	$("#txtLatex").val(tex);
	
    });
}

function addStretchyForMo() {
    var mos = document.querySelectorAll(".output mo");
    mos.forEach(function(item,i) {
	const isStretchy = item.parentNode.querySelectorAll("mfrac,mtable,mover,munder,munderover");
	//console.log("isStretchy:",isStretchy.length,item.textContent);
	if(/^[\p{Ps}\p{Pe}]$/u.test(item.textContent)) {
	    if(isStretchy.length != 0) {
		item.setAttribute("stretchy","true");
	    }
	    else {
		item.setAttribute("stretchy","false");
	    }
	}
    });
}

function extractMathFragment(mml) {
    mml = mml.replace(/<[\/]?math[^<>]*>/g,"");
    mml = mml.replace(/<[\/]?semantics[^<>]*>/g,"");    
    mml = mml.replace(/<annotation[^<>]*>[^<>]+<\/annotation>/,"");
    return mml;
}

function addDropMenuEvents() {
    ls = {};
    ls["subsup"] = ["sub","sup","subsup","multiscripts"];
    ls["frac"] = ["frac","derivative","partialderivative"];
    ls["underover"] = ["underover","under","over"];
    ls["xunderover"] = ["overrightarrow","underbrace","overbrace","underline","overline","widehatover"];
    ls["text"] = ["text"];
    ls["root"] = ["sqrt","root"];
    ls["matrix"] = ["matrix","cmatrix","choose","cases","qbracket"];
    ls["greek"] = ["alpha","beta","gamma","Gamma","epsilon","delta","Delta","pi","Pi","phi","Phi",'omega',"Omega","theta","Theta","mu","kappa","lambda","nu","xi","rho","sigma","tau","chi","psi","Psi","upsih","piv"];
    ls["math"] = ["sum","integral","partial","prod","cup","cap","plusmn","infin","forall","isin","sim","prop","and","or","there4","notin","ni","subset","supset","nsub","sube","oplus","otimes","middot","perp","rightarrow","rightleftarrow","doublerightarrow","doubleleftrightarrow","leq","geq","real","rational","lang","rang","dvert"];
    var menus = ["subsup","root","frac","underover","xunderover","matrix","greek","math","text"];
    menus.forEach(function(id,i) {
	var el = document.body.querySelector("#" + id);
	el.addEventListener('click', function(event) {
	    let ulx = el.querySelector("ul");
	    if(ulx) {
		ulx.remove();
	    }
	    else {
		//closeAllOpenMenus();
		var lss = ls[id];
		//console.log("id:",id,lss);
		var ul = document.createElement("div");
		ul.classList.add("dropdown-menu");
		ul.classList.add("shadow");
		ul.classList.add("menugrd");
		ul.classList.add("rounded");
		ul.setAttribute("aria-labelledby","navbarDropdown");
		lss.forEach(function(li,i) {
		    var list = document.createElement("a");
		    list.classList.add("dropdown-item");
		    list.classList.add("borderstyle");
		    list.classList.add("shadow-sm");
		    list.setAttribute("href","#");
		    list.title = li;
		    if(id == "greek" || id == "math") {
			ul.classList.add("greekmath");
			list.classList.add("greekmathanchor");
		    }
		    list.addEventListener('click', function(event) {
			if(id == "text") {
			    $('#textModal').modal();
			    $("#txtText").val("");
			}
			else if(li == "cmatrix") {
			    $('#matrixModal').modal();
			    $("#txtModalRows").val("2");
			    $("#txtModalColumns").val("3");
			}
			else if(id == "greek" || id == "math") {
			    let chr = mathFragments[li].replace(/<[^<>]+>/g,"");
			    insertInMathML(chr);
			    
			    //document.execCommand('insertText',false,chr);
			    //let snode = gid("__cursor__");
			    //snode.innerHTML = snode.innerHTML.replace(/&amp;([#A-za-z0-9]+;)/g,"&$1"); 
			}
			else {
			    let mhtml = mathFragments[li];
			    if(window.getSelection().toString() != "") {
				mhtml += "<selected>";
			    }
			    let output = document.body.querySelector(".output");
			    output.focus();
			    setSelectionAtCursorMarker();
			    //console.log("mhtml:",mhtml);
			    insertInMathML(mhtml);
			}
		    });
		    var p = document.createElement("span");
		    p.innerHTML = "<math displaystyle='true'>" + mathFragments[li] + "</math>";
		    list.appendChild(p);
		    ul.appendChild(list);
		});
		el.appendChild(ul);
	    }
	});
    });
}

function encodedMathML(s) {
    return LZString.compressToEncodedURIComponent(s);
    //return encodeURIComponent(Base64.encode(s));
}

function decodedMathML(s) {
    return LZString.decompressFromEncodedURIComponent(s);
    //return Base64.decode(decodeURIComponent(s));
}

function removeNamespaceForMathML(s) {
    s = s.trim();
    s = s.replace(/<[a-z]+:/g,"<");
    s = s.replace(/<\/[a-z]+:/g,"</");
    s = s.replace(/\s+xmlns:[a-z]+=.http:\/\/www.w3.org\/1998\/Math\/MathML./g, "");
    return s;
}

function addNamespaceForMathML(s) {
    s = s.trim();
    s = removeNamespaceForMathML(s);
    s = s.replace(/</g,"<m:");
    s = s.replace(/<m:\//g,"</m:");
    const otag = "<m:math xmlns:m='http://www.w3.org/1998/Math/MathML'>";
    const etag = "</m:math>";
    if(/<m:math[^<>]*>/.test(s)) {
	s = s.replace(/<m:math[^<>]*>/,otag);
    }
    else {
	s = otag + s + etag;
    }
    s = s.replace(/&nbsp;/g,"&#xA0;");
    return s;
}


function loadMathMenus() {
    for(var id in math_menus) {
	document.getElementById(id).innerHTML = math_menus[id];
    }
}

function loadMathMLFromUrl() {
    let params = new URLSearchParams(location.search);
    console.log("search:",location.search);
    let smml = location.hash.replace(/^#/,"");
    //console.log(smml);
    if(smml && smml != "" && smml.length > 10) {
	let eval = params.get('e');
	loadMathMLFromData(smml);
	console.log("eval:",eval);
	if(eval == "false") {
	    output = document.querySelector(".output");
	    output.setAttribute("contentEditable", "false");
	    //output.setAttribute("style", "margin: 25px;");
	    var pnode = output.parentNode;
	    pnode.parentNode.setAttribute("class","");
	    pnode.parentNode.innerHTML = pnode.innerHTML;
	    document.querySelector("nav").remove();
	    document.querySelector("div.keywords").remove();
	}
	location.hash = "";
    }
}

function loadMathMLFromData(smml) {
    const mml = decodedMathML(smml);
    document.querySelector(".output").innerHTML = mml;
}

function createUrlFromMathML() {
    let mml = document.querySelector(".output").innerHTML.trim();
    const smml = encodedMathML(mml);
    if(edit_history.length == 0 || smml != edit_history[edit_history.length-1]) {
	edit_history.push(smml);
	edit_state += 1;
    }
}

function addCqrlLink() {
    cqrl.addEventListener("mouseover", function() {
	let cqrl = document.querySelector("#cqrl");
	let mml = document.querySelector(".output").innerHTML;
	const smml = encodedMathML(mml);
	const url = new URL(location.href);
	url.hash= "#" + smml;
	this.setAttribute("href",url);
    });
}

function addAboutUs() {
    aboutus = document.querySelector("#aboutus");
    aboutus.addEventListener("click", function() {
	alert("MLQ (Melique) - WYSIWYG MathML Equation Editor\n" + "All rights reserved. CQRL Bits LLP © 2023\n"+ "(support@cqrl.com)");
    });
}

function getKeywordsFromMathML() {
    var keywords = [];
    var mathml = document.querySelector(".output");
    var fracs = mathml.querySelectorAll("mfrac");
    fracs.forEach(function(item,i) {
	const num = item.firstElementChild;
	if(num.firstElementChild) {
	    const den = num.nextElementSibling;
	    //console.log(num.firstElementChild.textContent,den.firstElementChild.textContent);
	    if(num.firstElementChild.textContent == "d" && den.firstElementChild.textContent == "d") {
		keywords.push("Differential Equation");
	    }
	    if(num.firstElementChild.textContent == "∂" && den.firstElementChild.textContent == "∂") {
		keywords.push("Partial Differential Equation");
	    }
	}
    });
    var mos = mathml.querySelectorAll("mo,mi");
    mos.forEach(function(item,i) {
	if(item.textContent == '=') {
	    keywords.push("Equation");
	}
	if(item.textContent == '∫') {
	    keywords.push("Single Integral");
	}
	if(item.textContent == '∬') {
	    keywords.push("Double Integral");
	}
	if(item.textContent == '∭') {
	    keywords.push("Triple Integral");
	}
	if(item.textContent == '∈') {
	    keywords.push("Element of a set");
	}
    });
    return [...new Set(keywords)];
}



jQuery(document).ready(function($) {
    createUrlFromMathML();
    initKeypressEvents();
    addPasteEvent();
    addDropMenuEvents();
    addEditorClickEvents();
    addButtonClickEvents();
    addMessageListenerFromParentFrame();
    addCopyCutMathMLEvent();
    //addAboutUs();
    addInsertButton();
    addLaTeXInput();
    addMrowForMtoken();
    //addCqrlLink();
    loadMathMenus();
    loadMathMLFromUrl();
    loadRecentMath();
    //getKaTeXFromMathML();
    //const loc = setCursorPosition();
    var el = document.querySelector(".output");
    el.addEventListener('keyup', function(event) {
	const el = document.querySelector(".output");
	const keyname = event.key;
	//console.log("keyname:",keyname);
	const arrows = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
	//console.log("keyname:",keyname);
	if(keyname == "Enter") {
	    const br = document.querySelector(".output br");
	    if(br) {
		const mtr = br.closest("mtr");
		if(mtr) {
		    var aftr = document.createElement("mtr");
		    const ncols = mtr.childNodes.length;
		    aftr.innerHTML = "<mtd><mi>&square;</mi></mtd>".repeat(ncols);
		    mtr.after(aftr);
		    const mml = document.querySelector(".output").innerHTML;
		    document.querySelector(".output").innerHTML = mml;
		}
		else {
		    br.parentNode.remove();
		}
	    }
	}
	else if(keyname == "Tab") {
	    const tab = document.querySelector(".output mtab");
	    if(tab) {
		const mtd = tab.closest("mtd");
		if(mtd) {
		    var aftd = document.createElement("mtd");
		    aftd.innerHTML = "<mi>&square;</mi>";
		    mtd.after(aftd);
		    const mml = document.querySelector(".output").innerHTML;
		    document.querySelector(".output").innerHTML = mml;
		}
		else {
		    tab.parentNode.remove();
		}
	    }
	}   
	else if(keyname == "Delete" || keyname == "Backspace") {
	    restoreMath();
	    let sel = window.getSelection();
	    let snode = sel.anchorNode;
	    if(snode) {
		const cursor_id = "__cursor__";
		cursor = snode.parentNode;
		cursor.id = cursor_id;
		cursor.setAttribute('data-cursor-offset','1')
		var rangeobj = document.createRange();
		var selectobj = window.getSelection();
		rangeobj.setStart(cursor.childNodes[0],1);
		rangeobj.setEnd(cursor.childNodes[0],1);
		//rangeobj.collapse(true);
		selectobj.removeAllRanges();
		selectobj.addRange(rangeobj);
	    }
	}
	else if(arrows.includes(keyname)) {
	    insertCursorMarkerInMathML(event);
	}
	else {
	    loc = setCursorPosition();
	    const cursor_id = "__cursor__";
	    let cursor = gid(cursor_id);
	}
    });
    $(".navbar-nav li a").on("click",".dropdown-menu a",function(event) {
	$(".navbar-collapse").collapse('hide');
    });
    $("#btnTxtModalOk").click(function(){
	let text = $("#txtText").val();
	$("#txtText").val("");
	$('#textModal').modal('hide');
	if(text != undefined || text != null){
	    let mhtml = "<mtext>" + text + "</mtext>";
	    let output = document.body.querySelector(".output");
	    output.focus();
	    setSelectionAtCursorMarker();
	    insertInMathML(mhtml);
	}
    });
    $("#btnTxtMatrixModalOk").on("click",function(){
	const rows = parseInt($("#txtModalRows").val());
	const columns = parseInt($("#txtModalColumns").val());
	const bracket = $("#ddlMatrixbracket").val();
	if(rows != "" && columns != ""){
	    $("#txtModalRows").val("2");
	    $("#txtModalColumns").val("3");
	    $('#matrixModal').modal('hide');
	    let output = document.body.querySelector(".output");
	    output.focus();
	    setSelectionAtCursorMarker();
	    const mhtml  ="<mrow><mo>"+bracket.split("-")[0]+ getMatrixHtml(rows,columns)+bracket.split("-")[1]+"</mo></mrow>";
	    insertInMathML(mhtml);
	}
    });
    $("#btnLatexModalOk").on("click",function(){
	let latex = $("#txtLatex").val();
	if(latex && latex != "") {
	    const mhtml = extractMathFragment(getMathMLFromTeX(latex));
	    if(mhtml != "") {
		let output = document.body.querySelector(".output");
		output.focus();
		setSelectionAtCursorMarker();
		insertInMathML(mhtml);
		addMrowForMtoken();
	    }
	}
    });

    $(window).ready(function(){
	$(".output").focus();
	$(".output").click();
    });
});
