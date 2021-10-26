game.achievements[0] = new achievement("game.money.gte(10)", undefined, "this is a test", "Have $10", "", "test");
game.achievements[1] = new achievement("game.layers[0].count >= 1", "game.money = game.money.add(5)", "The Beginning", "Buy the first layer", "Reward: +$5")
function outputAchievements() {
    let output = "";
    for (let i = 0; i < game.achievements.length; i++) {
        output += "<p class='achievement bgred' id='ach_" + game.achievements[i].name + "'>" + "<b>" + game.achievements[i].title + "</b><br>" + game.achievements[i].criteriaText + "<br>" + game.achievements[i].rewardText + "</p>";
    }
    document.getElementById("achievements").innerHTML = output;
    return output;
}
outputAchievements();