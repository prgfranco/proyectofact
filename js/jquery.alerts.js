// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
(function($) {
	
	$.alerts = {
		
		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time
		
		verticalOffset: -75,                  // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                  // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,             // re-centers the dialog on window resize
		overlayOpacity: .01,                  // transparency level of overlay
		overlayColor: '#FFF',                 // base color of overlay
		draggable: false,                      // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '&nbsp;Aceptar&nbsp;',      // text for the OK button
		cancelButton: '&nbsp;Cancelar&nbsp;', // text for the Cancel button
		dialogClass: null,                    // if specified, this class will be applied to all dialogs
		
		// Public methods
		
		alert: function(message, title, callback) {
			if( title == null ) title = 'Alert';
			$.alerts._show(title, message, null, 'alert', function(result) {
				if( callback ) callback(result);
			});
		},
		
		confirm: function(message, title, callback) {
			if( title == null ) title = 'Confirm';
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) callback(result);
			});
		},
			
		prompt: function(message, value, title, callback) {
			if( title == null ) title = 'Prompt';
			$.alerts._show(title, message, value, 'prompt', function(result) {
				if( callback ) callback(result);
			});
		},
		
		// Private methods
		
		_show: function(title, msg, value, type, callback) {
			
			$.alerts._hide();
			$.alerts._overlay('show');
			
			$("BODY").append(
			  '<div id="popup_container">' +
			    '<h1 id="popup_title"></h1>' +
			    '<div id="popup_content">' +
			      '<div id="popup_message"></div>' +
				'</div>' +
			  '</div>');
			
			if( $.alerts.dialogClass ) $("#popup_container").addClass($.alerts.dialogClass);
				
				// IE6 Fix
			var pos = ($.browser.msie && parseInt($.browser.version) <= 6 ) ? 'absolute' : 'fixed'; 
			
			$("#popup_container").css({
				position: pos,
				zIndex: 99999,
				padding: 0,
				margin: 0
			});
			
			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
			$("#popup_message").text(msg);
			$("#popup_message").html( $("#popup_message").text().replace(/\n/g, '<br />') );
			
			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});
			$("#popup_container").attr({
				oncontextmenu: "return false",
				ondragstart: "return false",
				onmousedown: "return false",
				onselectstart: "return false"
			});

			$.alerts._reposition();
			$.alerts._maintainPosition(true);
			
			switch( type ) {
				case 'alert':

					$("#popup_message").after('<div id="popup_panel"><img id="popup_ok" class="jbutton" src="js/images/ace-over.png" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						callback(true);
						clearTimeout(timer);
					});
					
					$("#popup_ok").focus().keypress( function(e) {
					
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');

					});
					
					var k = window.event.keyCode;
					if(k == 13){
						
							$.alerts._hide();
					}
				break;
				case 'confirm':
					$("#popup_message").after('<div id="popup_panel"><img id="popup_ok" class="jbutton" src="js/images/ace-over.png" /><img id="popup_cancel" class="jbutton" src="js/images/can-over.png" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						if( callback ) callback(true);
						clearTimeout(timer);
					});

					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(false);
						clearTimeout(timer);
					});

					$(document).unbind("keypress");
					$(document).bind("keypress", function(e){
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
						
						});		
						$(document).unbind("keypress");			
					$("#popup_ok").focus();
					
				/*	$("#popup_ok, #popup_cancel").keypress( function(e) {
						
					});*/
					
				break;
				case 'prompt':
					$("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><img id="popup_ok" class="jbutton" src="js/images/ace-over.png" /><img id="popup_cancel" class="jbutton" src="js/images/can-over.png" /></div>');
					$("#popup_prompt").width( $("#popup_message").width() );
					$("#popup_ok").click( function() {
						var val = $("#popup_prompt").val();
						$.alerts._hide();
						if( callback ) callback( val );
						clearTimeout(timer);
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( null );
						clearTimeout(timer);
					});
					$("#popup_prompt, #popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
					if( value ) $("#popup_prompt").val(value);
					$("#popup_prompt").focus().select();
				break;
			}
			
			// Make draggable
			if( $.alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}
		},
		
		_hide: function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},
		
		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.alerts.overlayColor,
						opacity: $.alerts.overlayOpacity
					});
					$("#popup_overlay").attr({
						oncontextmenu: "return false",
						ondragstart: "return false",
						onmousedown: "return false",
						onselectstart: "return false"
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},
		
		_reposition: function() {
			//var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			//var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			var top = ((600 / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			var left = ((800 / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;

			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			
			// IE6 fix
			if( $.browser.msie && parseInt($.browser.version) <= 6 ) top = top + $(window).scrollTop();
			
			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			$("#popup_overlay").height( $(document).height() );
		},
		
		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.alerts._reposition);
					break;
				}
			}
		}
		
	}
	
	// Shortuct functions
	jAlert = function(message, title, callback){
		
		var jAlertT_V = readCookie('jAlertT');
		if(jAlertT_V == null){
			jAlertT_V = 7000;
		}

		timer = setTimeout("$('#popup_ok').click();",jAlertT_V);
		$.alerts.alert(message, title, callback);
		
		eraseCookie('jAlertT');
		
	};
	
	jConfirm = function(message, title, callback){
		
		var jAlertT_V = readCookie('jAlertT');		
		if(jAlertT_V == null){
			jAlertT_V = 7000;
		}
				
		timer = setTimeout("$('#popup_cancel').click();",jAlertT_V);
		$.alerts.confirm(message, title, callback);
		
		eraseCookie('jAlertT');
		
	};
		
	jPrompt = function(message, value, title, callback){
		
		var jAlertT_V = readCookie('jAlertT');		
		if(jAlertT_V == null){
			jAlertT_V = 7000;
		}
		
		timer = setTimeout("$('#popup_cancel').click();",jAlertT_V);
		//setTimeout("clearInterval("+IdInterva3+")",1);
		$.alerts.prompt(message, value, title, callback);
		
		eraseCookie('jAlertT');
		
	};
	
})(jQuery);