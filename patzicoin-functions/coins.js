/*
    These functions are commonly used in all areas of the bot.
*/

module.exports = {
    async changePatzicoins(db, userId, coins){
        await db.findOrCreate({
            where: { userID: userId },
        });

        await db.increment('coins', { by: coins, where: { userID: userId } });
    },
    async setPatzicoins(db, userId, coins) {
        await db.findOrCreate({
            where: { userID: userId },
        });

        await db.update({coins: coins}, {where: {userID: userId}});
    },
    async grantItem(userId, item){

    },
    async revokeItem(userId, item){

    }
}