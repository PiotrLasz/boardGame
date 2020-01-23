class Game {

    rows = 0;
    cols = 0;
    tiles = [];
    weapons = [];
    player1;
    player2;
    tiles2D = [];
    turn = null;

    constructor() {
        this.createGrid();
        this.createPlayers();
        this.createWeapons();
    }

    nextTurn() {
        if (this.turn == this.player1) {
            this.turn = this.player2;
        }
        else {
            this.turn = this.player1;
        }
        onPlayerClick(this.turn);
    }

    isTileAdjacent(tile1, tile2) {

        let diffRow = Math.abs(tile1.row - tile2.row);
        let difCol = Math.abs(tile1.col - tile2.col);
        return (diffRow <= 1 || difCol <= 1);

    }

    createPlayers() {

        try {

            let player1tileIndex = randomIntInRange(0, this.availableTiles.length - 1);
            let weapon = new Weapon("Default P1", this.availableTiles[player1tileIndex], "img/weapon4.png", 10);
            this.player1 = new Player("Player 1", 100, this.availableTiles[player1tileIndex], weapon, "img/player1.png");
            this.availableTiles.splice(player1tileIndex, 1);

            let player2tileIndex = randomIntInRange(0, this.availableTiles.length - 1);
            //console.log(player1tileIndex,'player1tileIndex', this.player1, player2tileIndex, this.availableTiles.length);
            while (this.isTileAdjacent(this.player1.tile, this.availableTiles[player2tileIndex])) {
                player2tileIndex = randomIntInRange(0, this.availableTiles.length - 1);
            }
            let weapon2 = new Weapon("Default P2", this.availableTiles[player2tileIndex], "img/weapon3.png", 10);
            this.player2 = new Player("Player 2", 100, this.availableTiles[player2tileIndex], weapon2, "img/player2.png");
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

        this.cols = randomIntInRange(7, 12);
        this.rows = randomIntInRange(7, 12);

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
            if (currentTile.blocked|| currentTile.player)
                break;
            adjecents.push(currentTile);
        }

        for (let i = this.row + 1; i <= maxRow; i++) {
            if (!objGame.tiles2D[i] || !objGame.tiles2D[i][this.col])
                continue;
            let currentTile = objGame.tiles2D[i][this.col];
            if (currentTile.blocked|| currentTile.player)
                break;
            adjecents.push(currentTile);
        }

        for (let i = this.col - 1; i >= minCol; i--) {
            if (!objGame.tiles2D[this.row] || !objGame.tiles2D[this.row][i])
                continue;
            let currentTile = objGame.tiles2D[this.row][i];
            if (currentTile.blocked|| currentTile.player)
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
        tile.player = this;
    }

    moveToTile(tile) {
        let oldTile = this.tile;
        let objAnimate = {
            left: tile.x,
            top: tile.y
        };
        $(`#player_${this.id}`).animate(objAnimate);
        // $(`#weapon_${this.weapon.id}`).animate(objAnimate)
        this.weapon.moveToTile(tile)
        
        this.tile.player = null;
        tile.player = this;
        this.tile = tile;
        
        console.log("op",!!oldTile.weapon,!!oldTile.player)
        console.log("new",!!tile.weapon,!!tile.player)
        
        let betweenWeapon = this.isWeaponInBetween(oldTile,tile);
        if(betweenWeapon){
            betweenWeapon.weapon.exchangeWithPlayer(this);
            // betweenWeapon.moveToTile(this.weapon.tile);
            // this.weapon.moveToTile(betweenWeapon)
        }
    }

    isWeaponInBetween(tile1, tile2){
        if(tile1.row > tile2.row || tile1.col > tile2.col){
            let t = tile1;
            tile1= tile2;
            tile2 = t;
        }
        for(let i=tile1.row;i<=tile2.row;i++){
            for(let j=tile1.col;j<=tile2.col;j++){
                let tile = objGame.tiles2D[i][j];
                if(tile.weapon && !tile.player){
                    console.log("match",!!tile.weapon, !!tile.player)
                    return tile;
                }
            }
        }
    }

    highlightAdjecents() {

        this.tile.findAdjecents().forEach(tile => {
            $(`#tile_${tile.id}`).addClass("tile-high");
        })
    }

}

class Weapon {

    constructor(name, tile, img, damage) {
        this.id = Date.now() + randomIntInRange(5000, 5000000);
        this.name = name;
        this.tile = tile;
        this.img = img;
        this.damage = damage;
        tile.weapon = this;

    }

    exchangeWithPlayer(player){
        let $currentWeapon = $(`#weapon_${this.id}`);
        let $playerWeapon = $(`#weapon_${player.weapon.id}`);
        $currentWeapon.animate({
            left: player.tile.x,
            top: player.tile.y
        })
        $currentWeapon.removeClass("weapon").addClass("player-weapon");
        $playerWeapon.removeClass("player-weapon").addClass("weapon");
        $playerWeapon.animate({
            left: this.tile.x,
            top: this.tile.y
        })
        // console.log(player.tile, player.weapon, this, this.tile)
        let currentWeapon = this;
        let playerWeapon = player.weapon;
        let currentWeaponTile = currentWeapon.tile;
        let playerWeaponTile = playerWeapon.tile;
        currentWeapon.tile = playerWeaponTile;
        playerWeapon.tile = currentWeaponTile;
        currentWeaponTile.weapon = playerWeapon;
        playerWeaponTile.weapon = currentWeapon;
    }

    moveToTile(tile){
        let $currentWeapon = $(`#weapon_${this.id}`);
        $currentWeapon.animate({
            left: tile.x,
            top: tile.y
        })
        this.tile.weapon = null;
        tile.weapon = this;
        this.tile = tile;
    }

    togglePlayerWeapon(){
        $(`#weapon_${this.id}`).toggleClass("weapon player-weapon")
    }

}