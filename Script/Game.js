const UP = "UP";
const DOWN = "DOWN";
const RIGHT = "RIGHT";
const LEFT = "LEFT";

class Game {
    rows = 0;
    cols = 0;
    tiles = [];
    weapons = [];
    player1;
    player2;
    tiles2D = [];
    turn = null;
    isFightBegan=false;

    constructor() {
        this.createGrid();
        this.createPlayers();
        this.createWeapons();
    }

    nextTurn() {
        let otherPlayer = this.turn;
        if (this.turn == this.player1) {
            this.turn = this.player2;
        }
        else {
            this.turn = this.player1;
        }


        if(this.isFightBegan){
            console.log("ask to player whom turn is currently going on. ", otherPlayer.name);
            let choice =  this.turn.askToAttackOrDefend();
            this.turn.choice = choice?"A":"D";
            if(choice){ // Player choose to attack
                otherPlayer.attack(this.turn);
            }

            reArrangeItems();

            // this.nextTurn();
        }
        else{
            onPlayerClick(this.turn);
        }
    }

    isTileAdjacent(tile1, tile2) {
        let diffRow = Math.abs(tile1.row - tile2.row);
        let difCol = Math.abs(tile1.col - tile2.col);
        return (diffRow <= 1 || difCol <= 1);

    }

    createPlayers() {
        try {
            let player1tileIndex = randomIntInRange(0, this.availableTiles.length - 1);
            let weapon = new Weapon("Default P1", this.availableTiles[player1tileIndex], "img/weapon4.png", 10, "hasPlayer");
            this.player1 = new Player("Player 1", 100, this.availableTiles[player1tileIndex], weapon, "img/player1.png");
            weapon.player = this.player1;
            this.availableTiles.splice(player1tileIndex, 1);

            let player2tileIndex = randomIntInRange(0, this.availableTiles.length - 1);
            //console.log(player1tileIndex,'player1tileIndex', this.player1, player2tileIndex, this.availableTiles.length);
            while (this.isTileAdjacent(this.player1.tile, this.availableTiles[player2tileIndex])) {
                player2tileIndex = randomIntInRange(0, this.availableTiles.length - 1);
            }
            let weapon2 = new Weapon("Default P2", this.availableTiles[player2tileIndex], "img/weapon3.png", 10, "hasPlayer");
            this.player2 = new Player("Player 2", 100, this.availableTiles[player2tileIndex], weapon2, "img/player2.png");
            weapon2.player = this.player2;
            this.availableTiles.splice(player2tileIndex, 1);
        }

        catch (ex) {
            console.log("error occured while createing players", ex);

        }

    }

    createWeapons() {
        for (let i = 0; i < 2; i++) {
            let index = randomIntInRange(0, this.availableTiles.length - 1);
            //console.log(index,'weap',i, this.availableTiles.length);
            let weapon = new Weapon("Weapon " + i, this.availableTiles[index], `img/weapon${i + 1}.png`, randomIntInRange(11, 40));
            this.weapons.push(weapon);
            this.availableTiles.splice(index, 1);

        }

    }

    createGrid() {
        this.cols = randomIntInRange(8, 8);
        this.rows = randomIntInRange(8, 8);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let objTile = new Tile(i, j, (randomIntInRange(2, 7) == 3));
                this.tiles.push(objTile);
            }
        }

        this.availableTiles = this.tiles.filter(item => !item.blocked);
        this.tiles.forEach(item => {
            if (!this.tiles2D[item.row])
                this.tiles2D[item.row] = []

            this.tiles2D[item.row][item.col] = item;
        });
    }

    findTileById(tileId) {
        return this.tiles.find(tile => tile.id == tileId)
    }


    checkFigntCondition() {
        console.log(this.player1.tile, this.player2.tile)
        let tile1 = this.player1.tile;
        let tile2 = this.player2.tile;
        let isFightCondition = false;
        if (tile1.row == tile2.row) {
            let diff = Math.abs(tile1.col - tile2.col);
            if (diff >= 1) {
                isFightCondition = true;
            }
        }
        else if (tile1.col == tile2.col) {
            let diff = Math.abs(tile1.row - tile2.row);
            if (diff >= 1) {
                isFightCondition = true;
            }
        }

        if (isFightCondition) {
            console.log("now fight");
        }
    }

}

class Tile {

    constructor(row, col, blocked, weapon) {
        this.id = `t${row}${col}`;
        this.row = row;
        this.col = col;
        this.x = col * tileWidth;
        this.y = row * tileHeight;
        this.blocked = blocked;
        this.weapon = weapon;
        this.adjecents = [];

    }

    findAdjecents() {
        let adjecents = [];

        let minRow = this.row - 3 < 0 ? 0 : this.row - 3;
        let maxRow = this.row + 3 >= objGame.rows ? objGame.rows : this.row + 3;
        let minCol = this.col - 3 < 0 ? 0 : this.col - 3;
        let maxCol = this.col + 3 >= objGame.cols ? objGame.cols : this.col + 3;

        for (let i = this.row - 1; i >= minRow; i--) {
            if (!objGame.tiles2D[i] || !objGame.tiles2D[i][this.col])
                continue;
            let currentTile = objGame.tiles2D[i][this.col];
            if (currentTile.blocked || currentTile.player)
                break;
            adjecents.push(currentTile);
        }

        for (let i = this.row + 1; i <= maxRow; i++) {
            if (!objGame.tiles2D[i] || !objGame.tiles2D[i][this.col])
                continue;
            let currentTile = objGame.tiles2D[i][this.col];
            if (currentTile.blocked || currentTile.player)
                break;
            adjecents.push(currentTile);
        }

        for (let i = this.col - 1; i >= minCol; i--) {
            if (!objGame.tiles2D[this.row] || !objGame.tiles2D[this.row][i])
                continue;
            let currentTile = objGame.tiles2D[this.row][i];
            if (currentTile.blocked || currentTile.player)
                break;
            adjecents.push(currentTile);
        }

        for (let i = this.col + 1; i <= maxCol; i++) {
            if (!objGame.tiles2D[this.row] || !objGame.tiles2D[this.row][i])
                continue;
            let currentTile = objGame.tiles2D[this.row][i];
            if (currentTile.blocked || currentTile.player)
                break;
            adjecents.push(currentTile);
        }
        return adjecents;
    }

}

