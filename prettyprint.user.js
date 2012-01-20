// ==UserScript==
// @name          PrettyPrint
// @author        rlemon
// @version       0.1
// @namespace     rlemon.com
// @description	  Print view for StackExchange Questions and Answers
// @include       http://*stackoverflow.com/*
// @include       http://*superuser.com/*
// @include       http://*serverfault.com/*
// @include       http://*askubuntu.com/*
// @include       http://*stackapps.com/*
// @include       http://*.stackexchange.com/*
// @include       http://answers.onstartups.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require       https://raw.github.com/rlemon/PrettyPrint/master/printpreview.jquery.js
// ==/UserScript==


function EmbedCodeOnPage(jcode) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.textContent = jcode;
	document.head.appendChild(script);
}
function EmbedFunctionOnPageAndExecute(function_contents) {
	EmbedCodeOnPage('(' + function_contents.toString() + ')()');
}

EmbedFunctionOnPageAndExecute(function() {
	$('div.answer, div.question').each(function() {
		var print_button = $('<a>', {
			text: 'Print Preview',
			title: 'Open Print Preview',
			'class': 'print-preview'
		});
		$(this).append(print_button);
	});
	$('a.print-preview').printPreview();
});
