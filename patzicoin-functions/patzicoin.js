/*
    These functions are commonly used in all areas of the bot.
*/
const db = require('../database.js').Patzicoin
const shop = require("../resources/json/items.json")

/**
 * 
 * @param {*} userId 
 * @param {int} coins 
 */
async function changePatzicoins(userId, coins){
    await db.findOrCreate({
        where: { userID: userId },
    });

    await db.increment('coins', { by: coins, where: { userID: userId } });
}

/**
 * 
 * @param {*} userId 
 * @param {int} coins 
 */
async function setPatzicoins(userId, coins) {
    await db.findOrCreate({
        where: { userID: userId },
    });

    await db.update({coins: coins}, {where: {userID: userId}});
}

async function getPatzicoins(userId){
    var dbusr = await db.findOne({ where: { userID: userId } });

    if (!dbusr) {
        return 0
    } else {
        return dbusr.get("coins")
    }
}

/**
 * 
 * @param {*} userId 
 * @param {*} item 
 * @returns 
 */
async function grantItem(userId, item){
    var dbusr = await db.findOne({ where: { userID: userId } });

    if(!dbusr){
        return {"error":"This person doesn't have a Patzicoin database!"};
    }

    var inv = dbusr.get("inv");
    inv = JSON.parse(inv);

    if(inv.includes(item) && !shop[item].canOwnMultiple){
        return {"error":"You can only own one of this item!"};
    }

    for(const item_require in shop[item].requiredItems) {
        if(!inv.includes(shop[item].requiredItems[item_require])) return {"error":"You don't own the required items for this."}
    }

    inv.push(item);
    inv = JSON.stringify(inv);

    await db.update({
        inv: inv
    }, {
        where: { userID: userId },
    });

    return true;
}

/**
 * 
 * @param {*} userId 
 * @param {*} item 
 * @returns 
 */
async function revokeItem(userId, item){
    var dbusr = await db.findOne({ where: { userID: userId } });

    if(!dbusr){return {"error":"This person doesn't have a Patzicoin database!"};}

    var inve = dbusr.get("inv");
    inve = JSON.parse(inve);

    if(inve.includes(item)){
        inve.splice(item, item);
        inve = JSON.stringify(inve);

        db.update({
            inv: inve
        }, {
            where: { userID: userId },
        });

        return;
    } else {
        return {"error":"You do not own this item!"}
    }
}

async function hasItem(userId, item) {
    var dbusr = await db.findOne({ where: { userID: userId } });

    if(!dbusr){return false;}

    var inve = dbusr.get("inv");
    inve = JSON.parse(inve);

    return inve.includes(item);
}

module.exports = {
    changePatzicoins,
    setPatzicoins,
    grantItem,
    revokeItem,
    getPatzicoins,
    hasItem
}