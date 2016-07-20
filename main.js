"use strict";
$(function(){
    var $guybrush = $('.guybrush');

    //canPickUp, canUseWithWhat?, canPlaceWhere?, canOpen[, canPush/canPull]

    function Item(name, image, storable, openable, usable, items) {
      this.name = (name) ? String(name) : 'missingNo';
      this.image = (image) ? String(image) : 'img/missingNo.png';
      this.storable = (typeof(storable) === 'boolean') ? storable : false;
      this.openable = (typeof(openable) === 'boolean') ? openable : false;
      this.usable = (typeof(usable) === 'boolean') ? usable : false;
      this.items = (typeof(items) === 'object') ? items : [];
    }

    var chest = new Item();
    console.log(chest);
    //animates guybrush walking.

    var guybrush = {
      'alive': true,
      'moving': 0,
      'right': false,
      'walk': function() {
        var i = 0
        guybrush.moving = setInterval(function(){
          $guybrush.removeClass('walking'+i);
          i += (i === 6) ? -5 : 1;
          $guybrush.addClass('walking'+i);
        },200);
      },
      'stop': function() {
        clearInterval(guybrush.moving);
        this.right = $guybrush.hasClass('right');
        $guybrush.removeClass().addClass('guybrush');
        if (this.right) {
          $guybrush.addClass('right');
        }
      }
    }


    $('.walk').on('click',guybrush.walk);
    $('.stop').on('click',guybrush.stop);
    $('.rightbutt').on('click',function(){
      $guybrush.toggleClass('right');
    })


});
