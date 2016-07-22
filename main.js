"use strict";
$(function(){
    var $guybrush = $('.guybrush');
    var $message = $('.message');

    //name, className, width, height, top, left required for positioning; others are handled by prototypes

    function Item(name, className, top, left, storable, openable, usable, locked, container, items) {
      this.name = (name) ? String(name) : 'missingNo';
      this.className = (className) ? String(className) : 'missingNo';
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

    var setup = {
      'welcome': function() {
        //TODO MAYBE: Load in inventory, welcome splash screen?
        $guybrush = $('<div class="guybrush"></div>');
        $message = $('<div class="message"></div>');
        $guybrush.append($message);
        $guybrush.appendTo('.window');
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
        $('.window').addClass('screen2');
        var knife = new Item('knife','knife',366,474,true,false,true).place();
        var statue = new Item('statue','statue red',235,150).place();
        var statue2 = new Item('statue2','statue green',235,250).place();
        var statue3 = new Item('statue3','statue blue',235,350).place();
        var door = new Item('door','door',300,700,false,true,false,true).place();
      },
      'screen3': function() {
        //TODO FINAL SCREEN
        $('.window').addClass('screen3');
      },
      'clear' : function() {
        // TODO LOADING SCREEN
        $('.window').empty();
      },
      'gameOver' : function(msg) {
        $('.window').empty().css({'background-image': 'url(img/gameover.gif)','background-position':'0px -50px','text-align':'center'});
        $('.window').html(msg+'<br>Reload the page to restart.');
      }
    };


    // Guybrush object! Contains statuses and methods

    var guybrush = {
      'inventory':{},
      'alive': true,
      'moving': 0,
      'rightStatus': false,
      'walk': function() {
        var i = 0
        if (!guybrush.moving) {
          guybrush.moving = setInterval(function(){
            $guybrush.removeClass('walking'+i);
            i += (i === 6) ? -5 : 1;
            $guybrush.addClass('walking'+i);
          },200);
        }
      },
      'stop': function() {
        clearInterval(guybrush.moving);
        guybrush.moving = 0;
        this.rightStatus = $guybrush.hasClass('right');
        $guybrush.removeClass().addClass('guybrush');
        if (this.rightStatus) {
          $guybrush.addClass('right');
        }
      },
      'near' : function(item) {
        console.log(Math.abs($('[data-name='+item.name+']').offset().left - $guybrush.offset().left));
        return (Math.abs($('[data-name='+item.name+']').offset().left - $guybrush.offset().left) < 60); //TODO BOUND
      },
      'right': function() {
        $guybrush.removeClass('right');
        guybrush.walk();
        var curr = parseInt($guybrush.css('left'));
        curr = (curr > 750) ? 750 : curr + 50;
        $guybrush.css('left', curr+'px');
      },
      'left': function() {
        $guybrush.addClass('right');
        guybrush.walk();
        var curr = parseInt($guybrush.css('left'));
        curr = (curr < 35) ? 35 : curr - 50;
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
                worldItems[name] = new Item(name,name,parseInt(currentItem.top) + 10,parseInt(currentItem.left) + 30,true,false,true);
                worldItems[name].place();
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
            input.print(descriptions[item], 4000) ///TODO ADD DESCRIPTIONS OBJECT
          } else if (item === 'inventory') {
            var currentInventory = 'You have: ';
            for (var item in guybrush.inventory) {
              currentInventory += (guybrush.inventory[item]['name'] + ' ');
            }
            input.print(currentInventory,5000);
          } else {
            input.print('I don\'t see that here.');
          }
        } else {
          var lookingAt = 'You see: '
          for (var item in worldItems) {
            lookingAt += (worldItems[item]['name'] + ' ');
          }
          input.print(lookingAt, 5000);
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
              input.print('Take this rubber chicken with a pulley in the middle and leave me alone.', 3000);
            }, 2000);
            var chicken = new Item('chicken','chicken',0,0,true,false,true).store();
          } else {
            input.print('Pushing that does nothing.');
          }
        }
      },
      'use' :function(subj,obj) {
        var currentSubj = guybrush.inventory[subj];
        var currentObj = worldItems[obj];
        console.log(currentSubj);
        console.log(currentObj);
        if (!currentSubj) {
          input.print('I can\'t use something I don\'t have.');
        } else if (!currentSubj.usable) {
          input.print('I can\'t use that.')
        } else if (!currentObj) {
          input.print('What exactly do you want me to use that on?');
        } else if (!guybrush.near(currentObj)){
          input.print('That is too far away.');
        } else {
          switch (currentSubj.name) {
            case 'key':
              if (currentObj.name === 'gate') {
                currentObj.locked = false;
                $('[data-name='+currentObj.name+']').addClass('open');
                $('.'+currentSubj.name).remove();
                delete guybrush.inventory[subj];
                input.print('Opened the gate!');
              } else {
                input.print('What do people usually use keys on?');
              }
              break;
            case 'bug': input.print('What am I supposed to do with a stupid bug?');
              break;
            case 'rat': input.print('Rats are useless.');
              break;
            case 'bomb':
              if (currentObj.name === 'turtle') {
                setup.gameOver('Turtles have shells! The bomb bounced off and killed you.');
              } else {
                input.print('Are you insane?? Throwing a bomb in this peaceful place?', 3000);
              }
              break;
            case 'sword':
              if (currentObj.name === 'gate') {
                input.print('My sword can\'t open the gate.');
              } else if (currentObj.name === 'turtle') {
                input.print('He doesn\'t seemed bothered by it at all.');
              } else {
                input.print('No point in chopping that up.');
              }
              break;
            case 'chicken':
              if (currentObj.name ==='') {//TODO  BOSS BATTLE
                // TODO VICTORY
              } else {
                input.print('It\'s a rubber chicken with a pulley in the middle. It seems totally useless.');
              }

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
        case 'right': guybrush.right((parseInt(inputArr[1]))?(parseInt(inputArr[1])):'');
          break;
        case 'left': guybrush.left((parseInt(inputArr[1]))?(parseInt(inputArr[1])):'');
          break;
        case 'stop': guybrush.stop();
          break;
        case 'say': this.print((inputArr[1]) ? guybrush.say(inputArr) : 'Hello!');
          break;
        case 'open': (!inputArr[1]) ? this.error() : guybrush.open(inputArr[1]);
          break;
        case 'look': guybrush.look((inputArr[1])?inputArr[1]:'');
          break;
        case 'take': (inputArr[1]) ? guybrush.take(inputArr[1]) : this.print('What am I taking?');
          break;
        case 'push': (inputArr[1]) ? guybrush.push(inputArr[1]) : this.print('What am I pushing?');
          break;
        case 'use':
          if (inputArr[1] && inputArr[2] === 'on' && inputArr[3]) {
            guybrush.use(inputArr[1], inputArr[3]);
          } else {
            this.print('Try typing "Use X on Y" this time.');
          }
          break;

        default: this.error();
      }
      },
      'print' : function(msg, time) {
        var delay = (time) ? time : 2000;
        if (msg) {
          $message.css('opacity', 1);
          $message.html(msg)
          setTimeout(function() {
            $message.css('opacity', 0);
          }, delay)
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
        });
        $(window).on('keydown', function(e) {
          if (e.keyCode === 37) {
            e.preventDefault();
            guybrush.left();
          } else if (e.keyCode === 39) {
            e.preventDefault();
            if ($guybrush.offset().left > 800 && !worldItems.gate.locked) {
              setup.clear();
              setup.welcome();
              setup.screen2();
            }
            guybrush.right();
          }
        });
        $(window).on('keyup', function(e){
          if (e.keyCode === 37) {
            e.preventDefault();
            if (guybrush.moving) {
              guybrush.stop();
            }
          } else if (e.keyCode === 39) {
            e.preventDefault();
            if (guybrush.moving) {
              guybrush.stop();
            }
          } else if (e.keyCode === 38) {
               setup.clear();
              setup.welcome();
              setup.screen2();
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
    setup.welcome();
    input.init();
    setup.screen1();

});
