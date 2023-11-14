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
    async grantItem(db, userId, item){
        var dbusr = await db.findOne({ where: { userID: userId } });

        if(!dbusr){
            interaction.reply({content:`⚠ **this person has never earned a singular patzicoin. ever.**`,ephemeral: true});
            return;
        }

        var inve = dbusr.get("inv");
		inve = JSON.parse(inve);

		if(inve.includes(item) && !shp[item].canOwnMultiple){
			return {"error":"You can only own one of this item!"};
		}

		inve.push(item);
		inve = JSON.stringify(inve);

		await db.update({
			inv: inve
		}, {
			where: { userID: userId },
		});
    },

    async revokeItem(db, userId, item){
        var dbusr = await db.findOne({ where: { userID: userId } });

        if(!dbusr){return {"error":"this person has never earned a singular patzicoin. ever."};}

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
        } else {
            return {"error":"You do not own this item!"}
        }
    }
}