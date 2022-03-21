//stolen from amnh.org/exhibitions/frogs-a-chorus-of-colors/frog-fun-facts

const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require("discord.js")

const responces=[
	`There is evidence that frogs have roamed the Earth for more than 200 million years, at least as long as the dinosaurs.`,
	`The world's largest frog is the goliath frog of West Africa—it can grow to 15 inches and weigh up to 7 pounds. A goliath frog skeleton is featured in Frogs: A Chorus of Colors.`,
	`One of the smallest is the Cuban tree toad, which grows to half an inch long.`,
	`While the life spans of frogs in the wild are unknown, frogs in captivity have been known to live more than 20 years.`,
	`There are over 6,000 species of frogs worldwide. Scientists continue to search for new ones.`,
	`Toads are frogs. The word "toad" is usually used for frogs that have warty and dry skin, as well as shorter hind legs.`,
	`Frogs have excellent night vision and are very sensitive to movement. The bulging eyes of most frogs allow them to see in front, to the sides, and partially behind them. When a frog swallows food, it pulls its eyes down into the roof of its mouth, to help push the food down its throat.`,
	`Frogs were the first land animals with vocal cords. Male frogs have vocal sacs—pouches of skin that fill with air. These balloons resonate sounds like a megaphone, and some frog sounds can be heard from a mile away.`,
	`Launched by their long legs, many frogs can leap more than 20 times their body length.`,
	`The Costa Rican flying tree frog soars from branch to branch with the help of its feet. Webbing between the frog's fingers and toes extends out, helping the frog glide.`,
	`To blend into the environment, the Budgett's frog is muddy brown in color, while the Vietnamese mossy frog has spotty skin and bumps to make them look like little clumps of moss or lichen.`,
	`Many poisonous frogs, such as the golden poison frog and dyeing poison frog, are boldly colored to warn predators of their dangerous toxic skins. Some colorful frogs, such as the Fort Randolph robber frog, have developed the same coloring as a coexisting poisonous species. Although their skins are not toxic, these mimics may gain protection from predators by looking dangerous.`,
	`Like all amphibians, frogs are cold-blooded, meaning their body temperatures change with the temperature of their surroundings. When temperatures drop, some frogs dig burrows underground or in the mud at the bottom of ponds. They hibernate in these burrows until spring, completely still and scarcely breathing.`,
	`The wood frog can live north of the Arctic Circle, surviving for weeks with 65 percent of its body frozen. This frog uses glucose in its blood as a kind of antifreeze that concentrates in its vital organs, protecting them from damage while the rest of the body freezes solid.`,
	`The Australian water-holding frog is a desert dweller that can wait up to seven years for rain. It burrows underground and surrounds itself in a transparent cocoon made of its own shed skin.`,
	`Frogs are freshwater creatures, although some frogs such as the Florida leopard frog are able to live in brackish or nearly completely salt waters.`
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frogfact')
		.setDescription(`Get an amazing frog fact!`),
	async execute(interaction) {
		const fact = Math.floor(Math.random() * responces.length)
		const embed = new MessageEmbed()
            .setTitle(`Frog Fact #${fact+1}`)
            .setDescription(`${responces[fact]}`)
			.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/frog_1f438.png")
        await interaction.reply({embeds: [embed]});
	},
};