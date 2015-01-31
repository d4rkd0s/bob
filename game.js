$(function() {

window.onload = function() {

    console.log("%c  ~~~  Bob v0.2 - Developed by d4rkd0s  ~~~  ", "color: #FFFFFF; font-size: 12px; background: #3F1338;");

    var game = new Phaser.Game(1536, 864, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    

    function preload() {
        score = 0;
        console.log("%c   score: 0   ", "color: #FFFFFF; font-size: 12px; background: #FD8223;");
        lives = 3;
        console.log("%c   lives: 3   ", "color: #FFFFFF; font-size: 12px; background: #FD8223;");

        //game.load.image('bob', 'assets/images/bob.png');
        game.load.spritesheet('bob', 'assets/images/bob.png', 54, 80);
        console.log("%c   loaded: spritesheet   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('background', 'assets/images/background.png');
        console.log("%c   loaded: background   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('ocean', 'assets/images/ocean.png');
        console.log("%c   set border: ocean   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        cursors = game.input.keyboard.createCursorKeys();
        console.log("%c   user input: enabled   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        //game.load.audio('jumpsound', 'assets/sounds/jump.wav');
        

        //walking case switch
        
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

           //walk step speed in ms
           setInterval(clock, 100);
           //notify user (console)
           console.log("%c   walking: enabled   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
           }//preload
    
    



    function create() {

        //  A simple background for our game
        game.add.sprite(0, 0, 'background');
        console.log("%c   spawned: background   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");
        //Game Objects
        player = game.add.sprite(775, game.world.height - 150, 'bob');
        console.log("%c   spawned: player   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");

        //text = "Score: " . score;
        //style = { font: "32px Arial", fill: "#3D4185", align: "center" };

        //game.add.text(game.world.centerX-300, 0, text, style);
        //sound
        //jumpsound = game.add.audio('jumpsound');
        //jumpsound.allowMultiple = false;

        //hiding this for now its in the way
        //var fatty1 = game.add.sprite(0, 0, 'fatty1');
        

        //Uncaught TypeError: Cannot read property 'velocity' of null
        //fatty1.body.velocity.x=20;

        ocean = game.add.sprite(0, game.world.height - 635, 'ocean');
        console.log("%c   spawned: border(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");
    

        //fatty1 = game.add.sprite(450, game.world.height - 300, 'fatty1');
        //fatty2 = game.add.sprite(450, game.world.height - 300, 'fatty2');
        //fatty3 = game.add.sprite(450, game.world.height - 300, 'fatty3');
    

        //ocean
        game.physics.enable(ocean, Phaser.Physics.ARCADE);
        console.log("%c   physics: enabled(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #70F885;");
        ocean.body.immovable = true;
        console.log("%c   locked: border(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #A40E38;");

        //start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        console.log("%c   physics: enabled(player)   ", "color: #FFFFFF; font-size: 10px; background: #70F885;");
        game.physics.arcade.enable(player);
        game.physics.arcade.enableBody(player);
        console.log("%c   physics: bounds(player)   ", "color: #FFFFFF; font-size: 10px; background: #70F885;");
        //Player physics properties. 
        //player.body.bounce.y = 0.3;
        //player.body.gravity.y = 800;
        player.body.collideWorldBounds = true;
        console.log("%c   collideWorldBounds: enabled   ", "color: #FFFFFF; font-size: 10px; background: #70F885;");
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
                if ( foot == 0 ){
                    player.frame = 4; 
                }
                if ( foot == 1 ){
                   player.frame = 5; 
                }
            }
            else if (cursors.down.isDown)
            {
                //  Move to the left+down
                player.body.velocity.x = -100;
                player.body.velocity.y = 100;
                if ( foot == 0 ){
                    player.frame = 4; 
                }
                if ( foot == 1 ){
                   player.frame = 5; 
                }
            }
            else
            {
                //  Move to the left
                player.body.velocity.x = -180;
                if ( foot == 0 ){
                    player.frame = 4; 
                }
                if ( foot == 1 ){
                   player.frame = 5; 
                }
            }
            
        }

        else if (cursors.right.isDown)
        {
            if (cursors.up.isDown)
            {
                //  Move to the right+up
                player.body.velocity.x = 100;
                player.body.velocity.y = -100;
                if ( foot == 0 ){
                    player.frame = 6; 
                }
                if ( foot == 1 ){
                   player.frame = 7; 
                }
            }
            else if (cursors.down.isDown)
            {
                //  Move to the right+down
                player.body.velocity.x = 100;
                player.body.velocity.y = 100;
                if ( foot == 0 ){
                    player.frame = 6; 
                }
                if ( foot == 1 ){
                   player.frame = 7; 
                }
            }
            else
            {
                //  Move to the right
                player.body.velocity.x = 180;
                if ( foot == 0 ){
                    player.frame = 6; 
                }
                if ( foot == 1 ){
                   player.frame = 7; 
                }
            }
            
        }
        else if (cursors.up.isDown)
        {
            //  Move to the up
            player.body.velocity.y = -180; 
            if ( foot == 0 ){
               player.frame = 2; 
            }
            if ( foot == 1 ){
               player.frame = 3; 
            }
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