$(function() {

window.onload = function() {

    var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    
    var jumping = "0";

    var score = 0;
    var lives = 3;

    var lookdir;

    function preload() {
        
        game.load.image('bob', 'assets/images/bob.png');
        game.load.image('background', 'assets/images/background.png');
        game.load.image('ocean', 'assets/images/ocean.png');
        cursors = game.input.keyboard.createCursorKeys();
        //game.load.audio('jumpsound', 'assets/sounds/jump.wav');
        
    }
    
    



    function create() {

        //  A simple background for our game
        game.add.sprite(0, 0, 'background');

        //Game Objects
        player = game.add.sprite(550, game.world.height - 300, 'bob');


        //sound
        //jumpsound = game.add.audio('jumpsound');
        //jumpsound.allowMultiple = false;

        //hiding this for now its in the way
        //var fatty1 = game.add.sprite(0, 0, 'fatty1');
        

        //Uncaught TypeError: Cannot read property 'velocity' of null
        //fatty1.body.velocity.x=20;

        ocean = game.add.sprite(0, game.world.height - 300, 'ocean');
    

        //fatty1 = game.add.sprite(450, game.world.height - 300, 'fatty1');
        //fatty2 = game.add.sprite(450, game.world.height - 300, 'fatty2');
        //fatty3 = game.add.sprite(450, game.world.height - 300, 'fatty3');
    

        //ocean
        game.physics.enable(ocean, Phaser.Physics.ARCADE);
        ocean.body.immovable = true;

        //start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(player);
        game.physics.arcade.enableBody(player);
        //Player physics properties. 
        //player.body.bounce.y = 0.3;
        //player.body.gravity.y = 800;
        player.body.collideWorldBounds = true;
        
        //start the player looking right
        //lookdir = "right";
        
    }
    
    function update() {
        

        //ocean collision
        game.physics.arcade.collide(player, ocean);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -180;
            //make the player look left
            //lookdir = "left";
            
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 180;
            //make the player look right
            //lookdir = "right";
            
        }
        else if (cursors.up.isDown)
        {
          //  Move to the right
          player.body.velocity.y = -180; 

        }
        else if (cursors.down.isDown)
        {
          //  Move to the right
          player.body.velocity.y = 180; 
           
        }
        else
        {

        }
    


        }
    
};
});