$(function() {
    window.onload = function() {
    console.log("%c  ~~~  Bob v0.2 - Developed by d4rkd0s  ~~~  ", "color: #FFFFFF; font-size: 12px; background: #3F1338;");
    var game = new Phaser.Game(1156, 650, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    function preload() {
        //setting up starting vars
        score = 0;
        console.log("%c   score: 0   ", "color: #FFFFFF; font-size: 12px; background: #FD8223;");
        lives = 3;
        console.log("%c   lives: 3   ", "color: #FFFFFF; font-size: 12px; background: #FD8223;");

        //game.load.image('bob', 'assets/images/bob.png');
        game.load.spritesheet('bob', 'assets/images/bob.png', 54, 80);
        console.log("%c   loaded: spritesheet   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('apple', 'assets/images/apple_red.png');
        game.load.image('background', 'assets/images/background.png');
        console.log("%c   loaded: background   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        //game.load.image('healthbar', 'assets/images/healthbar.png');
        //console.log("%c   loaded: healthbar   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('ocean', 'assets/images/ocean.png');
        console.log("%c   loaded: horse   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('horse', 'assets/images/horse.png');
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
        apple = game.add.sprite(game.world.width / 2, game.world.height / 2, 'apple');

        //var healthbar = game.add.sprite(0,0,'healthbar');
        //healthbar.cropEnabled = true;
        //healthbar.crop.width = (character.health / character.maxHealth) * healthbar.width

        //text = "Score: " . score;
        //style = { font: "32px Arial", fill: "#3D4185", align: "center" };
        //game.add.text(game.world.centerX-300, 0, text, style);
        //sound
        //jumpsound = game.add.audio('jumpsound');
        //jumpsound.allowMultiple = false;

        ocean = game.add.sprite(0, game.world.height - 484, 'ocean');
        console.log("%c   spawned: border(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");
        
        //add horse
        horse = game.add.sprite(450, game.world.height - 300, 'horse');
        
        //ocean
        game.physics.enable(ocean, Phaser.Physics.ARCADE);
        console.log("%c   physics: enabled(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #83CB53;");
        ocean.body.immovable = true;
        console.log("%c   locked: border(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #A40E38;");

        //start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        console.log("%c   physics: enabled(player)   ", "color: #FFFFFF; font-size: 10px; background: #83CB53;");
        game.physics.arcade.enable(player);
        game.physics.arcade.enableBody(player);
        console.log("%c   physics: bounds(player)   ", "color: #FFFFFF; font-size: 10px; background: #83CB53;");
        game.physics.arcade.enable(horse);
        game.physics.arcade.enableBody(horse);
        game.physics.arcade.enable(apple);
        game.physics.arcade.enableBody(apple);
        player.body.collideWorldBounds = true;
        horse.body.collideWorldBounds = true;
        apple.body.collideWorldBounds = true;
        console.log("%c   collideWorldBounds: enabled   ", "color: #FFFFFF; font-size: 10px; background: #83CB53;");
    }//create()
    
    function update() {
        
        //ocean collision
        game.physics.arcade.collide(player, ocean);
        game.physics.arcade.collide(player, horse);
        game.physics.arcade.collide(player, apple);
        game.physics.arcade.collide(ocean, apple);
        game.physics.arcade.collide(horse, ocean);
        //horse.body.accelerateToObject(horse, player, 600, 250, 250);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        horse.velocity = game.physics.arcade.accelerateToObject(horse, apple, 50, 50, 50);

    

        if ( apple.alive == true){
            if ( game.physics.arcade.collide(apple, player) == true ){
                score = score + 1;
                apple.kill();
                console.log(score);
            }
            if ( game.physics.arcade.collide(apple, horse) == true ){
                score = score - 1;
                apple.kill();
                console.log(score);
            }
        }
        else{
            randY = Math.floor(Math.random()*(800-50+1)+50);
            randX = Math.floor(Math.random()*(300-50+1)+50);
            apple = game.add.sprite(randX, randY, 'apple');
            game.physics.arcade.enable(apple);
            game.physics.arcade.enableBody(apple);
            apple.body.collideWorldBounds = true;
            game.physics.arcade.collide(player, apple);
            game.physics.arcade.collide(ocean, apple);
        }

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