/*
* @uses: jQuery
*/

var el = el || {};

el.core.utils.FullImage = function(options) {

  this.options = {
    'bp': 800,
    'sizeSmall': {w:360, h:494},
    'sizeBig': {w:1440, h:890},
    '$target': null
  };

  this.options = $.extend(this.options, options);

  this.name = 'FullImage';
  this.id = el.core.utils.uniqueId.get(this.name + '-');

}

el.core.utils.FullImage.prototype.resize = function(containerW, containerH) {

  if(this.options && this.options.$target) {

    var imgSize = containerW > this.options.bp ? this.options.sizeBig : this.options.sizeSmall
        w,h,dx,dy
    ;

    if(imgSize.w/imgSize.h > containerW/containerH) {

      //adjust to match height
      var h = Math.ceil(containerH),
          w = Math.ceil(containerH/imgSize.h * imgSize.w),
          dy = 0,
          dx = (containerW - w)/2
      ;
    }
    else {

      //adjust to match width
      var w = Math.ceil(containerW),
          h = Math.ceil(containerW/imgSize.w * imgSize.h),
          dy = (containerH - h)/4,
          dx = (containerW - w)/2
      ;
    }

    this.options.$target.css({
      'width': w + 'px',
      'height': h + 'px',
      'left': dx + 'px',
      'top': dy + 'px'
    });
  }
}

el.core.utils.FullImage.prototype.destroy = function() {

  this.options.$target = null;
  this.options = null;
}