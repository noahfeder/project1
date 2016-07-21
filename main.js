"use strict";
$(function(){
    var $guybrush = $('.guybrush');

    //name, className, width, height, top, left required for positioning; others are handled by prototypes

    function Item(name, className, top, left, storable, openable, usable, container, items) {
      this.name = (name) ? String(name) : 'missingNo';
      this.className = (className) ? String(className) : 'img/missingNo.png';
      this.top = String(top) + 'px';
      this.left = String(left)+ 'px';
      this.storable = storable;
      this.openable = openable;
      this.usable = usable;
      this.console = container;
      this.items = items;
    }

    Item.prototype.storable = false;
    Item.prototype.openable = false;
    Item.prototype.usable = false;
    Item.prototype.container = false;
    Item.prototype.items =  [];
    Item.prototype.place = function() {
      var $item = $('<div>');
      $item.addClass(this.className + ' item');
      $item.css({
        top: this.top,
        left: this.left
      });
      $item.appendTo('.window');
    };



    var chest = new Item('chest','chest',300,100,false,true,false,true,['bugs']);
    chest.place();

    var chest2 = new Item('chest2','chest open',300,200,false,true,false,true,['rats']);
    chest2.place();

    var chest3 = new Item('chest3','chest',300,300,false,true,false,true,['keys']);
    chest3.place();

    var gate = new Item('gate','gate',380,600);
    gate.place();

    var turtle = new Item('turtle','turtle',359,476);
    turtle.place();
    // Guybrush object! Contains statuses and methods

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
      },
      'inventory':{}
    }

    var input = {
      'parse' : function(input) {
      var inputArr = input.toLowerCase().split(' ');
      switch (inputArr[0]) {
        case 'right':
          guybrush.stop();
          $guybrush.removeClass('right');
          guybrush.walk();
          setTimeout(guybrush.stop,1200);
          var curr = parseInt($guybrush.css('left'));
          curr = (curr >= 715) ? 750 : curr + 35;
          $guybrush.css('left', curr+'px');
          break;
        case 'left':
          guybrush.stop();
          $guybrush.addClass('right');
          guybrush.walk();
          setTimeout(guybrush.stop,1200);
          var curr = parseInt($guybrush.css('left'));
          curr -= (curr <= 35) ? curr : 35;
          $guybrush.css('left', curr+'px');
          break;
        case 'stop':
          guybrush.stop();
          break;
        //TODO ADD VERB ACTIONS

        default: this.error();
      }
      },
      'print' : function(msg) {
        if (msg) {
          //TODO  ADD ::BEFORE TO GUYBRUSH
        }
      },
      'capitalize' : function(word) {
        return word.charAt(0).toUpperCase() + word.substring(1);
      },
      'init': function() {
        $('input').on('keyup',function(e){
        if (e.keyCode === 13) {
          var $inputField = $('input');
          input.parse($inputField.val());
          $inputField.val('');
        }
        })
      },
      'error': function() {
        this.print('I didn\'t quite get that, pal.');
      }
    }
    input.init();
    $('.kill').click(function(){
      $('.item').remove();
    })

});
