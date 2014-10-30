/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//debug global
debug=0;

//test si chrome
var isMobile = true;
if (window.chrome)
	isMobile = false;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      /*  var el = document.getElementById("chargement"); 
        el.addEventListener('clic', this.getlssfile, false);*/
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
onDeviceReady: function() {
    app.receivedEvent('deviceready');
    hide_div('blocinit');

    if(isMobile)
    {
    	//gestion GPS
	/*    var onSuccessGPS = function(position) {
	       /* alert('Latitude: '        + position.coords.latitude          + '\n' +
	              'Longitude: '         + position.coords.longitude         + '\n' +
	              'Altitude: '          + position.coords.altitude          + '\n' +
	              'Accuracy: '          + position.coords.accuracy          + '\n' +
	              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	              'Heading: '           + position.coords.heading           + '\n' +
	              'Speed: '             + position.coords.speed             + '\n' +
	              'Timestamp: '         + position.timestamp                + '\n');
	    };
	    var onErrorGPS = function(error) {
	        alert('code: '    + error.code    + '\n' +
	              'message: ' + error.message + '\n');
	    };
	    navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS);
        */
    }
    /*
    var now                  = new Date().getTime(),
    _60_seconds_from_now = new Date(now + 60*1000);
    
    if(isMobile)
    {
	    window.plugin.notification.local.add({
	                                         id:      99999,
	                                         title:   'Application de Suivi',
	                                         message: 'test android Merci de répondre au questionnaire de l application de suivi.',
	                                         date:    _60_seconds_from_now
	                                         });
    }
    */

    // https://github.com/brodysoft/Cordova-SQLitePlugin
    if(isMobile)
    	app.db = window.sqlitePlugin.openDatabase("MCENVDatabase", "1.0", "MCENVDemo", -1);
    else
    	app.db = openDatabase("MCENVDatabase", "1.0", "MCENVDemo", -1);
    
    app.db.transaction(function(tx) {                       
                        //table questionnaire
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "questionnaires" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "uidquestionnaire" VARCHAR, "titre" VARCHAR);'); 
                        //tx.executeSql('DROP TABLE IF EXISTS "questionnaires"');
                        tx.executeSql('SELECT * FROM "questionnaires"', [], function(tx, res) {
                        	var dataset = res.rows.length;
                            if(dataset>0)
                            {
                            		for(var i=0;i<dataset;i++)
                                    {
                                		if (debug)
                                			alert(res.rows.item(i).uidquestionnaire+" ligne "+res.rows.item(i).id+" en cours \ndeb :"+res.rows.item(i).tsdebut+" \nfin : "+res.rows.item(i).fin+"\ntimestamp "+timestamp);
                                		$('body').removeClass('none');
                                		//$('body.home .question').html("Vous avez un questionnaire à remplir");
                                		$('body.home #home').html('<div class="question" qid="'+res.rows.item(i).uidquestionnaire+'">'+res.rows.item(i).titre+'</div>');                			
                                		
                                    }
                            		$('body.home .question').click(function(){
                            			isHomeActive = false;
                          			  //TODO switch ismobile pour test locaux seulement sinon fonctionnement normal
                            			$('body.home #opensurvey #idsurvey').attr('value',$(this).attr('qid'));
                            			if(!isMobile)
                          			  		openFakeStudy(xmlquotidien, onLssLoaded);
                            			else
	                          			  	$('body.home #opensurvey #buttonopensurvey').click();
                            			session_encours =  Math.round(new Date().getTime() / 1000);
                            			getTemplate('.contenu',0);
                            		});
                            }
                            else
                            {
                            	$('body').addClass('none');
                            	$('body.home #home').html(' <div class="question">Vous n\'avez pas de questionnaire à remplir</div>');
                            	if (debug)
                            		alert("aucun questionnaire en cours\ntimestamp "+timestamp);
                            }
                        }); 
                        //creation table réponses
                        tx.executeSql('CREATE TABLE IF NOT EXISTS "reponses" ("id" INTEGER PRIMARY KEY AUTOINCREMENT , "idhoraire" INTEGER DEFAULT (0), "sid" VARCHAR, "gid" VARCHAR, "qid" VARCHAR, "code" VARCHAR, "tsreponse" INTEGER, "envoi" BOOLEAN not null default 0);');

                      
    	});
    setTimeout(function() {if(isHomeActive){app.reload();}}, 10000);
},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    getlssfile: function() {
        //navigator.geolocation.getCurrentPosition(onSuccess, onError);
    console.log('x');
        var xhReq = new XMLHttpRequest();
      
       // var urldata = "http://openrad.agoralogie.fr/post.php?mesure=123"+123.innerHTML+"&lat="+lastlat+"&long="+lastlong;
        var urldata = "http://mcp.ocd-dbs-france.org/lss/lss_934317";
        
        xhReq.open("GET", urldata, false);
        xhReq.send(null);
        var serverResponse = xhReq.responseText; 
        console.log(serverResponse);
    },
    
    reload: function(){
	console.log('app.reload');
	$('body').addClass('home');
	app.db.transaction(function(tx) {                   
                        var timestamp = Math.round(new Date().getTime() / 1000);
                        console.log(timestamp);
			//Session en cours?
                        tx.executeSql('SELECT * FROM "questionnaires"', [], function(tx, res) {
                        	var dataset = res.rows.length;
                            if(dataset>0)
                            {
                            		for(var i=0;i<dataset;i++)
                                    {
                                		if (debug)
                                			alert(res.rows.item(i).uidquestionnaire+" ligne "+res.rows.item(i).id+" en cours \ndeb :"+res.rows.item(i).tsdebut+" \nfin : "+res.rows.item(i).fin+"\ntimestamp "+timestamp);
                                		$('body').removeClass('none');
                                		//$('body.home .question').html("Vous avez un questionnaire à remplir");
                                		$('body.home #home').html('<div class="question" qid="'+res.rows.item(i).uidquestionnaire+'">'+res.rows.item(i).titre+'</div>');                			
                                		
                                    }
                            		$('body.home .question').click(function(){
                            			isHomeActive = false;
                          			  //TODO switch ismobile pour test locaux seulement sinon fonctionnement normal
                            			$('body.home #opensurvey #idsurvey').attr('value',$(this).attr('qid'));
                            			if(!isMobile)
                          			  		openFakeStudy(xmlquotidien, onLssLoaded);
                            			else
	                          			  	$('body.home #opensurvey #buttonopensurvey').click();
                            			session_encours =  Math.round(new Date().getTime() / 1000);
                            			getTemplate('.contenu',0);
                            		});
                            }
                            else
                            {
                            	$('body').addClass('none');
                            	$('body.home #home').html(' <div class="question">Vous n\'avez pas de questionnaire à remplir</div>');
                            	if (debug)
                            		alert("aucun questionnaire en cours\ntimestamp "+timestamp);
                            }
                        }); 
                        
			
			//Envoi réponses si existent
			sendReponses();
			setTimeout(function() {if(isHomeActive){app.reload();}}, 10000);
    	});   	
    }
    
};

