// ==UserScript==
// @name			Drupal devel/php Improver
// @author			John Sanderson <@9point6>
// @description		Adds CodeMirror to the devel/php page
// @namespace		http://www.9point6.com/userscript/drupal-devel-php-improver
// @include			*/devel/php
// @version			1.0
// ==/UserScript==

(function ( ) {
	var base, fn;

	// Kill it off if it's not drupal
	if( typeof window.Drupal === 'undefined' ) {
		return;
	}

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
			'fn': function ( ) {
				// Customise styles
				e = document.createElement( 'style' );
				e.appendChild( document.createTextNode( '' ) );
				document.head.appendChild( e );
				e.sheet.addRule( '.CodeMirror', 'height: 600px; font-size: 1.4em; font-family: "Inconsolata", "Source Code Pro", "Consolas", monospace;' );

				// Create CodeMirror on the textarea
				CodeMirror.fromTextArea( document.getElementById( 'edit-code' ), {
					'lineNumbers': true,
					'mode': 'application/x-httpd-php-open',
					'matchBrackets': true,
					'autoCloseBrackets': true,
					'indentUnit': 4,
					'indentWithTabs': true,
					'theme': 'monokai',
					'autofocus': true
				} );
			}
		}
	] );
})( );
