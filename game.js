var config = {
    type: Phaser.AUTO,
    width: 1665,
    height: 1040,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var target = new Phaser.Math.Vector2();
var game = new Phaser.Game(config);
var map;
var cursors;


function preload ()
{
    this.load.image('tiles', 'SPRITESHEET.png');
    this.load.tilemapCSV('map', 'NEWTRY.csv');
    this.load.spritesheet('player', 'red.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('player2', 'blu.png', { frameWidth: 100, frameHeight: 100 });
}

function create ()
{
    map = this.make.tilemap({ key: 'map', tileWidth: 20, tileHeight: 20 });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createLayer(0, tileset, 0, 0);

    map.setCollisionBetween(1, 2);

    player = this.physics.add.sprite(200, 400, 'player', 1).setInteractive();
    player2 = this.physics.add.sprite(1000, 800, 'player2', 1).setInteractive();
    

    this.physics.world.gravity.y = 20000;

    this.input.on('pointerdown', function (pointer) {

        target.x = pointer.x;
        target.y = pointer.y;
        
        this.physics.moveToObject(player, target, 400);
        this.physics.moveToObject(player2, target, 400);
        
    }, this);

    this.input.setDraggable(player);
    this.input.setDraggable(player2);
 
    this.input.dragDistanceThreshold = 16;

    player.on('pointerover', function () {

        player.setTint(0x7878ff);

    });

    player.on('pointerout', function () {

        player.clearTint();

    });

    player2.on('pointerover', function () {

        player2.setTint(0x7878ff);

    });

    player2.on('pointerout', function () {

        player2.clearTint();

    });

    this.input.on('drag', function (pointer, player, dragX, dragY) {

        player.x = dragX;
        player2.x = dragX;

    });

    this.input.on('dragend', function (pointer, gameObject) {

        gameObject.clearTint();

    });

    this.physics.add.collider(player, layer);
    this.physics.add.collider(player2, layer);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(60,50, Message(), {
        fontSize: '30px',
        fill: '#ffffff'
    });
}

function update (time, delta)
{
    var distance = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);
    var distance = Phaser.Math.Distance.Between(player2.x, player2.y, target.x, target.y);

    if (player.body.speed > 0)
    {
      if (distance < 10)
        {
            player.body.reset(target.x, target.y);
        }
    }

    if (player2.body.speed > 0)
    {
      if (distance < 10)
        {
            player2.body.reset(target.x, target.y);
        }
    }

    player.body.setVelocity(0);
    player2.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-280);
        player2.body.setVelocityX(-280);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(280);
        player2.body.setVelocityX(280);
    }

    // Vertical movement
    if (cursors.up.isDown)
    {
        player.body.setVelocityY(-280);
        player2.body.setVelocityY(-280);
    }
    else if (cursors.down.isDown)
    {
        player.body.setVelocityY(280);
        player2.body.setVelocityY(280);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown)
    {
        player.anims.play('left', true);
        player2.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.anims.play('right', true);
        player2.anims.play('right', true);
    }
    else if (cursors.up.isDown)
    {
        player.anims.play('up', true);
        player2.anims.play('up', true);
    }
    else if (cursors.down.isDown)
    {
        player.anims.play('down', true);
        player2.anims.play('down', true);
    }
    else
    {
        player.anims.stop();
        player2.anims.stop();
    }
}


function Message ()
{
    return 'SCORE'
       
}