function getSurveyConfig()
{
	var config = {};
	var strSurveyConfig = surveys_languagesettings[0].surveyls_description;
	//alert(surveys_languagesettings[0].surveyls_description);
	var line = strSurveyConfig.split("#");
	for (var linekey in line)
	{
		line2 = line[linekey].split(":");
		if (line2[0]!= "")
		{
			line20=line2[0];
			line21=line2[1];
			config[line20] = line21;
		}
	}
	return config;
}

function getQuestionConfig(question)
{
	var config = {};
	var strSurveyConfig = question.help;
	//alert(surveys_languagesettings[0].surveyls_description);
	if (strSurveyConfig)
	{
		var line = strSurveyConfig.split("#");
		for (var linekey in line)
		{
			line2 = line[linekey].split(":");
			if (line2[0]!= "")
			{
				line20=line2[0];
				line21=line2[1];
				config[line20] = line21;
			}
		}
	}
	return config;
}


function RazQuestionnaire()
{
	app.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM "questionnaires";');
	});
}

function RazReponse()
{
	app.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM "reponses";');
	});
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function sendReponsesOld()
{debug=0;
	var aReponses ={};
	app.db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM "horaires" WHERE fait = 1;', [], function(tx, resHoraires) {
			var dataset = resHoraires.rows.length;
			console.log(resHoraires);
            if(dataset>0)
            {     	
            	if (debug)
            		alert("session à  envoi");
            	for(var i=0;i<dataset;i++)
                {        
            		tx.executeSql('SELECT * FROM "reponses" WHERE envoi = 0  AND idhoraire = '+resHoraires.rows.item(i).id+';', [], function(tx, res2) {
            			var dataset2 = res2.rows.length;
                        if(dataset2>0)
                        {
                        	saveResHorairesID = res2.rows.item(0).idhoraire;
                        	aReponses["sid"] = res2.rows.item(0).sid;
                        	aReponses["timestamp"] = res2.rows.item(0).tsreponse;
                        	if (debug)
                        		alert("reponse à  envoi");
                        	for(var j=0;j<dataset2;j++)
                            {
                        		/*if (debug) 
                        			alert(res2.rows.item(j).sid);*/
                                var jsonkey = res2.rows.item(j).sid +"X"+res2.rows.item(j).gid+"X"+res2.rows.item(j).qid;
                        		aReponses[jsonkey]=res2.rows.item(j).code;
                            }
                        	if (debug)
                        		alert("essai envoi"+JSON.stringify(aReponses));
                        	xhr_object = new XMLHttpRequest(); 
                        	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/mobilerpc.php?answer="+JSON.stringify(aReponses), false); 
                        	xhr_object.send(null); 
                        	console.log("send rep");
                        	console.log(xhr_object);
                        	console.log(JSON.stringify(aReponses));
                        	if(xhr_object.readyState == 4) 
                        	{
                        		/*if(!isMobile) 
                        			alert("Requête effectuée !"); */
                        		if(xhr_object.response == "1") 
                        			{
                        			tx.executeSql('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			console.log('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			if (debug)
                        				alert('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			}
                        	}
                        	
                        }
            			
            		});
            		
                }
            }
		});
	});
}


