var firebaseConfig = {
  apiKey: "AIzaSyCVdFms7YnhexyoWH4Zi794h4SpcKzMStk",
  authDomain: "slider-rooms.firebaseapp.com",
  databaseURL:
    "https://slider-rooms-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "slider-rooms",
  storageBucket: "slider-rooms.appspot.com",
  messagingSenderId: "148484456682",
  appId: "1:148484456682:web:71b7f7d2fa7275ab231793",
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();


var ref = database.ref('position');
ref.on('value', gotData, errData);

function gotData(data){
console.log(data.val());
}

function errData(err){
    console.log('Error!');
    console.log(err);
    }

var config = {
  type: Phaser.AUTO,
  width: 1665,
  height: 1040,
  backgroundColor: "#000000",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var player;
var target = new Phaser.Math.Vector2();
var game = new Phaser.Game(config);
var map;
var cursors;

function preload() {
  this.load.image("tiles", "SPRITESHEET.png");
  this.load.tilemapCSV("map", "NEWTRY.csv");
  this.load.spritesheet("player", "red.png", {
    frameWidth: 100,
    frameHeight: 100,
  });
  this.load.spritesheet("player2", "blu.png", {
    frameWidth: 100,
    frameHeight: 100,
  });
}

function create() {
  map = this.make.tilemap({ key: "map", tileWidth: 20, tileHeight: 20 });
  var tileset = map.addTilesetImage("tiles");
  var layer = map.createLayer(0, tileset, 0, 0);

  map.setCollisionBetween(1, 2);

  player = this.physics.add.sprite(200, 400, "player", 1).setInteractive();
  player2 = this.physics.add.sprite(1000, 800, "player2", 1).setInteractive();

  this.physics.world.gravity.y = 20000;

  const urlParameter = new URLSearchParams(window.location.search);
  this.ID = urlParameter.get("player");
  console.log(this.ID);

  if (this.ID == 1) {
    console.log("yes it is 1");
    this.input.setDraggable(player);
  }

  if (this.ID == 2) {
    console.log("yes it is 2");
    this.input.setDraggable(player2);
  }

  this.input.dragDistanceThreshold = 16;

  player.on("pointerover", function () {
    player.setTint(0x7878ff);
    //window.location.href = "index.html";
  });

  player.on("pointerout", function () {
    player.clearTint();
  });

  player2.on("pointerover", function () {
    player2.setTint(0x7878ff);
  });

  player2.on("pointerout", function () {
    player2.clearTint();
  });

  var dragstartposition = {};
  var dragstartposition2 = {};

  this.input.on("drag", function (pointer, player, dragX, dragY) {
    var deltaX = player.x - dragstartposition.x;
    var deltaY = player.y - dragstartposition.y;

    player.x = dragX;
    player2.x = dragstartposition2.x - deltaX;

    player.y = dragY;
    player2.y = dragstartposition2.y - deltaY;

    submitscore();

    //var dist = Phaser.Math.Distance.BetweenPoints(player, player2);
    //console.log(dist);
  });

  this.input.on("dragstart", function (pointer, player, dragX, dragY) {
    dragstartposition.x = player.x;
    dragstartposition.y = player.y;

    dragstartposition2.x = player2.x;
    dragstartposition2.y = player2.y;
  });

  this.input.on("dragend", function (pointer, gameObject) {
    gameObject.clearTint();
  });

  this.physics.add.collider(player, layer);
  this.physics.add.collider(player2, layer);

  cursors = this.input.keyboard.createCursorKeys();

  text = this.add.text(60, 50, Message(), {
    fontSize: "30px",
    fill: "#ffffff",
  });

  database.ref('position').on('value', (data) => {
    const positionx = data.val()
    console.log(positionx);
});

  function submitscore() {
    var data = {
      positionx: player.x,
      positionx2: player2.x,

      positiony: player.y,
      positiony2: player2.y,
    };
    var ref = database.ref("position");
    console.log(data);
    ref.push(data);
    this.getScore(data.val());
  }

  function getScore(){
    this.player.x = data.positionx;
    this.player2.x = data.positionx2;
    this.player.y = data.positiony;
    this.player2.y = data.positiony2;

  }
}

function update(time, delta) {
  var distance = Phaser.Math.Distance.Between(
    player.x,
    player.y,
    target.x,
    target.y
  );
  var distance = Phaser.Math.Distance.Between(
    player2.x,
    player2.y,
    target.x,
    target.y
  );

  if (player.body.speed > 0) {
    if (distance < 10) {
      player.body.reset(target.x, target.y);
    }
  }

  if (player2.body.speed > 0) {
    if (distance < 10) {
      player2.body.reset(target.x, target.y);
    }
  }

  player.body.setVelocity(0);
  player2.body.setVelocity(0);

  if (this.ID == 1) {
    if (cursors.left.isDown) {
      player.body.setVelocityX(-280);
      submitscore();
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(280);
      submitscore();
    }
  }

  if (this.ID == 2) {
    if (cursors.left.isDown) {
      player2.body.setVelocityX(-280);
      submitscore();
    } else if (cursors.right.isDown) {
      player2.body.setVelocityX(280);
      submitscore();
    }
  }

  function submitscore() {
    var data = {
      positionx: player.x,
      positionx2: player2.x,

      positiony: player.y,
      positiony2: player2.y,
    };
    var ref = database.ref("position");
    console.log(data);
    ref.push(data);
  }
  


  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("left", true);
    player2.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.anims.play("right", true);
    player2.anims.play("right", true);
  } else if (cursors.up.isDown) {
    player.anims.play("up", true);
    player2.anims.play("up", true);
  } else if (cursors.down.isDown) {
    player.anims.play("down", true);
    player2.anims.play("down", true);
  } else {
    player.anims.stop();
    player2.anims.stop();
  }
}

function Message() {
  return "SCORE";
}
