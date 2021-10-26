let game = [];
let boughtLayers;
game.latest = 12;
if (localStorage.getItem("version") != undefined) {
    game.version = Number(localStorage.getItem("version"));
} else {
    game.version = 12;
}
if (localStorage.getItem("achievements") != undefined) {
    game.achievements = JSON.parse(localStorage.getItem("achievements"));
} else {
    game.achievements = [];
}
if (localStorage.getItem("money") != undefined) {
    game.money = ExpantaNum(JSON.parse(localStorage.getItem("money")));
} else {
    game.money = ExpantaNum(1);
}
if (localStorage.getItem("layers") != undefined) {
    game.layers = JSON.parse(localStorage.getItem("layers"));
    for (let i = 0; i < game.layers.length; i++) {
        game.layers[i].cost = ExpantaNum(game.layers[i].cost);
        game.layers[i].count = ExpantaNum(game.layers[i].count);
        game.layers[i].multiplier = ExpantaNum(game.layers[i].multiplier);
    }
} else {
    game.layers = [];
    game.layers[0] = {};
    game.layers[0].count = ExpantaNum(0);
    game.layers[0].cost = ExpantaNum(1);
    game.layers[0].multiplier = ExpantaNum(1);
}
if (localStorage.getItem("boughtLayers") != undefined) {
    boughtLayers = Number(localStorage.getItem("boughtLayers"));
} else {
    boughtLayers = 0;
}
if (localStorage.getItem("layersHTML") != undefined) {
    document.getElementById("layers").innerHTML = localStorage.getItem("layersHTML");
}
if (localStorage.getItem("achievementsHTML") != undefined) {
    document.getElementById("achievements").innerHTML = localStorage.getItem("achievementsHTML");
}
game.interval = 20;
game.overallMultiplier = ExpantaNum(1);
if (game.version < game.latest) {
    document.getElementById("updateBtn").innerText = "Update to v" + game.latest + " from v" + game.version;
} else {
    document.getElementById("updateBtn").disabled = "true";
}
function save() {
    localStorage.setItem("money", JSON.stringify(game.money));
    localStorage.setItem("layers", JSON.stringify(game.layers));
    localStorage.setItem("boughtLayers", boughtLayers.toString());
    localStorage.setItem("layersHTML", document.getElementById("layers").innerHTML);
    localStorage.setItem("achievements", JSON.stringify(game.achievements));
    localStorage.setItem("achievementsHTML", document.getElementById("achievements").innerHTML);
    localStorage.setItem("version", game.version);
}
function run() {
    document.getElementById("money").innerHTML = "$" + simplify(game.money);
    for (let i = 2; i < game.layers.length + 1; i++) {
        game.layers[i - 2].count = game.layers[i - 1].count.mul(ExpantaNum(0.005).mul(game.overallMultiplier)).mul(game.layers[i - 1].multiplier).add(game.layers[i - 2].count);
        document.getElementById("layer" + (i - 1) + "count").innerHTML = simplify(game.layers[i - 2].count);
    }
    for (let i = 0; i < game.layers.length; i++) {
        if (game.money.gte(game.layers[i].cost)) {
            document.getElementById("layer" + (i + 1)).className = "lime";
        } else {
            document.getElementById("layer" + (i + 1)).className = "red";
        }
    }
    game.money = game.money.add(game.layers[0].count.mul(ExpantaNum(0.005).mul(game.overallMultiplier)).mul(game.layers[0].multiplier));
    setTimeout(run, game.interval);
}
function simplify(num, separator, decimal) {
    if (separator === undefined) {
        separator = "<sup>";
    }
    if (decimal === undefined) {
        decimal = 2;
    }
    if (num.abs().gt("10^^10")) {
        return num.toStringWithDecimalPlaces(3);
    } else if (num.abs().gte(1e9)) {
        /* if (num.slog().gt(3)) {
            return ("10" + separator).repeat(num.slog().floor().toNumber() - 1) + ExpantaNum(10).tetr(num.slog().sub(num.slog().floor().sub(1))).toNumber().toLocaleString(undefined, {maximumFractionDigits: decimal, minimumFractionDigits: decimal});
        } else if (num.slog().gt(2) && num.slog().lte(3)) {
            return ExpantaNum(10).pow(num.log10()).div(ExpantaNum(10).pow(num.log10().floor())).mul(10**decimal).floor().div(10**decimal).toFixed(decimal) + " × 10" + separator + num.log10().floor().toNumber().toLocaleString();
        } */
    } else if (num.abs().gte(1e6)) {
        return num.toNumber().toLocaleString(undefined, {maximumFractionDigits: 0});
    } else {
        return num.toNumber().toLocaleString(undefined, {minimumFractionDigits: decimal, maximumFractionDigits: decimal});
    }
}
function maxAll() {
    if (game.money.gt("e1000")) {
        if (confirm("You can afford about " + simplify(game.money.log10().pow(1/1.5).round(), "^", 0) + " layers. This could crash your browser. Are you sure you want to continue?")) {
            for (let i = 0; i < game.layers.length; i++) {
                while (buyLayer(i + 1)) {
                    buyLayer(i + 1);
                }
            }
        }
    } else {
        for (let i = 0; i < game.layers.length; i++) {
            while (buyLayer(i + 1)) {
                buyLayer(i + 1);
            }
        }
    }
}
function prestige() {
    alert("Coming soon!");
}
document.onkeypress = function (e) {
    if (e.key === "m") {
        maxAll();
    }
}
function buyLayer(num) {
    if (game.money.gte(game.layers[num - 1].cost)) {
        game.money = game.money.sub(game.layers[num - 1].cost);
        game.layers[num - 1].count = game.layers[num - 1].count.add(1);
        game.layers[num - 1].cost = game.layers[num - 1].cost.add(1).pow(1.4).sub(1);
        game.layers[num - 1].multiplier = game.layers[num - 1].multiplier.mul(2);
        document.getElementById("layer" + num).innerHTML = "Purchase Layer " + num.toLocaleString() + " for $" + simplify(game.layers[num - 1].cost);
        if (num - 1 === boughtLayers) {
            boughtLayers++;
            game.layers[num] = {};
            game.layers[num].count = ExpantaNum(0);
            game.layers[num].cost = ExpantaNum("10^" + num**1.5);
            game.layers[num].multiplier = ExpantaNum(1);
            document.getElementById("layers").innerHTML = document.getElementById("layers").innerHTML + '<br><button onclick="buyLayer(' + (num + 1) + ');" id="layer' + (num + 1) + '">Purchase Layer ' + (num + 1) + ' for $' + simplify(game.layers[num].cost) + '</button><span id="layer' + (num + 1) + 'count" class="count">0.00</span>';
        }
        return true;
    } else {
        return false;
    }
}
run();
let saveInterval = setInterval(save, 100);