/*! jQuery Vertical Centering Plugin 1.0.6 2013-07-16 */
(function(e){"use strict";var n={verticalCentering:function(n,t){t=t||0,"number"==typeof n&&(t=n,n=void 0);var i=e(this),r=void 0===n?i.parent():e(n);i.length,i.each(function(){i=e(this);var n=i.outerHeight(),o=r.innerHeight();o>n&&i.css({marginTop:(o-n)/2+t})})}};e.fn.extend(n)})(jQuery);
