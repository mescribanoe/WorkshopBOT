//
// Fallback Command
//
module.exports = function (controller) {

    controller.hears(["(.*)"], 'direct_message,direct_mention', function (bot, message) {
        var mardown = "Lo siento, no te he entendido.<br/>Intenta con "
            + bot.enrichCommand(message, "help");
            
        bot.reply(message, mardown);
    });
}