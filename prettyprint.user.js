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
// @require       http://cdn.jquerytools.org/1.2.5/full/jquery.tools.min.js
// @require       https://raw.github.com/rlemon/PrettyPrint/master/print.css
// ==/UserScript==

function EmbedCodeOnPage(kode, isCSS) {
	isCSS = typeof isCSS == 'undefined' ? false : isCSS;
	var elm = isCSS ? document.createElement('style') : document.createElement('script');
	elm.type = isCSS ? 'text/css' : 'text/javascript';
	elm.textContent = kode;
	document.head.appendChild(elm);
}
function EmbedFunctionOnPageAndExecute(function_contents) {
	EmbedCodeOnPage('(' + function_contents.toString() + ')()');
}

EmbedFunctionOnPageAndExecute(function() {

/*!
 * jQuery Print Previw Plugin v1.0
 *
 * Copyright 2011, Tim Connell
 * Licensed under the GPL Version 2 license
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Date: Sun Mar 25 00:00:00 2011 -000
 * 
 * Modified by rlemon: 
 * Date: Fri Jan 20 2012
 */
 
(function($) { 
    
	// Initialization
	$.fn.printPreview = function() {
		this.each(function() {
			$(this).bind('click', function(e) {
			    e.preventDefault();
			    if (!$('#print-modal').length) {
			        $.printPreview.loadPrintPreview($(this).parent('div'));
			    }
			});
		});
		return this;
	};
    
    // Private functions
    var mask, size, print_modal, print_controls;
    $.printPreview = {
        loadPrintPreview: function(container) {
			console.log(container);
            // Declare DOM objects
            print_modal = $('<div id="print-modal"></div>');
            print_controls = $('<div id="print-modal-controls">' + 
                                    '<a href="#" class="print" title="Print page">Print page</a>' +
                                    '<a href="#" class="close" title="Close print preview">Close</a>').hide();
            var print_frame = $('<iframe id="print-modal-content" scrolling="no" border="0" frameborder="0" name="print-frame" />');

            // Raise print preview window from the dead, zooooooombies
            print_modal
                .hide()
                .append(print_controls)
                .append(print_frame)
                .appendTo('body');

            // The frame lives
            var print_frame_ref = window.frames["print-frame"].document;
            print_frame_ref.open();
            print_frame_ref.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
                '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">' + 
                '<head><title>' + document.title + '</title></head>' +
                '<body></body>' +
                '</html>');
            print_frame_ref.close();
            
            // Grab contents and apply stylesheet
            $('body', print_frame_ref).html(container.clone());
            $('head link[media*=print], head link[media=all]').each(function() {
                $('head', print_frame_ref).append($(this).clone().attr('media', 'all'));
            });
            
            // Disable all links
            $('a', print_frame_ref).bind('click.printPreview', function(e) {
                e.preventDefault();
            });
            
            // Introduce print styles
            $('head').append('<style type="text/css">' +
                '@media print {' +
                    '/* -- Print Preview --*/' +
                    '#print-modal-mask,' +
                    '#print-modal {' +
                        'display: none !important;' +
                    '}' +
                '}' +
                '</style>'
            );

            // Load mask
            $.printPreview.loadMask();

            // Disable scrolling
            $('body').css({overflowY: 'hidden', height: '100%'});
            $('img', print_frame_ref).load(function() {
                print_frame.height($('body', print_frame.contents())[0].scrollHeight);
            });
            
            // Position modal            
            starting_position = $(window).height() + $(window).scrollTop();
            var css = {
                    top:         starting_position,
                    height:      '100%',
                    overflowY:   'auto',
                    zIndex:      10000,
                    display:     'block'
                }
            print_modal
                .css(css)
                .animate({ top: $(window).scrollTop()}, 400, 'linear', function() {
                    print_controls.fadeIn('slow').focus();
                });
            print_frame.height($('body', print_frame.contents())[0].scrollHeight);
            
            // Bind closure
            $('a', print_controls).bind('click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('print')) { window.print(); }
                else { $.printPreview.distroyPrintPreview(); }
            });
            
            console.log(print_frame);
    	},
    	
    	distroyPrintPreview: function() {
    	    print_controls.fadeOut(100);
    	    print_modal.animate({ top: $(window).scrollTop() - $(window).height(), opacity: 1}, 400, 'linear', function(){
    	        print_modal.remove();
    	        $('body').css({overflowY: 'auto', height: 'auto'});
    	    });
    	    mask.fadeOut('slow', function()  {
    			mask.remove();
    		});				

    		$(document).unbind("keydown.printPreview.mask");
    		mask.unbind("click.printPreview.mask");
    		$(window).unbind("resize.printPreview.mask");
	    },

    	/* -- Mask Functions --*/
	    loadMask: function() {
	        size = $.printPreview.sizeUpMask();
            mask = $('<div id="print-modal-mask" />').appendTo($('body'));
    	    mask.css({				
    			position:           'absolute', 
    			top:                0, 
    			left:               0,
    			width:              size[0],
    			height:             size[1],
    			display:            'none',
    			opacity:            0,					 		
    			zIndex:             9999,
    			backgroundColor:    '#000'
    		});

    		mask.css({display: 'block'}).fadeTo('400', 0.75);
    		
            $(window).bind("resize.printPreview.mask", function() {
				$.printPreview.updateMaskSize();
			});

			mask.bind("click.printPreview.mask", function(e)  {
				$.printPreview.distroyPrintPreview();
			});

			$(document).bind("keydown.printPreview.mask", function(e) {
			    if (e.keyCode == 27) {  $.printPreview.distroyPrintPreview(); }
			});
        },
    
        sizeUpMask: function() {
            if ($.browser.msie) {
            	// if there are no scrollbars then use window.height
            	var d = $(document).height(), w = $(window).height();
            	return [
            		window.innerWidth || 						// ie7+
            		document.documentElement.clientWidth || 	// ie6  
            		document.body.clientWidth, 					// ie6 quirks mode
            		d - w < 20 ? w : d
            	];
            } else { return [$(document).width(), $(document).height()]; }
        },
    
        updateMaskSize: function() {
    		var size = $.printPreview.sizeUpMask();
    		mask.css({width: size[0], height: size[1]});
        }
    }
})(jQuery);


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
