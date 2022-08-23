function gOnPageLoad() {
    
    document.addEventListener('contextmenu', function( event ) {
			event.preventDefault(); // Disable mouse right click
		} );
		document.addEventListener('keydown', function( event ) {
			console.log( event.keyCode );
			if (event.keyCode == 123) { // Chrome: Inspect Element
				event.preventDefault();
		        return false;
		    } else if (event.ctrlKey && event.shiftKey && 
		    		(  event.keyCode == 73 // [Ctrl+Shift+I] Chrome: Dev Tools | Fireforx: Toogle Tools | Edge: Dev Tools 
		    		|| event.keyCode == 67 // [Ctrl+Shift+C] Chrome: Inspect Element | Fireforx: Inspector 
		    		|| event.keyCode == 75 // [Ctrl+Shift+K] Fireforx: Web Console 
		    		|| event.keyCode == 90 // [Ctrl+Shift+Z] Fireforx: Debugger 
		    		|| event.keyCode == 69 // [Ctrl+Shift+Z] Fireforx: Debugger 
		    		|| event.keyCode == 74 ) ) { // [Ctrl+Shift+J] Fireforx: Open Console
		    	event.preventDefault();
		        return false;
		    } else if (event.ctrlKey && event.altKey && 
    				(  event.keyCode == 73 // [Ctrl+Alt+I] Safari: Web Inspector 
		    		|| event.keyCode == 67 ) ) { // [Ctrl+Alt+C] Safari: Error Console
		    	event.preventDefault();
		        return false;
		    } else if (event.shiftKey && 
		    		(  event.keyCode == 118 // [Shift+F7] Fireforx: Style Editor 
		    		|| event.keyCode == 116 // [Shift+F5] Fireforx: Performance 
		    		|| event.keyCode == 120 // [Shift+F9] Fireforx: Storage Inspector 
		    		|| event.keyCode == 123 ) ) { // [Shift+F12] Fireforx: Accessibiblity
				    	event.preventDefault();
				        return false;
			}
		} );
    
    gHidePageLoader();
}