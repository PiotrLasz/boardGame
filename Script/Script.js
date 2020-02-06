let tileWidth = 99;
let tileHeight = 99;
let isDevEnv = false;

function drawBoard() {
    window.objGame = new Game();

    $("#divBoardArea").css({
        height: (tileHeight * objGame.rows),
        width: (tileWidth * objGame.cols),
        margin: "auto",
    })

    objGame.tiles.forEach((objTile) => {
        let number = randomIntInRange(1, 3);
        $("#divBoard").append(`
            <div class="tile  ${objTile.blocked ? "" : ""}" data-id="${objTile.id}" id="tile_${objTile.id}" style="top:${objTile.y}px;left:${objTile.x}px;height:${tileHeight - 2}px;width:${tileWidth - 2}px;">
                ${objTile.blocked ? `<img src="img/rock${number}.png" class="rockImage" />` : ""}
                ${isDevEnv ? `<div class="tile-name">${objTile.id}</div>` : ""}
            </div>
        `);

    });


    [objGame.player1, objGame.player2].forEach(player => {
        objGame.weapons.push(player.weapon);
        $("#divBoard").append(`
            <div class="player-weapon" id="weapon_${player.weapon.id}" style="top:${player.weapon.tile.y}px;left:${player.weapon.tile.x}px;height:${tileHeight}px;width:${tileWidth}px;">
                    <img src="${player.weapon.img}" />
                    ${isDevEnv ? `<div class="player-weapon-name">${player.weapon.name}</div>` : ""}
            </div>
            <div class="player" id="player_${player.id}" style="top:${player.tile.y}px;left:${player.tile.x}px;height:${tileHeight}px;width:${tileWidth}px;">
                <div class="item" style="" >
                    <img src="${player.image}" style="height:100%;width:100%;" />
                    ${isDevEnv ? `<div class="player-name">${player.name}</div>` : ""}
                </div>
            </div>
        `);

        // $(`#player_${player.id}`)[0].onclick = onPlayerClick.bind(null, player)
        // console.log(`#player_${player.id}`, $(`#player_${player.id}`)[0])
    })

    objGame.weapons.forEach(weapon => {
        if (weapon.player) { // Player's weapon is already handled
            return;
        }
        $("#divBoard").append(`
            <div class="weapon" id="weapon_${weapon.id}" style="top:${weapon.tile.y}px;left:${weapon.tile.x}px;height:${tileHeight}px;width:${tileWidth}px;">
                <img src="${weapon.img}" />
                ${isDevEnv ? `<div class="player-weapon-name">${weapon.name}</div>` : ""}
            </div>
        `);
    });

    objGame.nextTurn();
    // console.log("before ra", objGame.turn)
    reArrangeItems();
}

function reArrangeItems() {
    // Rearrange players
    [objGame.player1, objGame.player2].forEach(player => {
        let $player = $(`#player_${player.id}`);
        let $playerWeapon = $(`#weapon_${player.weapon.id}`);
        $player.animate({
            left: player.tile.x,
            top: player.tile.y
        });

        $playerWeapon.animate({
            left: player.tile.x,
            top: player.tile.y
        });
    })

    objGame.weapons.forEach(weapon => {
        let $weapon = $(`#weapon_${weapon.id}`);
        if (weapon.player) {
            // describe(weapon, "WWW")
            $weapon.removeClass("weapon").addClass("player-weapon");
        }
        else {
            $weapon.removeClass("player-weapon").addClass("weapon");
        }
        $weapon.animate({
            left: weapon.tile.x,
            top: weapon.tile.y
        });
    });

    // console.log("printing player1",objGame.player1)

    $("#divPlayer1Name").text(objGame.player1.name);
    $("#divPlayer1Life").text(objGame.player1.life);
    $("#imgPlayer1").attr("src", objGame.player1.image);
    $("#imgPlayer1Weapon").attr("src", objGame.player1.weapon.img);
    $("#imgPlayer1WeaponCapacity").text(objGame.player1.weapon.damage);

    $("#divPlayer2Name").text(objGame.player2.name);
    $("#divPlayer2Life").text(objGame.player2.life);
    $("#imgPlayer2").attr("src", objGame.player2.image);
    $("#imgPlayer2Weapon").attr("src", objGame.player2.weapon.img);
    $("#imgPlayer2WeaponCapacity").text(objGame.player2.weapon.damage);


    // console.log("turn ",objGame.turn)
    // if (objGame.turn == objGame.player1) {
    //     $("#divPlayer1Status").addClass("status-player-high")
    //     $("#divPlayer2Status").removeClass("status-player-high")
    // }
    // else if (objGame.turn == objGame.player2) {
    //     $("#divPlayer2Status").addClass("status-player-high")
    //     $("#divPlayer1Status").removeClass("status-player-high")
    // }
}


function randomIntInRange(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

};

function onPlayerClick(player) {

    hideHighlighted();
    player.highlightAdjecents();
    $(".tile-high").each(function () {
        this.onclick = onHighClick.bind(player, this);
    })
}

function onHighClick(tileElement) {
    // console.log(tileElement)
    let player = this;
    let tile = objGame.findTileById($(tileElement).data("id"));
    hideHighlighted();
    objGame.nextTurn();
    player.moveToTile(tile);
    // console.log(player)
}

function hideHighlighted() {
    $(".tile-high").each(function () {
        this.onclick = null;
    })
    $(".tile-high").removeClass("tile-high")
}

function describe(obj, tag = "") {
    let str = "Desc: " + tag.toUpperCase() + " ";
    if (obj instanceof Player) {
        str += `Player ${obj.name}, T:${obj.tile.id}, W:${obj.weapon.name} WT:${obj.weapon.tile.id} 
        TW:${obj.tile.weapon && obj.tile.weapon.name} TP:${obj.tile.player && obj.tile.player.name}`;
    }
    else if (obj instanceof Tile) {
        str += `Tile ${obj.id},  W:${obj.weapon && obj.weapon.name} WT:${obj.weapon && obj.weapon.tile.id} 
        TW:${obj.weapon && obj.weapon.name} TP:${obj.player && obj.player.name}`;
    }
    else if (obj instanceof Weapon) {
        str += `Weapon ${obj.name}, WP:${obj.player && obj.player.name}, WT:${obj.tile && obj.tile.id} 
        TW:${obj.tile && obj.tile.weapon && obj.tile.weapon.name} `;
    }
    console.log(str);
}

async function confirmSwal(player) {
    let result = await Swal.fire({
        title: player.name,
        icon: 'info',
        html: `Please choose your action`,
        // showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        allowOutsideClick: false,
        confirmButtonText:
            `Attack`,
        cancelButtonText:
            `Defend`
    });
    if (result.value) {
        return true;
    }
    else {
        return false;
    }
}


drawBoard();