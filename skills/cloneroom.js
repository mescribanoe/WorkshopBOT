module.exports = function (controller) {
    controller.hears(["espacio"], 'direct_message,direct_mention', function (bot, message) {
                var email = message.user;
                var CiscoSpark = require('node-ciscospark');
                var async = require('async');
                var spark = new CiscoSpark(process.env.SPARK_TOKEN);
        
                bot.startConversation(message, function (err, convo) {
                    var question = "¿Qué nombre ponemos al nuevo espacio?";
                    convo.ask(question, [
                      {
                            default: true,
                            callback: function (response, convo) {
                                var membershipParameters = {"roomId": message.channel };
                                var roomName = response.text;
                                convo.say("Creando el espacio " + "**"+response.text +"**...");
                            async.waterfall([
                                   function (callback){
                                      spark.rooms.create({"title": roomName}, function(err, response) {
                                          if(err)
                                          {
                                              convo.say("Lo siento mucho, hubo un error al crear el nuevo espacio. Por favor, contacta con el administrador.");
                                              convo.next(); 
                                            }
                                          else{
                                        var responseObj = JSON.parse(response);
                                        callback(null, responseObj.id);
                                          }
                                    });
                                    },
                                  function (roomId, callback){
                                        spark.memberships.list(membershipParameters, function(err, response) {
                                            if(err)
                                            {
                                              convo.say("Lo siento mucho, hubo un error al crear el nuevo espacio. Por favor, contacta con el administrador.");
                                              convo.next();
                                             }
                                          else{
                                        callback(null, response, roomId);
                                          }
                                    });
                                    },
                                  function (response, roomId, callback){
                                     var responseObj = JSON.parse(response);
                                     if(responseObj.items.length > 0){
                                       responseObj.items.forEach(function(element) {
                                         var param = {"teamId": roomId, "roomId" : roomId, "personEmail" : element.personEmail, "isModerator" : element.isModerator };
                                         spark.memberships.create(param, function(err, response){
                                            console.log(err);   });
                                        });
                                        convo.say("Ya he creado el espacio. Puedes ir a verlo.");
                                        convo.next();
                                     }
                                     else{
                                        convo.say("Lo siento mucho, hubo un error al crear el nuevo espacio. Por favor, contacta con el administrador.");
                                        convo.next();
                                      }
                                    }
                                ]);
                        }
                    }
                    ]);
                });
            });
        }