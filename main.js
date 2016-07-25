"use strict";
$(function(){

  // jQuery globals!
  var $guybrush = $('.guybrush'),
      $message = $('.message'),
      $window = $('.window'),
      $items = $('.item'),
      $tooltip = $('.tooltip'),
      command = {
        'verb': '',
        'subject': '',
        'object': ''
      },
      clickTimer = 0,
      worldItems = {};

  function Item(props) {
    this.name = props.name || 'missingNo';
    this.className = props.className || 'missingNo';
    this.top = (props.top) ? String(props.top) + 'px' : '0px';
    this.left = (props.left) ? String(props.left)+ 'px' : '0px';
    this.storable = props.storable || false;
    this.openable = props.openable || false;
    this.usable = props.usable || false;
    this.locked = props.locked || false;
    this.container = props.container || false;
    this.items = props.items || [];
    this.screen = props.screen || 0;
  }

  Item.prototype.place = function() {
    var $item = $('<div>');
    $item.addClass(this.className + ' item');
    $item.css({
      'top': this.top,
      'left': this.left
    });
    $item.attr('data-name', noSpace(this.name));
    worldItems[this.name] = this;
    $item.on('click',setup.nounListen);
    $item.appendTo($window);
  };

  Item.prototype.store = function() {
    var $item = $('<div>');
    $item.attr('data-name', noSpace(this.name));
    $item.addClass(this.className + ' item stored');
    guybrush.inventory[this.name] = this;
    $item.on('click',setup.nounListen);
    $item.appendTo('.inventory');
  };

  // methods for setting up each level, plus other game states
  var setup = {
    'start' : function() {
      $window.removeClass('hidden');
      $('.design').addClass('hidden');
      $window.on('click',function() {
        $('h1,.controls,.interface').removeClass('hidden');
        setup.clear();
        setup.init();
        setup.screen(0);
        setup.screen(1);
        input.init();
        $window.off();
        setup.addVerb();
      });
    },
    'init': function() {
      $window.removeClass('gameover');
      $('.controls').removeClass('gameover');
      $guybrush = $('<div class="guybrush"></div>');
      $message = $('<div class="message"></div>');
      $guybrush.appendTo($window);
      $message.appendTo($window);
      $tooltip = $('<div class="message"></div>');
    },
    'screen': function(num) {
      if (num === 0) {
        for (var item in storage) {
          if (storage[item]['screen'] === num) {
            new Item(storage[item]).store()
          }
        }
      } else {
        $window.addClass('screen' + String(num));
        for (var item in storage) {
          if (storage[item]['screen'] === num) {
            new Item(storage[item]).place()
          }
        }
      }
    },
    'clear' : function() {
      $window.empty();
      worldItems = {};
    },
    'loading' : function() {
      $window.text('Loading..').addClass('gameover');
      var ticks = 0;
      var timeoutLoading = setInterval(function(){
        ticks++;
        $window.append('.');
        if (ticks === 4) {
          clearInterval(timeoutLoading);
        }
      },1000)
    },
    'gameOver' : function(msg) {
      $('.controls').empty().text('GAME OVER').addClass('gameover');
      $window.html(msg+'<br><br><br>Reload the page to restart.').addClass('gameover');
    },
    'victory':function() {
      $('.controls').empty().text('You defeated the Beholder!').addClass('victory');
      $('.interface').addClass('hidden');
      $window.empty().html('').addClass('victory');
      for (var i = 0; i < 4; i++) {
        var $msg = $('<div>YOU WIN</div><br>');
        $msg.appendTo($window)
      }
    },
    'addVerb': function() {
      $('.command').on('click',function() {
        $items = $('.item');
        command.verb = $(this)['0'].id;
        clickTimer = setTimeout(function() {
          command.verb = '';
        }, 10000)
      });
    },
    'nounListen': function() {
      if (command.verb === 'use') {
        if (command.subject) {
          command.object = $(this)['0'].getAttribute('data-name').replace(/_/g,' ');
          input.parse(command.verb + ' ' + command.subject + ' on ' + command.object);
          command = {'verb' : '','subject' : '', 'object' : ''};
        } else {
          command.subject = $(this)['0'].getAttribute('data-name').replace(/_/g,' ');
        }
      } else if (command.verb) {
          clearTimeout(clickTimer);
          command.subject = $(this)['0'].getAttribute('data-name').replace(/_/g,' ');
          input.parse(command.verb + ' ' + command.subject);
          command = {'verb' : '','subject' : '', 'object' : ''};
      }
    }
  };

  // Guybrush object. Contains statuses and methods
  var guybrush = {
    'inventory':{},
    'steps': 0, // for walking animation
    'statues' : [],
    // for puzzle on screen 2
    'winningStatues' : ['statue of aphrodite','statue of hera','statue of athena'],
    'walk': function() {    // scroll through walking animation classes
      $guybrush.removeClass('walking'+(this.steps));
      var left = parseInt($guybrush.css('left'));
      left += ($guybrush.hasClass('right')) ? -8 : 8;
      left = (left < 32) ? 32 : left;
      left = (left > 725) ? 725 : left;
      $guybrush.css('left', left +'px ');
      this.steps += (this.steps === 6) ? -5 : 1;
      $guybrush.addClass('walking'+(this.steps));
    },
    'stop': function() { // stops walking, accounts for direction
      clearInterval(guybrush.moving);
      guybrush.moving = 0;
      this.rightStatus = $guybrush.hasClass('right');
      $guybrush.removeClass().addClass('guybrush');
      if (this.rightStatus) {
        $guybrush.addClass('right');
      }
    },
    'near' : function(item) {      // collision detection
      if (guybrush.inventory[item.name]) {
        return true;
      } else {
        return (Math.abs($('[data-name=\"'+noSpace(item.name)+'\"]').offset().left - $guybrush.offset().left) < 120);
      }
    },
    'say' : function(noun) {   // prepping statements to print
      return noun.charAt(0).toUpperCase() + noun.substring(1) + '.';
    },
    'open' : function(item) {     // interacting with openable Items
      var currentItem = worldItems[item];
      if (!currentItem) {
        input.print('That doesn\'t exist here.');
      } else if (item === 'turtle') {
        input.print('Well that just seems rude.')
      } else if (!currentItem.openable && item !== 'turtle') {
        input.print('I can\'t open that.');
      } else {
        if (guybrush.near(currentItem)) {
          if (!currentItem.locked) {
            $('[data-name=\"'+noSpace(item)+'\"]').addClass('open');
            currentItem.openable = false;
            if (!currentItem.container) {
              input.print('I opened it!');
            } else {
              input.print('There is a ' + currentItem.items[0] + ' inside.');
              var name = currentItem.items[0];
              var newProps = {
                'name' : name,
                'className' : name,
                'top' : parseInt(currentItem.top) + 15,
                'left' : parseInt(currentItem.left) + 30,
                'storable' : true,
                'usable' : true
              }
              worldItems[name] = new Item(newProps);
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
          var currentInventory = [];
          for (var item in guybrush.inventory) {
            currentInventory.push(guybrush.inventory[item]['name']);
          }
          input.print(input.prepareList(currentInventory,'You have '),5000);
        } else if (item == 'statues') {
          input.print('I see a red statue of hera, a blue statue of athena, and a red statue of aphrodite.')
        } else {
          input.print('I don\'t see that here.');
        }
      } else {
        var lookingAt = [];
        for (var item in worldItems) {
          lookingAt.push((worldItems[item]['name']));
        }
        input.print(input.prepareList(lookingAt,'You see '), 5000);
      }
    },
    'take' : function(item) {                        // pick up items
      var currentItem = worldItems[item];
      if (worldItems.hasOwnProperty(item) && currentItem.storable) {
        if (guybrush.near(currentItem)) {
          $('[data-name='+noSpace(currentItem.name)+']').remove();
          currentItem.store();
          delete worldItems[item];
          input.print('I took the ' + currentItem.name + '.');
        } else {
          input.print('I can\'t reach that from here.');
        }
      } else if (worldItems.hasOwnProperty(item) && !currentItem.storable) {
        input.print('I can\'t pick that up.');
      } else {
        input.print('I don\'t see that here.');
      }
    },
    'push' : function(item) {                       // basic interaction method
      var currentItem = (worldItems[item]||guybrush.inventory[item]);
      if (!currentItem) {
        input.print('Can\'t push something that isn\'t there.');
      } else if (!guybrush.near(currentItem)){
        input.print('Too far to push!');
      } else {
        if (currentItem.name === 'turtle' && !currentItem.locked) {
          input.print('Quit with the pushing!');
          setTimeout(function() {
            input.print('Take this rubber chicken with a pulley in the middle and leave me alone.', 3000);
          }, 2000);
          currentItem.locked = true;
          new Item(storage.chicken).store();
        } else if (currentItem.name.indexOf('statue') > -1 && !currentItem.locked) {
            guybrush.statues.push(currentItem.name);
            var currentTop = parseInt($('[data-name='+noSpace(currentItem.name)+']').css('top'));
            $('[data-name='+noSpace(currentItem.name)+']').css('top', String(currentTop - 10) + 'px');
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
    'hasChicken' : function() {    // check for final boss
      return this.inventory.hasOwnProperty('chicken');
    },
    'use' :function(subj,obj) {    // more-complicated two-part interactions
      var currentSubj = guybrush.inventory[subj];
      var currentObj = worldItems[obj];
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
              $('[data-name='+noSpace(currentObj.name)+']').addClass('open');
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
              setup.victory();
            } else {
              input.print('It\'s a rubber chicken with a pulley in the middle. It seems totally useless.');
            }
            break;
        }
      }
    }
  }

  // handling user input
  var input = {
    'currentMsgDelay': 0,
    'parse' : function(input) {
    // Regex help from http://stackoverflow.com/questions/20731966/regex-remove-all-special-characters-except-numbers
    var inputArr = input.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\bi\b/g,'I').split(' ');
    var verb = inputArr[0];
    var noun = inputArr.slice(1).join(' ');
    //aliases
    noun = (noun.indexOf('blue statue') > -1) ? 'statue of athena' : noun;
    noun = (noun.indexOf('green statue') > -1) ? 'statue of hera' : noun;
    noun = (noun.indexOf('red statue') > -1) ? 'statue of aphrodite' : noun;
    this.glow(verb);
    switch (verb) {
      case 'say': this.print((noun) ? guybrush.say(noun) : 'Hello!');
        break;
      case 'open': (noun) ? guybrush.open(noun) : this.print('What am I opening?');
        break;
      case 'look': guybrush.look((noun)?noun:'');
        break;
      case 'inventory': guybrush.look('inventory');
        break;
      case 'take': (noun) ? guybrush.take(noun) : this.print('What am I taking?');
        break;
      case 'push': (noun) ? guybrush.push(noun) : this.print('What am I pushing?');
        break;
      case 'use':
        var X = inputArr.slice(1,inputArr.indexOf('on')).join(' ');
        if (X) {
          var Y = inputArr.slice(inputArr.indexOf('on') + 1, inputArr.length).join(' ');
        }
        if (X && Y) {
          guybrush.use(X,Y);
        } else {
          this.print('Try typing "Use X on Y" this time.');
        }
        break;
      case 'log' : console.log(worldItems); console.log(guybrush.inventory);
        break;
      default: this.error();
    }
    },
    'print' : function(msg, time) {
      var delay = (time) ? time : 2000;
      if (msg) {
        clearTimeout(input.currentMsgDelay);
        $message.html(msg)
        $message.css({
          'opacity': '1',
          'margin-left' : String(-1 *$message.outerWidth() / 2) + 'px'
        });
        this.currentMsgDelay = setTimeout(function() {
          $message.css('opacity', '0');
        }, delay);
      }
    },
    'init': function() { // initialize user input
      $('.interface').on('keyup',function(e){
      if (e.keyCode === 13) {
        var $inputField = $('.interface');
        input.parse($inputField.val());
        $inputField.val('');
      }
      });
      $(window).on('keydown', function(e) {
        if (e.keyCode === 37) { //walk left
          e.preventDefault();
          $guybrush.addClass('right');
          guybrush.walk();
        } else if (e.keyCode === 39) { //walk right
          e.preventDefault();
          if ($window.hasClass('screen1')) { //level up!
            if ($guybrush.offset().left > 750 && !worldItems.gate.locked) {
              $window.removeClass('screen1')
              setup.loading();
              setTimeout(function(){
                $window.removeClass('gameover');
                setup.clear();
                setup.init();
                setup.screen(2);
              },5000)
            }
          } else if ($window.hasClass('screen2')) { //level up!
            if ($guybrush.offset().left > 750 && !worldItems.portal.locked) {
              $window.removeClass('screen2')
              setup.loading();
              setTimeout(function(){
                $window.removeClass('gameover');
                setup.clear();
                setup.init();
                setup.screen(3);
              },7000)
            }
          }
          $guybrush.removeClass('right');
          guybrush.walk();
        }
      });
      $(window).on('keyup', function(e){
        if (e.keyCode === 37 || e.keyCode === 39) { // stop walking on keyup
          e.preventDefault();
          guybrush.stop();
        }
      })
    },
    'glow': function(id) { //glow current keyword
      $('#'+id).addClass('glowText');
      setTimeout(function(){$('#'+id).removeClass('glowText');},500);
    },
    'prepareList' : function(arr, prefix) {
      return arr.reduce(function(prev,curr,ind,arr){
          if (arr.length === 1) {
            return prev + 'a ' + curr + '.';
          } else if (arr.length === 2) {
            if (ind === 0) {
              return prev + 'a ' + curr;
            } else {
              return prev + ' and a ' + curr + '.';
            }
          } else {
            if (ind === arr.length - 1) {
              return prev + 'and a ' + curr + '.';
            } else {
              return prev + 'a ' + curr + ', ';
            }
          }
        },prefix);
    },
    'error': function() { //most ommon message
      this.print('I didn\'t quite get that.');
    }
  }

  var designer = {
    'propertiesToUse': {},
    'create' : function() {
      if ($(this).hasClass('finish') || $('#nameSelector option').length === 1) {
        $('.design').remove();
        $('h1').text('SCUMM - The Game');
        $('h1').addClass('hidden');
        setup.start();
      } else {
        var currentItem = $('[name="name"]').val();
        designer.propertiesToUse.screen = parseInt($('#screen').val());
        designer.propertiesToUse.name = $('#nameSelector').val();
        if (storage[designer.propertiesToUse.name]) {
          for (var prop in designer.propertiesToUse) {
            storage[designer.propertiesToUse.name][prop] = designer.propertiesToUse[prop];
          }
        } else {
          storage[designer.propertiesToUse.name] = designer.propertiesToUse;
          storage[designer.propertiesToUse.name]['className'] = designer.propertiesToUse.name;
        }
        $('option[value="'+currentItem+'"]').remove();
        alert('You moved the ' + currentItem + '! Select a new item, or click Finish to start playing.');
      }
    },
    'listeners' : function(){
      $('.button').on('click',designer.create);
      $('.preview').on('click', function(e){
        designer.propertiesToUse.top = Math.round((e.offsetY / 200) * 400);
        designer.propertiesToUse.left = Math.round((e.offsetX / 400) * 800);
        $('.markTheSpot').css({
          'top': e.offsetY,
          'left': e.offsetX,
          'opacity':1
        });
      });
      $('#screen').on('change', function(){
        var newClass;
        switch(this.value) {
          case '2': newClass = 'screen2';
          break;
          case '3': newClass = 'screen3';
          break;
          default: newClass = 'screen1';
        }
        $('.preview').removeClass('screen1 screen2 screen3').addClass(newClass);
      });
      $('#nameSelector').on('change', function() {
        var newClass = storage[$('#nameSelector').val()]['className'];
        $('#miniPic').removeClass().addClass(newClass);
      });
    }
  }

  //call setup functions!
  designer.listeners();
});