function saveQuestionnaire(firstTime) {
	app.db.transaction(function(tx) {
		var sid = surveys[0].sid;
		var qtitre = surveys_languagesettings[0].surveyls_title;
		tx.executeSql('select count("id") as cnt from "questionnaires" WHERE uidquestionnaire = '+sid+';', [], function(tx, res) {
			if (res.rows.item(0).cnt < 1)
			{
				tx.executeSql('INSERT INTO "questionnaires" (uidquestionnaire,titre) VALUES("'+sid+'","'+qtitre+'");',[],function(tx, res) {
					if (isMobile)
					{
					navigator.notification.alert(
				            'Questionnaire enregistré',  // message
				            alertDismissed,         // callback
				            'Multicollect',            // title
				            'Ok'                  // buttonName
				        );
					}
					else
						{alert("Questionnaire enregistré");}
				}); 
			}
			});
	});
}

function saveUser(){
	if ($('#userform #userid').val() != "")
	{	
		try 
		{
			if (isMobile)
				var deviceID = md5(device.uuid);
			else
				var deviceID = "monDeviceUid";
			xhr_object = new XMLHttpRequest(); 
	    	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/save_user.php?duid="+deviceID+"&id="+encodeURI($('#userform #userid').val()), false); 
	    	xhr_object.send(); 
	    	console.log("send user");
	    	console.log(xhr_object);
	    	console.log($('#userform #userid').val());
	    	if(xhr_object.readyState == 4) 
	    	{
	    		if(xhr_object.response == "1") 
	    		{
	    			if (isMobile)
	    			{
	    			navigator.notification.alert(
	    		            'Votre identifiant a été enregistré.',  // message
	    		            alertDismissed,         // callback
	    		            'Multicollect',            // title
	    		            'Ok'                  // buttonName
	    		        );
	    			}
	    			else
	    				{alert("Votre identifiant a été enregistré.");}
	    		}
	    		else
	    		{
	    			if (isMobile)
						{
						navigator.notification.alert(
					            'Veuillez réessayer ultérieurement.',  // message
					            alertDismissed,         // callback
					            'Multicollect',            // title
					            'Ok'                  // buttonName
					        );
						}
						else
							{alert("Veuillez réessayer ultérieurement.");}
	    		}
	    	}
	    	else
	    	{
	    		if (isMobile)
				{
				navigator.notification.alert(
			            'Veuillez réessayer ultérieurement.',  // message
			            alertDismissed,         // callback
			            'Multicollect',            // title
			            'Ok'                  // buttonName
			        );
				}
				else
					{alert("Veuillez réessayer ultérieurement.");}
	    	}
        } catch(e) {
        	if (isMobile)
			{
			navigator.notification.alert(
		            'Veuillez réessayer ultérieurement.',  // message
		            alertDismissed,         // callback
		            'Multicollect',            // title
		            'Ok'                  // buttonName
		        );
			}
			else
				{alert("Veuillez réessayer ultérieurement.");}
        }
	}

}

