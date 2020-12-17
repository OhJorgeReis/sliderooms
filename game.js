var config = {
    type: Phaser.AUTO,
    width: 1665,
    height: 1040,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var map;
var cursors;
var player;

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

    player = this.physics.add.sprite(200, 400, 'player', 1);
    player2 = this.physics.add.sprite(900, 860, 'player2', 1);

    this.physics.add.collider(player, layer);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(60,50, Message(), {
        fontSize: '30px',
        fill: '#ffffff'
    });

}

function update (time, delta)
{
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-280);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(280);
    }

    // Vertical movement
    if (cursors.up.isDown)
    {
        player.body.setVelocityY(-280);
    }
    else if (cursors.down.isDown)
    {
        player.body.setVelocityY(280);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown)
    {
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown)
    {
        player.anims.play('up', true);
    }
    else if (cursors.down.isDown)
    {
        player.anims.play('down', true);
    }
    else
    {
        player.anims.stop();
    }
}


function Message ()
{
    return 'SCORE'
       
}