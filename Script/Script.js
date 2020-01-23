let tileWidth = 99;
let tileHeight = 99;


function drawBoard() {
    window.objGame = new Game();
    objGame.tiles.forEach((objTile) => {
        let number = randomIntInRange(1, 3);
        $("#divBoard").append(`
            <div class="tile  ${objTile.blocked ? "" : ""}" data-id="${objTile.id}" id="tile_${objTile.id}" style="top:${objTile.y}px;left:${objTile.x}px;height:${tileHeight - 2}px;width:${tileWidth - 2}px;">
                ${objTile.blocked ? `<img src="img/rock${number}.png" class="rockImage" />` : ""}
            </div>
        `);

    });


    [objGame.player1, objGame.player2].forEach(player => {

        $("#divBoard").append(`
            <div class="player-weapon" id="weapon_${player.weapon.id}" style="top:${player.weapon.tile.y}px;left:${player.weapon.tile.x}px;height:${tileHeight}px;width:${tileWidth}px;">
                    <img src="${player.weapon.img}" />
            </div>
            <div class="player" id="player_${player.id}" style="top:${player.tile.y}px;left:${player.tile.x}px;height:${tileHeight}px;width:${tileWidth}px;">
                <div class="item" style="" >
                    <img src="${player.image}" style="height:100%;width:100%;" />
                </div>
            </div>


        `);

        // $(`#player_${player.id}`)[0].onclick = onPlayerClick.bind(null, player)
        // console.log(`#player_${player.id}`, $(`#player_${player.id}`)[0])
    })

    objGame.weapons.forEach(weapon => {
        $("#divBoard").append(`
            <div class="weapon" id="weapon_${weapon.id}" style="top:${weapon.tile.y}px;left:${weapon.tile.x}px;height:${tileHeight}px;width:${tileWidth}px;">
                <img src="${weapon.img}" />
            </div>
        `);

    });

    objGame.nextTurn();
}

function randomIntInRange(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

};

function onPlayerClick(player) {
    
    hideHighlighted();
    player.highlightAdjecents();
    $(".tile-high").each(function(){
        this.onclick = onHighClick.bind(player, this);
    })
}

function onHighClick(tileElement){
    console.log(tileElement)
    let player = this;
    let tile=objGame.findTileById($(tileElement).data("id"));
    player.moveToTile(tile);
    hideHighlighted();
    objGame.nextTurn();
    console.log(player)
}

function hideHighlighted(){
    $(".tile-high").each(function(){
        this.onclick = null;
    })
    $(".tile-high").removeClass("tile-high")
}

drawBoard();