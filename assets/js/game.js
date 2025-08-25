$(function() {
    console.log("%c  ~~~  Bob v0.5 - Developed by d4rkd0s & d3mn5pwn ~~~  ", "color: #FFFFFF; font-size: 12px; background: #3F1338;");
    var game = new Phaser.Game(1156, 650, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
    var countdown;
    var timerEvent;
    var appleLoop;
    var appleDelay = 3000;
    var bushes;
    var bushsound;
    var healthbar;
    var healthbarWidth;
    var horseMaxHealth;
    var prevHorseHealth;

    function preload() {
        //setting up starting vars
        max_apple_count = 100;
        score = 0;
        hoof = 0;
        horseMaxHealth = 10;
        horseHealth = horseMaxHealth;
        game.appleOnTree = 1;
        speed = 250;
        speedBonus = 0;
        game.appleSpawnTime = game.time.totalElapsedSeconds();
        //game.load.image('bob', 'assets/images/bob.png');
        game.load.spritesheet('bob', 'assets/images/bob.png', 54, 80);
        console.log("%c   loaded: spritesheet   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('apple', 'assets/images/apple_red.png');
        game.load.image('goldenApple', 'assets/images/apple_yellow.png');
        game.load.image('tree', 'assets/images/tree.png');
        game.load.image('sun', 'assets/images/sun.png');
        game.load.image('background', 'assets/images/background.png');
        game.load.image('bush', 'assets/images/bush.png');
        console.log("%c   loaded: bush   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        console.log("%c   loaded: background   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('healthbar', 'assets/images/healthbar.png');
        console.log("%c   loaded: healthbar   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.image('ocean', 'assets/images/ocean.png');
        console.log("%c   loaded: horse   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.spritesheet('horse', 'assets/images/horse.png', 154, 113);
        console.log("%c   set border: ocean   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        cursors = game.input.keyboard.createCursorKeys();
        console.log("%c   user input: enabled   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
        game.load.audio('applesound', 'assets/sounds/apple.wav');
        game.load.audio('bobsound', 'assets/sounds/bob.wav');
        game.load.audio('bushsound', 'assets/sounds/bob.wav');
        // game.load.audio('goldenapplesound', 'assets/sounds/golden.wav'); // TODO: add golden apple sound

        // Walking case switch / coroutine
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

        var horseclock = coroutine(function*(_) {
            while (true) {
                yield _;
                hoof = 0;
                yield _;
                hoof = 1;
                yield _;
                hoof = 2;
            }
        });

        var appleTick = coroutine(function*(_) {
            while (true) {
                yield _;
                flingApple();
            }
        });

        //walk step speed in ms
        setInterval(clock, 100);
        //spawn apple in ms using Phaser timer
        appleLoop = game.time.events.loop(appleDelay, appleTick, this);
        //notify user (console)
        console.log("%c   walking: enabled   ", "color: #FFFFFF; font-size: 10px; background: #5CA6FF;");
    }//preload

    function create() {

        //  A simple background for our game
        game.add.sprite(0, 0, 'background');
        console.log("%c   spawned: background   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");
        //Game Objects

        apple = game.add.sprite(100, 200, 'apple');
        var appleSpawnTime = game.time.totalElapsedSeconds();
        // Stretch to fill
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        healthbar = game.add.sprite(0, 0, 'healthbar');
        healthbar.fixedToCamera = true;
        healthbar.cropEnabled = true;
        healthbarWidth = healthbar.width;
        healthbar.crop.width = healthbarWidth;
        healthbar.updateCrop();
        prevHorseHealth = horseHealth;

        //text = "Score: " . score;
        //style = { font: "32px Arial", fill: "#3D4185", align: "center" };
        //game.add.text(game.world.centerX-300, 0, text, style);
        //sound
        applesound = game.add.audio('applesound');
        applesound.allowMultiple = true;

        bobsound = game.add.audio('bobsound');
        bobsound.allowMultiple = true;

        bushsound = game.add.audio('bushsound');
        bushsound.allowMultiple = true;

        bushes = game.add.group();
        bushes.enableBody = true;
        for (var i = 0; i < 5; i++) {
            var randX = game.rnd.integerInRange(50, game.world.width - 100);
            var randY = game.rnd.integerInRange(50, game.world.height - 100);
            var bush = bushes.create(randX, randY, 'bush');
            bush.body.immovable = true;
        }

        // goldenapplesound = game.add.audio('goldenapplesound'); // TODO: add golden apple sound

        ocean = game.add.sprite(0, game.world.height - 484, 'ocean');
        tree = game.add.sprite(450, 30, 'tree');
        console.log("%c   spawned: border(ocean)   ", "color: #FFFFFF; font-size: 10px; background: #FCD22F;");

        //add horse
        horse = game.add.sprite(450, game.world.height - 300, 'horse');

        //add sun
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
        game.physics.arcade.enable(bushes);
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

        // game.scale.enterFullScreen.add(onEnterFullScreen, this);
        // game.scale.leaveFullScreen.add(onLeaveFullScreen, this);
        //
        // game.input.onDown.add(gofull, this);

        //prime that apple
        apple.kill();
        countdown = 60;
        $('#timer').text('Time: ' + countdown);
        timerEvent = game.time.events.loop(Phaser.Timer.SECOND, updateCountdown, this);
    }//create

    function onEnterFullScreen() {

        //do anything you want

    }

    function onLeaveFullScreen() {

        //do anything you want

    }

    function updateCountdown() {
        countdown--;
        $('#timer').text('Time: ' + countdown);
        if (countdown <= 0) {
            game.time.events.remove(timerEvent);
            levelEnd(score, horseHealth);
        }
    }

    function gofull() {

        game.scale.startFullScreen();

    }

    function levelEnd(scoreEnd, horseHealthEnd) {
        console.log("apple count is now zero!");
        game.debug.text('Retry? (Refresh the page)', (game.width/2)-140, game.height/2);
        game.physics.destroy();
    }

    function flingApple() {
        if ( game.appleOnTree == '1' ) {
            //set the apple to be off the tree
            game.appleOnTree = 0;
            //simply move it down (for now)
            apple.allowGravity = true;
            apple.body.velocity.y = 50;
        }
    }

    function bushCollide() {
        if (bushsound) {
            bushsound.play();
        }
    }

    function update() {

        // adjust apple spawn timer based on score
        var newDelay = Math.max(3000 - score * 50, 1000);
        if (newDelay !== appleDelay) {
            appleDelay = newDelay;
            game.time.events.remove(appleLoop);
            appleLoop = game.time.events.loop(appleDelay, appleTick, this);
        }

        var curTime = game.time.totalElapsedSeconds();
        apple.bringToTop();
        healthbar.bringToTop();
        //ocean collision
        game.physics.arcade.collide(player, ocean);
        game.physics.arcade.collide(player, horse);
        game.physics.arcade.collide(horse, ocean);
        game.physics.arcade.collide(player, bushes, bushCollide, null, this);
        game.physics.arcade.collide(horse, bushes, bushCollide, null, this);
        //horse.body.accelerateToObject(horse, player, 600, 250, 250);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        //bob faster as he scores
        speed = 200+(10*score)+speedBonus;

        //move mr.horse
        if ( game.appleOnTree != 1 )
        {
            horse.velocity = game.physics.arcade.accelerateToObject(horse, apple, 50+(score*5), 50+(score*5), 50+(score*5));
            if ( hoof == 0 ){
                horse.frame = 1;
            }
            if ( hoof == 1 ){
                horse.frame = 2;
            }
            if ( hoof == 2 ){
                horse.frame = 3;
            }
        }

        if ( player.y < 250 ) {
            tree.bringToTop();
            apple.bringToTop();
        } else{
            player.bringToTop();
        }

        if ( apple.alive == true){
            if ( game.appleSpawnTime+3 < curTime && game.appleOnTree == 1 ){
                game.appleOnTree = 0;
                console.log("Apple ready to fling!");
            }
            if ( game.physics.arcade.overlap(apple, player) == true && game.appleOnTree == 0 ){
                if ( apple.key === 'goldenApple' ){
                    score = score + 5;
                    speedBonus = 200;
                    // TODO: play golden apple sound
                    // TODO: add golden apple visual effect
                    game.time.events.add(Phaser.Timer.SECOND * 5, function(){
                        speedBonus = 0;
                    }, this);
                }
                else{
                    score = score + 1;
                    bobsound.play();
                }
                $( "#score" ).text("Score: " + score);
                apple.kill();
                console.log("Score: " + score);
            }
            if ( game.physics.arcade.collide(apple, horse) == true && game.appleOnTree == 0 ){
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
        } else{
            if ( max_apple_count > 0 ){
                // apple count is 0
                randX = Math.floor(Math.random()*(650-600+1)+600);
                randY = Math.floor(Math.random()*(190-90+1)+90);

                console.log("Apple is clear of horse, spawning apple.");
                var isGoldenApple = Math.random() < 0.1;
                var appleType = isGoldenApple ? 'goldenApple' : 'apple';
                apple = game.add.sprite(randX, randY, appleType);
                max_apple_count = max_apple_count - 1;
                game.appleOnTree = 1;
                game.appleSpawnTime = game.time.totalElapsedSeconds();
                console.log(game.appleSpawnTime);
                game.physics.arcade.enable(apple);
                game.physics.arcade.enableBody(apple);
                apple.body.collideWorldBounds = true;
                game.physics.arcade.collide(player, apple);
                game.physics.arcade.collide(ocean, apple);
            } else {
                //max_apple_count isnt 0
                levelEnd(game.score, game.horseHealth);
            }
        }

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

        if (horseHealth !== prevHorseHealth) {
            healthbar.crop.width = (horseHealth / horseMaxHealth) * healthbarWidth;
            healthbar.updateCrop();
            prevHorseHealth = horseHealth;
        }

    } //update

    function render () {

        // Removed fullscreen message
        // if (game.scale.isFullScreen)
        // {
        //     game.debug.text('ESC to leave fullscreen', (game.width/2)-140, 60);
        // }
        // else
        // {
        //     game.debug.text('Click / Tap to go fullscreen', (game.width/2)-140, 16);
        // }

    }

});