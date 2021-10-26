class achievement {
    constructor(criteria, reward, title, criteriaText, rewardText, name, variable) {
        this.unlocked = false;
        this.title = title;
        this.criteriaText = criteriaText;
        this.rewardText = rewardText;
        this.name = name;
        eval("this.func = () => {if (" + variable + " !== undefined) {if (" + criteria + " && !this.unlocked) {" + reward + "; this.unlocked = true; document.getElementById('ach_' + this.name).className = 'achievement bglime'}}}");
        setInterval(this.func, 20);
    }
}
if (localStorage.getItem("achievements") == undefined) {
    game.achievements[0] = new achievement("game.money.gte(10)", undefined, "First Cash", "Have $10", "No Reward", "money10", "game.money");
    game.achievements[1] = new achievement("game.layers[0].count >= 1", "game.money = game.money.add(5)", "The Beginning", "Buy the first layer", "+$5", "firstLayer", "game.layers[0]");
    game.achievements[2] = new achievement("game.layers[1].count >= 1", "game.layers[0].count = game.layers[0].count.add(10)", "Exponential Production", "Buy the second layer", "+10 first layers", "secondLayer", "game.layers[1]");
    game.achievements[3] = new achievement("game.layers[2].count >= 1", undefined, "Progress", "Buy the third layer", "No Reward", "thirdLayer", "game.layers[2]");
}
function outputAchievements() {
    let output = "";
    for (let i = 0; i < game.achievements.length; i++) {
        output += "<p class='achievement bgred' id='ach_" + game.achievements[i].name + "'>" + "<b>" + game.achievements[i].title + "</b><br>" + game.achievements[i].criteriaText + "<br>Reward: " + game.achievements[i].rewardText + "</p>";
    }
    document.getElementById("achievements").innerHTML = output;
    return output;
}
if (localStorage.getItem("achievementsHTML") == undefined) {
    outputAchievements();
}