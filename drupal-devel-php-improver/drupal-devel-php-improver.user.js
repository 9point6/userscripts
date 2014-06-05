// ==UserScript==
// @name          Drupal PHP Input Improver
// @author        John Sanderson <@9point6>
// @description   Adds CodeMirror to certain fields on a Drupal site
// @namespace     http://www.9point6.com/userscript/drupal-php-input-improver
// @include       */devel/php
// @include       */admin/structure/ds/fields/manage_custom/*"
// @version       1.1.0
// ==/UserScript==

(function ( ) {
	var base, fn, loadCodeMirror;

	// Choose the version of codemirror to load
	base = '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.21.0/';

	// Loading function
	fn = function ( stack, callback ) {
		var e;

		// End if nothing left to load
		if ( stack.length < 1 ) {
			return;
		}

		var current = stack.shift( );
		var e = document.createElement( current.elem );
		e.addEventListener( 'load', function ( ) {
			fn( stack, callback );
		} );

		// if a function execute it in the global context
		if ( current.fn ) {
			e.textContent = '(' + current.fn + ')();';
		}
		else {
			for ( var row in current.attrs ) {
				e[row] = current.attrs[row];
			}
		}

		document.head.appendChild( e );
	};

	loadCodeMirror = function () {
		var elem, selector, selection, page;

		// Determine element
		if (document.location.pathname.indexOf('/devel/php') !== -1) {
			page = 'devel';
			elem = document.getElementById('edit-code');

		} else if (document.location.pathname.indexOf('/admin/structure/ds/fields/manage_custom') !== -1) {
			page = 'display-suite';
			selector = jQuery('.text-format-wrapper #edit-code-format--2');
			selection = selector.val();

			if(!window.initial) {
				selector.click(function (e) {
					selector = jQuery('.text-format-wrapper #edit-code-format--2');
					selection = selector.val();
					if (selection === 'php' || selection === 'ds_code') {
						jQuery('.CodeMirror').show();
					} else {
						jQuery('.CodeMirror').hide();
					}
				});
				window.initial = true;
			}

			if (selection === 'php' || selection === 'ds_code') {
				elem = jQuery('.text-format-wrapper textarea')[0];
			} else {
				jQuery('.CodeMirror').remove();
				return;
			}
		} else {
			return;
		}

		// Customise styles
		e = document.createElement('style');
		e.appendChild( document.createTextNode(''));
		document.head.appendChild(e);
		e.sheet.addRule( '.CodeMirror', [
			'height: 600px;',
			'font-size: 1.4em;',
			'font-family: "Inconsolata", "Source Code Pro", "Consolas", monospace;',
		].join(' '));
		e.sheet.addRule('.CodeMirror-gutters', [
			'background: #36372F !important;'
		].join(' '));

		// Create CodeMirror on the textarea
		CodeMirror.fromTextArea(elem, {
			'lineNumbers': true,
			'mode': 'application/x-httpd-php-open',
			'matchBrackets': true,
			'autoCloseBrackets': true,
			'indentUnit': 4,
			'indentWithTabs': true,
			'theme': 'monokai',
			'autofocus': true,
			'extraKeys': {
				'Ctrl-Enter': function (cm) {
					switch (page) {
						case 'devel':
							jQuery('form[action="/devel/php"]').submit();
							break;

						case 'display-suite':
							jQuery('form#ds-edit-custom-field-form').submit();
							break;

					}
				}
			}
		});
	};

	// Let's get the party started
	fn( [
		{
			'elem': 'script',
			'attrs': {
				'src': base + 'codemirror.min.js'
			}
		},
		{
			'elem': 'link',
			'attrs': {
				'href': base + 'codemirror.min.css',
				'rel': 'stylesheet'
			}
		},
		{
			'elem': 'link',
			'attrs': {
				'href': base + 'theme/monokai.min.css',
				'rel': 'stylesheet'
			}
		},
		{
			'elem': 'script',
			'attrs': {
				'src': base + 'mode/clike/clike.min.js'
			}
		},
		{
			'elem': 'script',
			'attrs': {
				'src': base + 'mode/php/php.min.js'
			}
		},
		{
			'elem': 'script',
			'attrs': {
				'src': base + 'addon/edit/matchbrackets.js'
			}
		},
		{
			'elem': 'script',
			'attrs': {
				'src': base + 'addon/edit/closebrackets.js'
			}
		},
		{
			'elem': 'script',
			'fn': loadCodeMirror
		}
	]);
})();
