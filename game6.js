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
var UID;

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
var player2;
var redcible;
var target = new Phaser.Math.Vector2();
var game = new Phaser.Game(config);
var map;
var cursors;

let player1x = 500;
let player1y = 500;
let player2x = 900;
let player2y = 920;

const urlParameter = new URLSearchParams(window.location.search);
this.ID = urlParameter.get("player");
UID = "_" + Math.random().toString(36).substr(2, 9);

function preload() {
  this.load.image("tiles", "SPRITESHEET.png");
  this.load.tilemapCSV("map", "level6.csv");

  this.load.atlas("player", "coolspritesheet.png", "coolsprites.json");
  this.load.atlas("player2", "bluspritesheet.png", "blusprites.json");
}

function create() {
  addDatabaseListener();

  map = this.make.tilemap({ key: "map", tileWidth: 20, tileHeight: 20 });
  var tileset = map.addTilesetImage("tiles");
  var layer = map.createLayer(0, tileset, 0, 0);
  var r1 = this.add.circle(750, 615, 20, 0xCC0000);
  var r2 = this.add.circle(1390, 425, 20, 0x6666ff);

  map.setCollisionBetween(1, 2);
  
  this.anims.create({
    key: "running",
    frames: this.anims.generateFrameNames("player", {
      prefix: "running",
      end: 11,
      zeroPad: 3,
    }),
    frameRate: 4,
    repeat: -1,
  });

  this.anims.create({
    key: "runningb",
    frames: this.anims.generateFrameNames("player2", {
      prefix: "runningb",
      end: 11,
      zeroPad: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "standing",
    frames: this.anims.generateFrameNames("player", {
      prefix: "standing",
      end: 1,
      zeroPad: 3,
    }),
    frameRate: 4,
    repeat: -1,
  });

  this.anims.create({
    key: "standingb",
    frames: this.anims.generateFrameNames("player2", {
      prefix: "standingb",
      end: 1,
      zeroPad: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNames("player", {
      prefix: "left",
      end: 11,
      zeroPad: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "leftb",
    frames: this.anims.generateFrameNames("player2", {
      prefix: "leftb",
      end: 11,
      zeroPad: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "jump",
    frames: this.anims.generateFrameNames("player", {
      prefix: "jump",
      end: 1,
      zeroPad: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "jumpb",
    frames: this.anims.generateFrameNames("player2", {
      prefix: "jumpb",
      end: 1,
      zeroPad: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "drag",
    frames: this.anims.generateFrameNames("player", {
      prefix: "drag",
      end: 6,
      zeroPad: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "dragb",
    frames: this.anims.generateFrameNames("player2", {
      prefix: "dragb",
      end: 6,
      zeroPad: 3,
    }),
    frameRate: 8,
    repeat: -1,
  });

  player = this.physics.add
    .sprite(player1x, player1y, "player", 1)
    .setInteractive();
  player2 = this.physics.add
    .sprite(player2x, player2y, "player2", 1)
    .setInteractive();

    player2.setPosition(500, 415);
    player.setPosition(1300, 755);

  this.physics.world.gravity.y = 20000;

  const urlParameter = new URLSearchParams(window.location.search);
  this.ID = urlParameter.get("player");
  console.log(this.ID);

  this.input.setDraggable(player);

  this.input.on("pointerdown", function (pointer) {});

  this.input.dragDistanceThreshold = 16;

  player.on("pointerover", function () {
    player.setTint(0x7878ff);
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

    player1x = player.x;
    player1y = player.y;
    player2x = player2.x;
    player2y = player2.y;

    send("joueur2/", {
      player1x: player1x,
      player1y: player1y,
      player2x: player2x,
      player2y: player2y,

      UID: UID,
    });
  });

  this.input.on("dragstart", function (pointer, player, dragX, dragY) {
    dragstartposition.x = player.x;
    dragstartposition.y = player.y;

    dragstartposition2.x = player2.x;
    dragstartposition2.y = player2.y;

    send("joueur2/", {
      player1x: player1x,
      player1y: player1y,
      player2x: player2x,
      player2y: player2y,

      UID: UID,
    });
  });

  this.input.on("dragend", function (pointer, gameObject) {
    gameObject.clearTint();
  });

  this.physics.add.collider(player, layer);
  this.physics.add.collider(player2, layer);

  cursors = this.input.keyboard.createCursorKeys();

}


function update(time, delta) {
  var dist2 = Phaser.Math.Distance.Between(player2.x, player2.y, 1390, 425);
  var dist = Phaser.Math.Distance.Between(player.x, player.y, 750, 615);

  if (dist < 30 && dist2 <30) {
    window.location.href = "index7.html";
    firebase.database().ref("joueur2").remove();
    firebase.database().ref("joueur1").remove();
  }

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

  if (cursors.left.isDown) {
    player.body.setVelocityX(-280);
    player.anims.play("left", true);
    player1x = player.x;
    player1y = player.y;
    player2x = player2.x;
    player2y = player2.y;
    send("joueur2/", {
      player1x: player1x,
      player1y: player1y,
      player2x: player2x,
      player2y: player2y,

      UID: UID,
    });
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(280);
    player.anims.play("running", true);
    console.log(player.x);
    player1x = player.x;
    player1y = player.y;
    player2x = player2.x;
    player2y = player2.y;
    send("joueur2/", {
      player1x: player1x,
      player1y: player1y,
      player2x: player2x,
      player2y: player2y,

      UID: UID,
    });
  } else if (cursors.up.isDown) {
    player.body.setVelocityY(-1000);
    player.anims.play("jump", true);
    player1x = player.x;
    player1y = player.y;
    player2x = player2.x;
    player2y = player2.y;
    send("joueur2/", {
      player1x: player1x,
      player1y: player1y,
      player2x: player2x,
      player2y: player2y,

      UID: UID,
    });
  } else {
    player.anims.play("standing", true);
  }
}


function send(path, value) {
  const json = {
    data: value,
  };
  database.ref(path).set(json);
}

function addDatabaseListener() {
  database.ref("joueur1").on("value", (snapshot) => {
    //            console.log(snapshot.val());
    const Main = snapshot.val();

    if (Main) {
      const data = Main.data;
      //console.log(data)
      if (data.UID == UID) {
      } else {
        let newplayer2x = data.player2x;
        let newplayer2y = data.player2y;
        let newplayer1x = data.player1x;
        let newplayer1y = data.player1y;

        player2.x = newplayer2x;
        player2.y = newplayer2y;
        player.x = newplayer1x;
        player.y = newplayer1y;
      }
    }
  });
}
