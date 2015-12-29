(function($) {

    $.organicTabs = function(el, options) {

        var base = this;
        base.$el = $(el);
        base.$nav = $("#js-nav");

        base.init = function() {
        
            base.options = $.extend({},$.organicTabs.defaultOptions, options);
            
            // Accessible hiding fix
            $(".hide").css({
                "position": "relative",
                "top": 0,
                "left": 0,
                "display": "none"
            }); 
            
            base.$nav.on("click", "li > a", function() {

                // Figure out current list via CSS class
                var curList = base.$nav.find("a.current").attr("href").substring(1),

                // List moving to
                    $newList = $(this),
                    
                // Figure out ID of new list
                    listID = $newList.attr("href").substring(1),
                
                // Set outer wrapper height to (static) height of current inner list
                    $allListWrap = base.$el.find(".list-wrap"),
                    curListHeight = $allListWrap.height();
                    $allListWrap.height(curListHeight);

                if ((listID != curList) && ( base.$el.find(":animated").length == 0)) {
                                            
                    // Fade out current list
                    base.$el.find("#"+curList).fadeOut(base.options.speed, function() {
                        
                        // Fade in new list on callback
                        base.$el.find("#"+listID).fadeIn(base.options.speed);
                        
                        // Adjust outer wrapper to fit new list snuggly
                        var newHeight = base.$el.find("#"+listID).height();
                        $allListWrap.animate({
                            height: newHeight
                        });
                        
                        // Remove highlighting - Add to just-clicked tab
                        base.$nav.find("li a").removeClass("current");
                        $newList.addClass("current");
                            
                    });

                    // Update URL bar, retain state
                    window.history.pushState({ 
                        'organictabsState': listID 
                        }, 
                    window.document.title, window.location.pathname + "?tab=" + listID);
                }   

                // Don't behave like a regular link
                // Stop propagation and bubbling
                return false;
            });
            
        };
        base.init();

		// If someone loads the page with a tab query, show that tab
		if (getUrlParameter("tab")) {
			var currentTab = getUrlParameter("tab");
			var $correspondingSection = base.$el.find("#"+currentTab);
			if ($correspondingSection.length) {
				base.$el.find("section").hide();
				$correspondingSection.show();
				base.$nav.find("a").removeClass("current");
				base.$nav.find("a[href='#" + currentTab + "']").addClass("current");
			}
		}
    };

	// Add support for showing/hiding tabs on back/forward
	window.onpopstate = function(event) {
		var $el = $("#js-main");
		var $nav = $("#js-nav");

		var oldTab = $nav.find("a.current").attr("href").substring(1);
		var currentTab = getUrlParameter("tab") || "home";
		var $currentSection = $el.find("#"+currentTab);
		var $allListWrap = $el.find(".list-wrap");

		// Fade out current list
		$el.find("#"+oldTab).fadeOut("fast", function() {

			// Fade in new list on callback
			$currentSection.fadeIn("fast");

			// Adjust outer wrapper to fit new list snuggly
			var newHeight = $currentSection.height();
			$allListWrap.animate({
				height: newHeight
			});

			// Update current indicator on nav links
			$nav.find("a").removeClass("current");
			$nav.find("a[href='#" + currentTab + "']").addClass("current");
		});
	}

    $.organicTabs.defaultOptions = {
        "speed": 300
    };

    $.fn.organicTabs = function(options) {
        return this.each(function() {
            (new $.organicTabs(this, options));
        });
    };

	// Function for getting params
	var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};

})(jQuery);