var storage =
{
  'green chest' : {
    'name':'green chest',
    'className':'chest green',
    'top' : 300,
    'left' : 100,
    'openable' : true,
    'container' : true,
    'items' : ['bug'],
    'screen' : 1
  },
  'red chest' : {
    'name':'red chest',
    'className':'chest red',
    'top' : 300,
    'left' : 200,
    'openable' : true,
    'container' : true,
    'items' : ['rat'],
    'screen' : 1
  },
  'blue chest' : {
    'name':'blue chest',
    'className':'chest blue',
    'top' : 300,
    'left' : 300,
    'openable' : true,
    'container' : true,
    'items' : ['key'],
    'screen' : 1
  },
  'gate' : {
    'name':'gate',
    'className':'gate',
    'top' : 380,
    'left' : 603,
    'openable' : true,
    'locked' : true,
    'screen' : 1
  },
  'turtle' : {
    'name' :'turtle',
    'className':'turtle',
    'top':359,
    'left':476,
    'screen':1
  },
  'bomb' : {
    'name' : 'bomb',
    'className' : 'bomb',
    'usable' : true,
    'storable' : true,
    'screen' : 0
  },
  'sword' : {
    'name' :'sword',
    'className' :'sword',
    'usable' : true,
    'storable' : true,
    'screen' : 0
  },
  'knife' : {
    'name' : 'knife',
    'className' : 'knife',
    'top' : 366,
    'left' : 474,
    'storable':true,
    'usable' : true,
    'screen' : 2
  },
  'statue of hera' : {
    'name' : 'statue of hera',
    'className' : 'statue red',
    'top' : 235,
    'left' :150,
    'screen' : 2
  },
  'statue of athena' : {
    'name' : 'statue of athena',
    'className' : 'statue green',
    'top' : 235,
    'left' : 250,
    'screen' : 2
  },
  'statue of aphrodite' : {
    'name' : 'statue of aphrodite',
    'className' : 'statue blue',
    'top' : 235,
    'left' : 350,
    'screen' : 2
  },
  'portal' : {
    'name' : 'portal',
    'className' : 'portal',
    'top' : 0,
    'left' : 458,
    'openable' : true,
    'locked' : true,
    'screen' : 2
  },
  'boss' : {
    'name' : 'boss',
    'className' : 'boss',
    'top' : 0,
    'left' : 458,
    'screen' : 3
  },
  'key' : {
    'name' : 'key',
    'className' : 'key',
    'storable' : true,
    'usable' : true
  },
  'bug' : {
    'name' : 'bug',
    'className' : 'bug',
    'storable' : true,
    'usable' : true
  },
  'rat' : {
    'name' : 'rat',
    'className' : 'rat',
    'storable' : true,
    'usable' : true
  },
  'chicken' : {
    'name' : 'chicken',
    'className' : 'chicken',
    'usable' : true,
    'storable' : true
  }
};

  // dscriptions for all items
var descriptions = {
  'statue of hera' : 'This seemingly magical statue of hera glows with a magical green energy. How boring.',
  'statue of athena': 'This blue statue of athena is pretty cool. But not the coolest.',
  'statue of aphrodite': 'Wow! This red aphrodite is clearly one of the best magical statues ever.',
  'bomb'   : 'A bomb. Powerful. Explosive. Free.',
  'rat'    : 'A rat. Gross! It probably has scurvy or something.',
  'sword'  : 'A sword. I feel strong just looking at this bad-ass sword.',
  'boss'   : 'The boss. Holy $%!&, that\'s the second biggest Beholder that I\'ve ever seen!',
  'green chest'  : 'A green chest. Is it... oozing?',
  'red chest' : 'A red chest. It smells terrible.',
  'blue chest' : 'A blue chest. Ugh, another one? Who designed this game?',
  'turtle' : 'A turtle. Seems like an amiable fellow. I shouldn\'t push him.',
  'gate'   : 'A gate. Darn, if only I had a key.',
  'key'    : 'A key. Ooh, shiny!',
  'knife'  : 'A knife. It doesn\'t seem too sharp.',
  'portal' : 'A magical portal. If only there were some magical items nearby to open this portal. Sigh.',
  'chicken': 'A rubber chicken with a pulley in the middle. Totally useless.',
  'bug' : 'A bug. It seems like it could evolve at any moment.'
};

var noSpace = function(string) {
  return string.replace(/ /g,'_');
};
var noScore = function(string) {
  return string.replace(/_/g,' ');
};
var stringToArray = function(string) {
  return string.toLowerCase().trim().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\bi\b/g,'I').split(' ');
};
var aliases = function(noun) {
  if (noun.indexOf('blue statue') > -1) {
    return 'statue of athena';
  } else if (noun.indexOf('green statue') > -1) {
    return 'statue of hera';
  } else if (noun.indexOf('red statue') > -1) {
    return 'statue of aphrodite';
  } else if (noun.indexOf('door') > -1) {
    return 'gate';
  } else {
    return noun;
  }
}