class Player {
    constructor(name, life, tile, weapon, image) {
        this.id = Date.now() + randomIntInRange(5000, 5000000);
        this.name = name;
        this.life = life;
        this.tile = tile;
        this.weapon = weapon;
        this.image = image;
        this.direction = UP;
        tile.player = this;
    }

    moveToTile(tile) {
        let oldTile = this.tile;
        let oldWeapon = this.weapon;

        let foundWeapon = this.isWeaponInBetween(oldTile, tile);
        let newDirection = this.getMoveDirection(oldTile, tile);
        this.changePlayerDirection(newDirection)

        this.tile = tile; // Assign Current tile to current player
        tile.player = this; // Assign current player to current tile. 
        oldTile.player = null; // Because there is no player standing. 


        // Moved Weapon from old tile to new tile.
        let oldWeaponTile = oldWeapon.tile;
        oldWeapon.tile = tile;
        tile.weapon = oldWeapon;
        if (oldWeaponTile.weapon && oldWeaponTile.weapon.id == oldWeapon.id) {
            oldWeaponTile.weapon = null;
        }


        // console.log("weapon found in between. ", !!foundWeapon)
        if (foundWeapon) {
            let foundWeaponOldTile = foundWeapon.tile;
            foundWeaponOldTile.weapon = oldWeapon;
            oldWeapon.tile = foundWeaponOldTile;

            // describe(foundWeaponOldTile, "FWOT ")
            // describe(oldWeapon, "OW ")

            this.weapon = foundWeapon;
            foundWeapon.tile = tile;
            foundWeapon.player = this;
            oldWeapon.player = null;
        }

        // describe(foundWeapon, "Found Weapon")
        // describe(oldTile, "Old Tile")
        // describe(tile, "new Tile")
        // describe(this, "Player")

        reArrangeItems();
        objGame.checkFigntCondition();
    }

    isWeaponInBetween(tile1, tile2) {
        if (tile1.row > tile2.row || tile1.col > tile2.col) {
            let t = tile1;
            tile1 = tile2;
            tile2 = t;
        }
        // console.log(tile1, tile2)
        for (let i = tile1.row; i <= tile2.row; i++) {
            for (let j = tile1.col; j <= tile2.col; j++) {
                let tile = objGame.tiles2D[i][j];
                // console.log(`checking for cell t${i}${j}`, tile.weapon, tile.player)
                if (tile.weapon && !tile.player) {
                    // console.log("match", !!tile.weapon, !!tile.player)
                    return tile.weapon;
                }
            }
        }
    }

    highlightAdjecents() {
        this.tile.findAdjecents().forEach(tile => {
            $(`#tile_${tile.id}`).addClass("tile-high");
        })
    }

    getMoveDirection(fromTile, toTile) {
        if (fromTile.row > toTile.row) {
            return UP;
        }
        else if (fromTile.row < toTile.row) {
            return DOWN;
        }
        else if (fromTile.col > toTile.col) {
            return RIGHT;
        }
        else if (fromTile.col < toTile.col) {
            return LEFT;
        }
    }

    changePlayerDirection(newDirection) {
        this.direction = newDirection;
        switch (newDirection) {
            case UP:
                $(`#player_${this.id}`).css("transform", "rotate(0deg)")
                break;
            case DOWN:
                $(`#player_${this.id}`).css("transform", "rotate(180deg)")
                break;
            case RIGHT:
                $(`#player_${this.id}`).css("transform", "rotate(-90deg)")
                break;
            case LEFT:
                $(`#player_${this.id}`).css("transform", "rotate(90deg)")
                break;
        }
    }

    attack(player) {
        let ourDemagePower = this.weapon.damage;
        let theirDemagePower = player.weapon.damage;
        if (player.choice == "D") {
            player.life -= Math.floor(ourDemagePower / 2);
        }
        else {
            player.life -= ourDemagePower;
        }
    }

    askToAttackOrDefend(){

        return confirm("Attack Yes, Defend NO")
    }

    // defend(player) {
    //     let ourDemagePower = this.weapon.damage;
    //     let theirDemagePower = player.weapon.damage;
    //     // if (player.choice == "D") {
    //     //     player.life -= Math.floor(ourDemagePower / 2);
    //     // }
    //     // else {
    //     //     player.life -= ourDemagePower;
    //     // }
    // }

}

class Weapon {
    constructor(name, tile, img, damage, player = null) {
        this.id = Date.now() + randomIntInRange(5000, 5000000);
        this.name = name;
        this.tile = tile;
        this.img = img;
        this.damage = damage;
        this.player = player;

        if (!player) {
            tile.weapon = this;
        }

    }
}