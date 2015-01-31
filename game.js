$(function() {

window.onload = function() {

    var game = new Phaser.Game(1536, 864, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    
    var jumping = "0";

    var score = 0;
    var lives = 3;

    var lookdir;

    function preload() {
        
        //game.load.image('bob', 'assets/images/bob.png');
        game.load.spritesheet('bob', 'assets/images/bob.png', 54, 80);
        game.load.image('background', 'assets/images/background.png');
        game.load.image('ocean', 'assets/images/ocean.png');
        cursors = game.input.keyboard.createCursorKeys();
        //game.load.audio('jumpsound', 'assets/sounds/jump.wav');
        
            function coroutine(f) {
               var o = f(); // instantiate the coroutine
               o.next(); // execute until the first yield
               return function(x) {
                   o.next(x);
               }
           }
           var clock = coroutine(function*(_) {
               while (true) {
                   yield _;
                   foot = 0;
                   yield _;
                   foot = 1;
               }
           });
           setInterval(clock, 300);

           }
    
    



    function create() {

        //  A simple background for our game
        game.add.sprite(0, 0, 'background');

        //Game Objects
        player = game.add.sprite(775, game.world.height - 150, 'bob');
        

        //score
        active = 1;
        foot = 1;

        //sound
        //jumpsound = game.add.audio('jumpsound');
        //jumpsound.allowMultiple = false;

        //hiding this for now its in the way
        //var fatty1 = game.add.sprite(0, 0, 'fatty1');
        

        //Uncaught TypeError: Cannot read property 'velocity' of null
        //fatty1.body.velocity.x=20;

        ocean = game.add.sprite(0, game.world.height - 635, 'ocean');
    

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
            if (cursors.up.isDown)
            {
                //  Move to the left+up
                player.body.velocity.x = -100;
                player.body.velocity.y = -100;
                player.frame = 4;
            }
            else if (cursors.down.isDown)
            {
                //  Move to the left+down
                player.body.velocity.x = -100;
                player.body.velocity.y = 100;
                player.frame = 4;
            }
            else
            {
                //  Move to the left
                player.body.velocity.x = -180;
                player.frame = 4;
            }
            
        }

        else if (cursors.right.isDown)
        {
            if (cursors.up.isDown)
            {
                //  Move to the right+up
                player.body.velocity.x = 100;
                player.body.velocity.y = -100;
                player.frame = 7;
            }
            else if (cursors.down.isDown)
            {
                //  Move to the right+down
                player.body.velocity.x = 100;
                player.body.velocity.y = 100;
                player.frame = 7;
            }
            else
            {
                //  Move to the right
                player.body.velocity.x = 180;
                player.frame = 7;
            }
            
        }
        else if (cursors.up.isDown)
        {
            //  Move to the up
            player.body.velocity.y = -180; 
            player.frame = 2;
        }
        else if (cursors.down.isDown)
        {
            //  Move to the down
            player.body.velocity.y = 180; 
            if ( foot == 0 ){
               player.frame = 0; 
            }
            if ( foot == 1 ){
               player.frame = 1; 
            }
           
        }




        } //update
    
};
});