function sendReponses()
{debug=0;
	var aReponses ={};
	app.db.transaction(function(tx) {
		tx.executeSql('SELECT DISTINCT "idhoraire" FROM "reponses" WHERE envoi = 0 ;', [], function(tx, resHoraires) {
			var dataset = resHoraires.rows.length;
			/*console.log('horaire');
			console.log(resHoraires);
			console.log(resHoraires.rows.item(0));*/
            if(dataset>0)
            {     	
            	if (debug)
            		alert("session à  envoi");
            	for(var i=0;i<dataset;i++)
                {        
            		tx.executeSql('SELECT * FROM "reponses" WHERE envoi = 0  AND idhoraire = '+resHoraires.rows.item(i).idhoraire+';', [], function(tx, res2) {
            			var dataset2 = res2.rows.length;
            			//console.log('ici');
                        if(dataset2>0)
                        {
                        	saveResHorairesID = res2.rows.item(0).idhoraire;
                        	aReponses["sid"] = res2.rows.item(0).sid;
                        	aReponses["timestamp"] = res2.rows.item(0).tsreponse;
                        	if (debug)
                        		alert("reponse à  envoi");
                        	for(var j=0;j<dataset2;j++)
                            {
                        		/*if (debug) 
                        			alert(res2.rows.item(j).sid);*/
                                var jsonkey = res2.rows.item(j).sid +"X"+res2.rows.item(j).gid+"X"+res2.rows.item(j).qid;
                        		aReponses[jsonkey]=res2.rows.item(j).code;
                            }
                        	if (debug)
                        		alert("essai envoi"+JSON.stringify(aReponses));
                        	xhr_object = new XMLHttpRequest(); 
                        	xhr_object.open("GET", "http://mcp.ocd-dbs-france.org/mobile/mobilerpc.php?answer="+JSON.stringify(aReponses), false); 
                        	xhr_object.send(null); 
                        	console.log("send rep");
                        	console.log(xhr_object);
                        	console.log(JSON.stringify(aReponses));
                        	if(xhr_object.readyState == 4) 
                        	{
                        		/*if(!isMobile) 
                        			alert("Requête effectuée !"); */
                        		if(xhr_object.response == "1") 
                        			{
                        			tx.executeSql('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			console.log('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			if (debug)
                        				alert('UPDATE "reponses" SET envoi = 1 WHERE idhoraire = '+saveResHorairesID+';');
                        			}
                        	}
                        	
                        }
            			
            		});
            		
                }
            }
		});
	});
}

