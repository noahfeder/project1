"use strict";
$(function(){
    var $guybrush = $('.guybrush');
    var $message = $('.message');

    //name, className, width, height, top, left required for positioning; others are handled by prototypes

    function Item(name, className, top, left, storable, openable, usable, locked, container, items) {
      this.name = (name) ? String(name) : 'missingNo';
      this.className = (className) ? String(className) : 'img/missingNo.png';
      this.top = String(top) + 'px';
      this.left = String(left)+ 'px';
      this.storable = storable;
      this.openable = openable;
      this.usable = usable;
      this.locked = locked;
      this.container = container;
      this.items = items;
    }

    Item.prototype.storable = false;
    Item.prototype.openable = false;
    Item.prototype.usable = false;
    Item.prototype.locked = false;
    Item.prototype.container = false;
    Item.prototype.items =  [];
    Item.prototype.place = function() {
      var $item = $('<div>');
      $item.addClass(this.className + ' item');
      $item.css({
        top: this.top,
        left: this.left
      });
      $item.attr('data-name', this.name);
      worldItems[this.name] = this;
      $item.appendTo('.window');
    };
    Item.prototype.store = function() {
      var $item = $('<div>');
      $item.addClass(this.className + ' item stored');
      guybrush.inventory[this.name] = this;
      $item.appendTo('.inventory');
    };

    var worldItems = {};
    // initializer to set up items for each screen

    var setup = {
      'welcome': function() {
        //TODO MAYBE: Load in inventory, welcome splash screen?
      },
      'screen1': function() {
        var chest = new Item('chest','chest green',300,100,false,true,false,false,true,['bug']).place();
        var chest2 = new Item('chest2','chest red',300,200,false,true,false,false,true,['rat']).place();
        var chest3 = new Item('chest3','chest blue',300,300,false,true,false,false,true,['key']).place();
        var gate = new Item('gate','gate',380,605,false,true,false,true).place();
        var turtle = new Item('turtle','turtle',359,476).place();
        var bomb = new Item('bomb','bomb',0,0,true,false,true).store();
        var sword = new Item('sword','sword',0,0,true,false,true).store();
        console.log(worldItems);
        console.log(guybrush.inventory);
      },
      'screen2': function() {
        //TODO SECOND SCREEN
      },
      'screen3': function() {
        //TODO FINAL SCREEN
      },
      'clear' : function() {
        // TODO LOADING SCREEN
        $('.item').remove();
      }
    };


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
      'inventory':{},
      'near' : function(item) {
        return (Math.abs($('[data-name='+item.name+']').offset().left - $guybrush.offset().left) < 1000); //TODO BOUND
      }
    }

    var actions = {
      'right': function(destination) {
        guybrush.stop();
        $guybrush.removeClass('right');
        guybrush.walk();
        setTimeout(guybrush.stop,1200);
        var curr = parseInt($guybrush.css('left'));
        curr = destination ? destination : curr + 35;
        curr = (curr > 750) ? 750 : curr;
        $guybrush.css('left', curr+'px');
      },
      'left': function(destination) {
        guybrush.stop();
        $guybrush.addClass('right');
        guybrush.walk();
        setTimeout(guybrush.stop,1200);
        var curr = parseInt($guybrush.css('left'));
        curr = destination ? destination : curr - 35;
        curr = (curr < 35) ? 35 : curr;
        $guybrush.css('left', curr+'px');
      },
      'say' : function(inputArr) {
        var statement = inputArr.reduce(function(prev,curr,ind){
          if (ind === 0){
            return;
          } else if (ind === 1) {
            return curr.charAt(0).toUpperCase() + curr.substring(1);
          } else {
            return prev + ' ' + curr;
          }
        });
        return statement + '.';
      },
      'open' : function(item) {
        var currentItem = worldItems[item];
        if (!currentItem) {
          input.print('That doesn\'t exist here.');
        } else if (!currentItem.openable) {
          input.print('I can\'t open that.');
        } else {
          if (guybrush.near(currentItem)) {
            if (!currentItem.locked) {
              $('[data-name='+currentItem.name+']').addClass('open');
              currentItem.openable = false;
              if (!currentItem.container) {
                input.print('I opened it!');
              } else {
                input.print('There is a ' + currentItem.items[0] + ' inside.');
                var name = currentItem.items[0];
                worldItems[name] = new Item(name,name,parseInt(currentItem.top) + 10,parseInt(currentItem.left) + 30,true);
                console.log(worldItems[name])
                worldItems[name].place();

                console.log(worldItems);
              }
            } else {
              input.print('It\'s locked!');
            }
          } else {
            input.print('I can\'t reach that from here!');
          } // close enough check
        } // openable/exists chek
      },
      'look' : function(item) {
        if (item) {
          if (worldItems.hasOwnProperty(item)) {
            input.print(descriptions[item]) ///TODO ADD DESCRIPTIONS OBJECT
          } else {
            input.print('I don\'t see that here.');
          }
        } else {
          var lookingAt = 'You see: '
          for (var item in worldItems) {
            lookingAt += (worldItems[item]['name'] + ' ');
          }
          input.print(lookingAt);
        }
      },
      'take' : function(item) {
        var currentItem = worldItems[item];
        if (worldItems.hasOwnProperty(item) && currentItem.storable) {
          if (guybrush.near(currentItem)) {
            currentItem.store();
            $('[data-name='+currentItem.name+']').remove();
            delete worldItems[item];
            input.print('I took the ' + currentItem.name + '.');
          } else {
            input.print('I can\'t reach that from here.');
          }
        } else {
          input.print('I can\'t pick that up.');
        }
      },
      'push' : function(item) {
        var currentItem = worldItems[item];
        if (!currentItem) {
          input.print('Can\'t push something that isn\'t there.');
        } else if (!guybrush.near(currentItem)){
          input.print('Too far to push!');
        } else {
          if (currentItem.name === 'turtle') {
            input.print('Quit with the pushing!');
            setTimeout(function() {
              input.print('Take this rubber chicken with a pulley in the middle and leave me alone.');
            }, 2000);
            var chicken = new Item('chicken','chicken',0,0,true,false,true).store();
          } else {
            input.print('Pushing that does nothing.');
          }
        }
      }

    }

    var input = {
      'parse' : function(input) {
      // Regex help from http://stackoverflow.com/questions/20731966/regex-remove-all-special-characters-except-numbers
      var inputArr = input.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\bi\b/g,'I').split(' ');
      this.glow(inputArr[0]);
      switch (inputArr[0]) {
        case 'right':
          actions.right((parseInt(inputArr[1]))?(parseInt(inputArr[1])):'');
          break;
        case 'left':
          actions.left((parseInt(inputArr[1]))?(parseInt(inputArr[1])):'');
          break;
        case 'stop':
          guybrush.stop();
          break;
        case 'say':
          this.print((inputArr[1]) ? actions.say(inputArr) : 'Hello!');
          break;
        case 'open':
          (!inputArr[1]) ? this.error() : actions.open(inputArr[1]);
          break;
        case 'look':
          actions.look((inputArr[1])?inputArr[1]:'');
          break;
        case 'take':
          (inputArr[1]) ? actions.take(inputArr[1]) : this.print('What am I taking?');
          break;
        case 'push':
          (inputArr[1]) ? actions.push(inputArr[1]) : this.print('What am I pushing?');
          break;
        //TODO ADD VERB ACTIONS

        default: this.error();
      }
      },
      'print' : function(msg) {
        if (msg) {
          $message.css('opacity', 1);
          $message.html(msg)
          setTimeout(function() {
            $message.css('opacity', 0);
          }, 2000)
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
      'glow': function(id) {
        $('#'+id).addClass('glowText');
        setTimeout(function(){$('#'+id).removeClass('glowText');},1000);
      },
      'error': function() {
        this.print('I didn\'t quite get that.');
      }
    }

    input.init();
    setup.screen1();

});
