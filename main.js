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
      },
      'screen2': function() {
        $('.window').addClass('screen2');
        var knife = new Item('knife','knife',366,474,true,false,true).place();
        var statue = new Item('statue','statue red',235,150).place();
        var statue2 = new Item('statue2','statue green',235,250).place();
        var statue3 = new Item('statue3','statue blue',235,350).place();
        var portal = new Item('portal','portal',0,458,false,true,false,true).place();
      },
      'screen3': function() {
        $('.window').addClass('screen3');
        var boss = new Item('boss','boss',0,458).place();
      },
      'clear' : function() {
        // TODO LOADING SCREEN
        $('.window').empty();
        worldItems = {};
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
      'steps': 0,
      'statues' : [],
      'winningStatues' : ['statue3','statue','statue2'],
      'walk': function() {
        $guybrush.removeClass('walking'+(this.steps));
        var left = parseInt($guybrush.css('left'));
        left += ($guybrush.hasClass('right')) ? -8 : 8;
        left = (left < 5) ? 5 : left;
        left = (left > 790) ? 790 : left;
        $guybrush.css('left', left +'px ');
        this.steps += (this.steps === 6) ? -5 : 1;
        $guybrush.addClass('walking'+(this.steps));
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
        return (Math.abs($('[data-name='+item.name+']').offset().left - $guybrush.offset().left) < 60);
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
          if (worldItems.hasOwnProperty(item) || guybrush.inventory.hasOwnProperty(item)) {
            input.print(descriptions[item], 2000);
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
          } else if (currentItem.className.indexOf('statue') > -1 && !currentItem.locked) {
              guybrush.statues.push(currentItem.name);
              var currentTop = parseInt($('[data-name='+currentItem.name+']').css('top'));
              $('[data-name='+currentItem.name+']').css('top', String(currentTop - 10) + 'px');
              currentItem.locked = true;
              input.print('The statue moves slightly backwards with an ominous groan.')
              if (guybrush.statues.length === 3) {
                for (var i = 0; i < 3; i++) {
                  if (guybrush.statues[i] !== guybrush.winningStatues[i]) {
                    setup.gameOver('A magical force tears you apart as you push the wrong statue.');
                    return;
                  }
                }
                worldItems.portal.locked = false;
                setTimeout(function() {
                  input.print('As the final statue shudders to a halt, the portal opens.')
                  $('.portal').addClass('open');
                },2001)
              }
          } else {
            input.print('Pushing that does nothing.');
          }
        }
      },
      'hasChicken' : function() {
        return this.inventory.hasOwnProperty('chicken');
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
            case 'bug':
              if (currentObj.name === 'boss') {
                if (!this.hasChicken()) {
                  setup.gameOver('A bug is useless against the power of the Beholder.');
                } else {
                  $('.bug').remove();
                  delete this.inventory.bug;
                  input.print('The Beholder burns the bug to smithereens. Try again!');
                }
              } else {
                  input.print('What am I supposed to do with a stupid bug?');
              }
              break;
            case 'rat':
                if (currentObj.name === 'boss') {
                  if (!this.hasChicken()) {
                    setup.gameOver('The rat joined forces with the Beholder to murder you.');
                  } else {
                    $('.rat').remove();
                    delete this.inventory.rat;
                    input.print('The rat scampers off in fear. Try again!');
                  }
                } else {
                  input.print('Rats are useless.');
                }
              break;
            case 'bomb':
              if (currentObj.name === 'boss') {
                if (!this.hasChicken()) {
                  setup.gameOver('The Beholder swallowed the bomb. And you.');
                } else {
                  $('.bomb').remove();
                  delete this.inventory.bomb;
                  input.print('The bomb appears to do little damage. Try again!');
                }
              } else if (currentObj.name === 'turtle') {
                setup.gameOver('Turtles have shells! The bomb bounced off and killed you.');
              } else {
                input.print('Are you insane?? Throwing a bomb in this peaceful place?', 3000);
              }
              break;
            case 'sword':
              if (currentObj.name === 'boss') {
                if (!this.hasChicken()) {
                  setup.gameOver('The sword bounces off the Beholder and beheads you cleanly.');
                } else {
                  $('.sword').remove();
                  delete this.inventory.sword;
                  input.print('The Beholder melts the sword easily. Try again!');
                }
              } else if (currentObj.name === 'gate') {
                input.print('My sword can\'t open the gate.');
              } else if (currentObj.name === 'turtle') {
                input.print('He doesn\'t seemed bothered by it at all.');
              } else {
                input.print('No point in chopping that up.');
              }
              break;
            case 'knife':
              if (currentObj.name === 'boss') {
                if (!this.hasChicken()) {
                  setup.gameOver('Don\'t bring a knife to a Beholder fight.');
                } else {
                  $('.knife').remove();
                  delete this.inventory.knife;
                  input.print('You call that a knife? Try again!');
                }
              } else {
                input.print('Don\'t cut that!');
              }
              break;
            case 'chicken':
              if (currentObj.name ==='boss') {
                setup.victory(); //TODO MAKE VICTORY
              } else {
                input.print('It\'s a rubber chicken with a pulley in the middle. It seems totally useless.');
              }
              break;

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
        // case 'right': guybrush.right((parseInt(inputArr[1]))?(parseInt(inputArr[1])):'');
        //   break;
        // case 'left': guybrush.left((parseInt(inputArr[1]))?(parseInt(inputArr[1])):'');
        //   break;
        // case 'stop': guybrush.stop();
        //   break;
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
        case 'log': console.log(worldItems);console.log(guybrush.inventory);break;
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
            $guybrush.addClass('right');
            guybrush.walk();
          } else if (e.keyCode === 39) {
            e.preventDefault();
            if ($('.window').hasClass('screen1')) {
              if ($guybrush.offset().left > 800 && !worldItems.gate.locked) {
                $('.window').removeClass('screen1')
                setup.clear();
                setup.welcome();
                setup.screen2();
              }
            } else if ($('.window').hasClass('screen2')) {
              if ($guybrush.offset().left > 800 && !worldItems.portal.locked) {
                $('.window').removeClass('screen2')
                setup.clear();
                setup.welcome();
                setup.screen3();
              }
            }
            $guybrush.removeClass('right');
            guybrush.walk();
          }
        });
        $(window).on('keyup', function(e){
          if (e.keyCode === 37 || e.keyCode === 39) {
            e.preventDefault();
            guybrush.stop();
          } else if (e.keyCode === 38) {
              $('.window').removeClass('screen1 screen2');
              setup.clear();
              setup.welcome();
              setup.screen3();
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

    var descriptions = {
      'statue' : 'This seemingly magical statue glows with a magical green energy. How boring.',
      'statue2': 'This red statue is pretty cool. But not the coolest.',
      'statue3': 'Wow! This is clearly one of the best magical statues ever.',
      'bomb'   : 'Powerful. Explosive. Free.',
      'rat'    : 'Gross! It probably has scurvy or something.',
      'sword'  : 'I feel strong just looking at this bad-ass sword.',
      'boss'   : 'Holy $%!&, that\'s the second biggest Beholder that I\'ve ever seen!',
      'chest'  : 'Is it... oozing?',
      'chest2' : 'It smells terrible.',
      'chest3' : 'Ugh, another chest? Who designed this game?',
      'turtle' : 'Seems like an amiable fellow. I shouldn\'t push him.',
      'gate'   : 'Darn, if only I had a key.',
      'key'    : 'Ooh, shiny!',
      'knife'  : 'Is this a knife?',
      'portal' : 'If only there were some magical items nearby to open this portal. Sigh.',
      'chicken': 'Totally useless.'
    }
    setup.welcome();
    input.init();
    setup.screen1();

});
