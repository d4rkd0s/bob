$(function() {
    window.onload = function() {
    console.log("%c  ~~~  Bob v0.5 - Developed by d4rkd0s & d3mn5pwn ~~~  ", "color: #FFFFFF; font-size: 12px; background: #3F1338;");
    var game = new Phaser.Game(1156, 650, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
    function preload() {
        //setting up starting vars
        apple_count = 1;
        score = 0;
        console.log("%c   score: 0   ", "color: #FFFFFF; font-size: 12px; background: #FD8223;");
        horseHealth = 10;
        console.log("%c   horseHealth: 10   ", "color: #FFFFFF; font-size: 12px; background: #FD8223;");

        speed = 250;
        //game.load.image('bob', 'assets/images/bob.png');
        game.load.spritesheet('bob', 'assets/images/bob.png', 54, 80);
        console.log("%c   loaded: spritesheet   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('apple', 'assets/images/apple_red.png');
        game.load.image('tree', 'assets/images/tree.png');
        game.load.image('sun', 'assets/images/sun.png');
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
        game.load.audio('applesound', 'assets/sounds/apple.wav');
        game.load.audio('bobsound', 'assets/sounds/bob.wav')
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
        
        apple = game.add.sprite(100, 200, 'apple');

        // Stretch to fill
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        //var healthbar = game.add.sprite(0,0,'healthbar');
        //healthbar.cropEnabled = true;
        //healthbar.crop.width = (character.health / character.maxHealth) * healthbar.width

        //text = "Score: " . score;
        //style = { font: "32px Arial", fill: "#3D4185", align: "center" };
        //game.add.text(game.world.centerX-300, 0, text, style);
        //sound
        applesound = game.add.audio('applesound');
        applesound.allowMultiple = true;

        bobsound = game.add.audio('bobsound');
        bobsound.allowMultiple = true;

        ocean = game.add.sprite(0, game.world.height - 484, 'ocean');
        tree = game.add.sprite(450, 30, 'tree');
        console.log("%c   spawned: border(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");
        
        //add horse
        horse = game.add.sprite(450, game.world.height - 300, 'horse');

        //add horse
        sun = game.add.sprite(80, 20, 'sun');

        //add player
        player = game.add.sprite(775, game.world.height - 150, 'bob');
        console.log("%c   spawned: player   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");
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
        horse.anchor.x = 0.5;
        horse.anchor.y = 0.5;

    game.scale.enterFullScreen.add(onEnterFullScreen, this);
    game.scale.leaveFullScreen.add(onLeaveFullScreen, this);

    game.input.onDown.add(gofull, this);

    //prime that apple
    apple.kill();
    }//create
    
    function onEnterFullScreen() {
    
        button.visible = true;
    
    }
    
    function onLeaveFullScreen() {
    
        button.visible = false;
        
    }
    
    function gofull() {
    
        game.scale.startFullScreen();
    
    }

    
    function update() {
        var curTime = game.time.totalElapsedSeconds();
        apple.bringToTop();
        //ocean collision
        game.physics.arcade.collide(player, ocean);
        game.physics.arcade.collide(player, horse);
        game.physics.arcade.collide(ocean, apple);
        game.physics.arcade.collide(horse, ocean);
        //horse.body.accelerateToObject(horse, player, 600, 250, 250);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        //bob faster as he scores
        speed = 200+(10*score);
        
        //move mr.horse
        horse.velocity = game.physics.arcade.accelerateToObject(horse, apple, 50+(score*5), 50+(score*5), 50+(score*5));
        
        if ( player.y < 250 ) {
            tree.bringToTop();
            apple.bringToTop();
        }
        else{
            player.bringToTop();
        }


        if ( apple.alive == true){
            if ( appleSpawnTime > curTime+3  && appleOnTree == 0 ){
                appleOnTree = 1;
            }
            if ( game.physics.arcade.overlap(apple, player) == true ){
                score = score + 1;
                bobsound.play();
                $( "#score" ).text("Score: " + score);
                apple.kill();
                console.log("Score: " + score);
            }
            if ( game.physics.arcade.collide(apple, horse) == true ){
                horseHealth = horseHealth - 1;
                if ( horseHealth == 1 ){
                    $( "#horseHealth" ).text(horseHealth + " apple until your horse dies!");
                }
                else{
                    $( "#horseHealth" ).text(horseHealth + " apples until your horse dies!");
                }
                applesound.play();
                apple.kill();
                if ( horseHealth == 0 ){
                    $( "#score" ).text("Final Score: " + score);
                    $( "#horseHealth" ).text("Your horse has died!");
                    game.debug.text('Retry? (Refresh the page)', (game.width/2)-140, game.height/2);
                    game.physics.destroy();
                }
                console.log("horseHealth: " + horseHealth);
            }
        }//apple alive
        else{
            if ( apple_count > 0 ){
                randX = Math.floor(Math.random()*(650-600+1)+600);
                randY = Math.floor(Math.random()*(190-90+1)+90);
                
                console.log("Apple is clear of horse, spawned apple.");
                apple = game.add.sprite(randX, randY, 'apple');
                var appleOnTree = 1;
                var appleSpawnTime = game.time.totalElapsedSeconds();
                game.physics.arcade.enable(apple);
                game.physics.arcade.enableBody(apple);
                apple.body.collideWorldBounds = true;
                game.physics.arcade.collide(player, apple);
                game.physics.arcade.collide(ocean, apple);
            }//apple_count isnt 0
            else {
                console.log("apple count is now zero!");
                game.debug.text('Retry? (Refresh the page)', (game.width/2)-140, game.height/2);
                game.physics.destroy();
            }//apple count is 0
        }//dead apple

        if (cursors.left.isDown)
        {
            if (cursors.up.isDown)
            {
                //  Move to the left+up
                player.body.velocity.x = -speed;
                player.body.velocity.y = -speed;
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
                player.body.velocity.x = -speed;
                player.body.velocity.y = speed;
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
                player.body.velocity.x = -speed*2;
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
                player.body.velocity.x = speed;
                player.body.velocity.y = -speed;
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
                player.body.velocity.x = speed;
                player.body.velocity.y = speed;
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
                player.body.velocity.x = speed*2;
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
            player.body.velocity.y = -speed; 
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
            player.body.velocity.y = speed; 
            if ( foot == 0 ){
               player.frame = 0; 
            }
            if ( foot == 1 ){
               player.frame = 1; 
            }
           
        }




        } //update
    
function render () {

    if (game.scale.isFullScreen)
    {
        game.debug.text('ESC to leave fullscreen', (game.width/2)-140, 60);
    }
    else
    {
        game.debug.text('Click / Tap to go fullscreen', (game.width/2)-140, 16);
    }

}
};
});