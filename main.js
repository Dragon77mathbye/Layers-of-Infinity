// import ExpantaNum from "ExpantaNum.js";

let game = [];
let boughtLayers = 0;
game.money = ExpantaNum(1);
game.layers = [];
game.interval = 20;
game.layers[0] = {};
game.layers[0].count = ExpantaNum(0);
game.layers[0].cost = ExpantaNum(1);
game.layers[0].multiplier = ExpantaNum(1);
game.overallMultiplier = ExpantaNum(1);
function save() {
    localStorage.setItem("money", JSON.stringify(game.money));
    localStorage.setItem("layers", JSON.stringify(game.layers));
}
function run() {
    document.getElementById("money").innerHTML = "$" + simplify(game.money);
    /* if ((game.money.log10().pow(1/1.5).round().add(1).sub(boughtLayers)).greaterThanOrEqualTo(1)) {
        document.getElementById("maxAllBtn").innerText = "Max All (+" + simplify(game.money.log10().pow(1/1.5).round().add(1).sub(boughtLayers), "^", 0) + " layers)";
    } else {
        document.getElementById("maxAllBtn").innerText = "Max All (+0 layers)";
    } */
    for (let i = 2; i < game.layers.length + 1; i++) {
        game.layers[i - 2].count = game.layers[i - 1].count.mul(ExpantaNum(0.005).mul(game.overallMultiplier)).mul(game.layers[i - 1].multiplier).add(game.layers[i - 2].count);
        document.getElementById("layer" + (i - 1) + "count").innerHTML = simplify(game.layers[i - 2].count);
    }
    for (let i = 0; i < game.layers.length; i++) {
        if (game.money.greaterThanOrEqualTo(game.layers[i].cost)) {
            document.getElementById("layer" + (i + 1)).className = "lime";
        } else {
            document.getElementById("layer" + (i + 1)).className = "red";
        }
    }
    game.money = game.money.add(game.layers[0].count.mul(ExpantaNum(0.005).mul(game.overallMultiplier)).mul(game.layers[0].multiplier));
    setTimeout(run, game.interval);
    save();
}
function simplify(num, separator, decimal) {
    if (separator === undefined) {
        separator = "<sup>";
    }
    if (decimal === undefined) {
        decimal = 2;
    }
    if (num.abs().greaterThan("10^^10")) {
        return num.toStringWithDecimalPlaces(3);
    } else if (num.abs().greaterThanOrEqualTo(2**53)) {
        if (num.slog().greaterThan(3)) {
            return ("10" + separator).repeat(num.slog().floor().toNumber() - 1) + ExpantaNum(10).tetr(num.slog().sub(num.slog().floor().sub(1))).toNumber().toLocaleString(undefined, {maximumFractionDigits: decimal, minimumFractionDigits: decimal});
        } else if (num.slog().greaterThan(2) && num.slog().lessThanOrEqualTo(3)) {
            return ExpantaNum(10).pow(num.log10()).div(ExpantaNum(10).pow(num.log10().floor())).toFixed(decimal) + " × 10" + separator + num.log10().floor().toNumber().toLocaleString();
        }
    } else if (num.abs().greaterThanOrEqualTo(1e6)) {
        return num.toNumber().toLocaleString(undefined, {maximumFractionDigits: 0});
    } else {
        return num.toNumber().toLocaleString(undefined, {minimumFractionDigits: decimal, maximumFractionDigits: decimal});
    }
}
function maxAll() {
    if (game.money.greaterThan("e1000")) {
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
    if (game.money.greaterThanOrEqualTo(game.layers[num - 1].cost)) {
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
            document.getElementById("totalLayerCount").innerText = boughtLayers + " layers total";
        }
        return true;
    } else {
        return false;
    }
}
run();