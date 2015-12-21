var express = require('express');
var constants = require('./constants');
var router = express.Router();
var mongoskin = require('mongoskin');
var db = require('mongoskin').db('mongodb://localhost:27017/bloodline');
var db2 = require('mongoskin').db('mongodb://localhost:27017/second_bloodline');
var cycle,cycle_len,lowerBound;
var guild = "主會";
var guild2 = "分會";
db.collection('building').find().sort('rank').limit(1).toArray(function(err, result) {
	cycle = result[0].cycle;
	cycle_len = result[0].cycle_len;
	lowerBound = result[0].lowerBound;
});
var schedule_special;
db.collection('special').find().toArray(function(err, result) {
	schedule_special = result;
});
var time_forbidden;
db.collection('time').find().toArray(function(err, result) {
	time_forbidden = result;
});


router.get('/data', function(req, res, next) {
  db.collection('userdata').find().sort({"power1":-1}).toArray(function(err, result) {
    if (err) throw err;
	res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(result));
  });
});

router.get('/data/:name', function(req, res, next) {
  db.collection('userdata').find({ name : new RegExp('^' + req.params.name) }).toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

router.post('/data', function(req, res, next) {
  var name = req.body.name === 'null'? '' : req.body.name ;
  var lineID = req.body.lineID === 'null'? '' : req.body.lineID ;
  var power1 = req.body.power1 === 'null'? '' : parseInt(req.body.power1) ;
  var power1_Special = req.body.power1_Special === 'null'? '' : req.body.power1_Special ;
  var power2 = req.body.power2 === 'null'? '' : parseInt(req.body.power2) ;
  var power2_Special = req.body.power2_Special === 'null'? '' : req.body.power2_Special ;
  var power3 = req.body.power3 === 'null'? '' : parseInt(req.body.power3) ;
  var power3_Special = req.body.power3_Special === 'null'? '' : req.body.power3_Special ;
  var type = req.body.type === 'null'? '' : req.body.type ;
  if(name===''&&lineID===''&&power1===''&&power1_Special===''&&power2===''&&power2_Special===''&&power3===''&&power3_Special===''&&type==='')
	return;
  db.collection('userdata').insert({name: name,lineID: lineID,power1: power1,power1_Special: power1_Special,power2: power2,power2_Special: power2_Special,power3: power3,power3_Special: power3_Special,type: type}, function(e, result){
		if (e) return next(e)
		res.send((result===1)?{msg:'success'}:{msg:'error'});
		schedule();
	  });
});

router.put('/data', function(req, res, next) {
  if(!req.body._id) return;
  var name = req.body.name === 'null'? '' : req.body.name ;
  var lineID = req.body.lineID === 'null'? '' : req.body.lineID ;
  var power1 = req.body.power1 === 'null'? '' : parseInt(req.body.power1) ;
  var power1_Special = req.body.power1_Special === 'null'? '' : req.body.power1_Special ;
  var power2 = req.body.power2 === 'null'? '' : parseInt(req.body.power2) ;
  var power2_Special = req.body.power2_Special === 'null'? '' : req.body.power2_Special ;
  var power3 = req.body.power3 === 'null'? '' : parseInt(req.body.power3) ;
  var power3_Special = req.body.power3_Special === 'null'? '' : req.body.power3_Special ;
  var type = req.body.type === 'null'? '' : req.body.type ;
  db.collection('userdata').update({_id:  mongoskin.helper.toObjectID(req.body._id) },{name: name,lineID: lineID,power1: power1,power1_Special: power1_Special,power2: power2,power2_Special: power2_Special,power3: power3,power3_Special: power3_Special,type: type}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	schedule();
  });

});

router.delete('/data', function(req, res, next) {
  db.collection('userdata').remove({_id: mongoskin.helper.toObjectID(req.body._id)}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	schedule();
  });
});

//---------------------------building----------------------------------------
router.get('/building', function(req, res, next) {
  db.collection('building').find().sort('rank').toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result.splice(1,result.length-1)));
  });
});

router.post('/building', function(req, res, next) {
  var name = req.body.name === 'null'? '' : req.body.name ;
  var limit = req.body.limit === 'null'? '' : parseInt(req.body.limit) ;
  var rank = req.body.rank === 'null'? '' : parseInt(req.body.rank) ;
  db.collection('building').insert({name: name,limit: limit,rank: rank}, function(e, result){
		if (e) return next(e);
		res.send((result===1)?{msg:'success'}:{msg:'error'});
		schedule();
	  });
});

router.put('/building', function(req, res, next) {
  if(!req.body._id) return;
  var name = req.body.name === 'null'? '' : req.body.name ;
  var limit = req.body.limit === 'null'? '' : parseInt(req.body.limit) ;
  var rank = req.body.rank === 'null'? '' : parseInt(req.body.rank) ;
  db.collection('building').update({_id:  mongoskin.helper.toObjectID(req.body._id) },{name: name,limit: limit,rank: rank}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	schedule();
  });

});

router.delete('/building', function(req, res, next) {
  db.collection('building').remove({_id: mongoskin.helper.toObjectID(req.body._id)}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	schedule();
  });
});
//---------------------------schedule----------------------------------------
router.get('/schedule', function(req, res, next) {
  db.collection('building').find().sort('rank').toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result.splice(0,1)));
  });
});

router.put('/schedule', function(req, res, next) {
  if(!req.body._id) return;
  if(parseInt(req.body.cycle)<= 0) return;
  if(parseInt(req.body.cycle_len)<= 0) return;
  if(parseInt(req.body.lowerBound)<= 0) return;
  var cycle_s = parseInt(req.body.cycle);
  var cycle_len_s = parseInt(req.body.cycle_len);
  var lowerBound_s = parseInt(req.body.lowerBound); 
  db.collection('building').update({_id:  mongoskin.helper.toObjectID(req.body._id) },{cycle: cycle_s,cycle_len: cycle_len_s,lowerBound:lowerBound_s}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	cycle = cycle_s;
	cycle_len = cycle_len_s;
	lowerBound = lowerBound_s;
	schedule();
  });

});

var people = [];
function mapUsers(element, index, array) {
    var power1 = {
        name: element.name,
        power: parseInt(element.power1),
        which_power: 1,
		Special: element.power1_Special
    };
	if(element.power1 >= lowerBound) people.push(power1);
	var power2 = {
        name: element.name,
        power: parseInt(element.power2),
        which_power: 2,
		Special: element.power2_Special
    };
	if(element.power2 >= lowerBound) people.push(power2);
	var power3 = {
        name: element.name,
        power: parseInt(element.power3),
        which_power: 3,
		Special: element.power3_Special
    };
    if(element.power3 >= lowerBound) people.push(power3);
};

var deploy = [];
function mapBuilding(element, index, array)
{
	if(element.limit <= 0) return;
	var info = {
        name: element.name,
        limit: element.limit,
		rank: element.rank,
        people:{person_name: [], power: [], which_power:[] , Special: []}
    };
	deploy.push(info);
}

function deploy_add_person(index,user)
{
	deploy[index].people.person_name.push(user.name);
	deploy[index].people.power.push(user.power);
	deploy[index].people.which_power.push(user.which_power);
	deploy[index].people.Special.push(user.Special);
}

var building = [];
function algo(err, userdata) {
	if (err) throw err;
	deploy.length = 0;
	people.length = 0;
	userdata.forEach(mapUsers);
	people.sort(function (a, b) {
	  var a_total = a.power ,b_total = b.power;
	  schedule_special.forEach(function(i, index, ar)
	  {
		if(a.Special==i.name && i.name!='' && !isNaN(i.power)&& i.power!='') a_total = a.power+parseInt(i.power);
		if(b.Special==i.name && i.name!='' && !isNaN(i.power)&& i.power!='') b_total = b.power+parseInt(i.power);
	  });
	  if (a_total < b_total) {
		return 1;
	  }
	  if (a_total > b_total) {
		return -1;
	  }
	  return 0;
	});
	//console.log(building.length);
	building.splice(1,building.length-1).forEach(mapBuilding);
	//console.log(deploy);
	//console.log(deploy.length);
	//console.log(people.length);
	if(deploy.length - people.length >= 0)
	{
		//console.log(deploy);
		//console.log(people);
		for(var i = 0;i < people.length; i++)
			deploy_add_person(i,people[i]);
	}
	else{
		var cycle_count = 0,deploy_p = 0,is_incycle = 1;
		var is_use_deploy =[]
		for(var i = 0;i < deploy.length; i++)
			is_use_deploy.push(0);
		for(var i = 0,cycle_p = 0;i < people.length; i++)
		{/*
			console.log('--part1----'+i+'-------');
			for(var j = 0;j < deploy.length; j++){
				console.log(deploy[j]);
			}*/
			var count = 0;
			for(var j = 0; j< is_use_deploy.length; j++)
				if(!is_use_deploy[j]) count++;
			//console.log(is_use_deploy);
			if(people.length - i > count && is_incycle)
			{/*
				console.log('--branch1----'+i+'-------'+cycle_p);
				for(var j = 0;j < deploy.length; j++){
				console.log(deploy[j]);
				}*/
				deploy_add_person(cycle_p,people[i]);
				++is_use_deploy[cycle_p];
				//console.log('cycle_p:'+cycle_p+'  cycle:'+cycle+'  deploy.length:'+deploy.length+'  cycle_count:'+cycle_count+'  cycle_len:'+cycle_len);
				do
				{
					++cycle_p;
					if(cycle_p === cycle || cycle_p === deploy.length ){
						cycle_p = 0;
						++cycle_count;
						/*console.log('is_use_deploy[cycle_p]+1:'+is_use_deploy[cycle_p]+1+'  deploy[cycle_p].limit:'+deploy[cycle_p].limit);*/
						if(parseInt(is_use_deploy[cycle_p]) === parseInt(deploy[cycle_p].limit))
							return;
						break;
					}
					if(cycle_count === cycle_len){
						is_incycle = 0;
						break;
					}
				}while(is_use_deploy[cycle_p]+1 === deploy[cycle_p].limit);
				//console.log('cycle_p:'+cycle_p+'  cycle_count:'+cycle_count);
			}
			else if(people.length - i > count){ //not in cycle but not in postfix
				/*console.log('--branch2----'+i+'-------');
				for(var j = 0;j < deploy.length; j++){
				console.log(deploy[j]);
				}*/
				//console.log('---deploy_p:'+deploy_p+'  is_use_deploy[deploy_p]+1:'+is_use_deploy[deploy_p]);
				for(; deploy_p < deploy.length && parseInt(is_use_deploy[deploy_p]) === parseInt(deploy[deploy_p].limit) ;deploy_p++);
				//console.log('deploy_p:'+deploy_p);
				if(deploy_p === deploy.length )
					break;
				deploy_add_person(deploy_p,people[i]);
				++is_use_deploy[deploy_p];
			}
			else{/*
				console.log('--branch3----'+i+'-------');
				console.log(people.length+'...'+count);
				for(var j = 0;j < deploy.length; j++){
				console.log(deploy[j]);
				}*/
				for(var j = 0 ; j < parseInt(is_use_deploy.length); j++)
				{
					//console.log('j:'+j+'  is_use_deploy[j]:'+is_use_deploy[j]);
					if(!parseInt(is_use_deploy[j])){
						deploy_add_person(j,people[i]);
						++is_use_deploy[j];
						break;
					}
				}
			}
		}
	}			
};

function schedule()
{
	var check = 1;
	
	var today=new Date();
	/*
	if(!((today.getDay()==2 || today.getDay()==6 )&& today.getHours()>=5 && today.getHours()< 11) )*/
	time_forbidden.forEach(function(i, index, ar){
		if(!isNaN(i.day)&& i.day!=''&&!isNaN(i.after)&& i.after!=''&&!isNaN(i.before)&& i.before!='')
			if(today.getDay()==i.day&&today.getHours() >= i.after &&today.getHours()<i.before)
				check = 0;
	  });
	if(check)
	{
		db.collection('building').find().sort('rank').toArray(function(err, building_data) {
			building = building_data;
			if (err) throw err;
			db.collection('userdata').find().toArray(algo);
			db.collection('deploy').remove({},function(err, removedCount) {
				for(var i = 0;i < deploy.length; i++)
				{	
					//console.log(deploy[i]);
					if(deploy[i].people.person_name.length)
						db.collection('deploy').insert(deploy[i], function(e, result){
							if (e) return next(e);
						});
				}
				/*db2.collection('building').find().sort('rank').toArray(function(err, building_data) {
					building = building_data;
					//console.log(building.length);
					if (err) throw err;
					db.collection('userdata').find({'type':guild2}).toArray(algo);
					db2.collection('deploy').remove({},function(err, removedCount) {
						for(var i = 0;i < deploy.length; i++)
						{	
							//console.log(deploy[i]);
							if(deploy[i].people.person_name.length)
								db2.collection('deploy').insert(deploy[i], function(e, result){
									if (e) return next(e);
								});
						}
					});
				});*/
			});
		});
	}
}
//---------------------------deploy----------------------------------------
router.get('/deploy', function(req, res, next) {
	  db.collection('deploy').find().sort('rank').toArray(function(err, result) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	  });
});
//---------------------------special----------------------------------------
router.get('/special', function(req, res, next) {
	  db.collection('special').find().toArray(function(err, result) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	  });
});

router.post('/special', function(req, res, next) {
  var name = req.body.name === 'null'? '' : req.body.name ;
  var power = req.body.power === 'null'? '' : parseInt(req.body.power) ;
  db.collection('special').insert({name: name,power: power}, function(e, result){
		if (e) return next(e);
		res.send((result===1)?{msg:'success'}:{msg:'error'});
		db.collection('special').find().toArray(function(err, result) {
		schedule_special = result;
		schedule();
		});
	  });
});

router.put('/special', function(req, res, next) {
  if(!req.body._id) return;
  var name = req.body.name === 'null'? '' : req.body.name ;
  var power = req.body.power === 'null'? '' : parseInt(req.body.power) ;
  db.collection('special').update({_id:  mongoskin.helper.toObjectID(req.body._id) },{name: name,power: power}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	db.collection('special').find().toArray(function(err, result) {
	schedule_special = result;
	schedule();
	});
  });

});

router.delete('/special', function(req, res, next) {
  db.collection('special').remove({_id: mongoskin.helper.toObjectID(req.body._id)}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	db.collection('special').find().toArray(function(err, result) {
	schedule_special = result;
	schedule();
	});
  });
});
//---------------------------time----------------------------------------
router.get('/time', function(req, res, next) {
	  db.collection('time').find().toArray(function(err, result) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	  });
});

router.post('/time', function(req, res, next) {
  var day = req.body.day === 'null'? '' : req.body.day;
  var after = req.body.after === 'null'? '' : parseInt(req.body.after);
  var before = req.body.before === 'null'? '' : parseInt(req.body.before);
  db.collection('time').insert({day: day,after: after,before: before}, function(e, result){
		if (e) return next(e);
		res.send((result===1)?{msg:'success'}:{msg:'error'});
		db.collection('time').find().toArray(function(err, result) {
			time_forbidden = result;
			schedule();
		});
	  });
});

router.put('/time', function(req, res, next) {
  if(!req.body._id) return;
  var day = req.body.day === 'null'? '' : req.body.day;
  var after = req.body.after === 'null'? '' : parseInt(req.body.after);
  var before = req.body.before === 'null'? '' : parseInt(req.body.before);
  db.collection('time').update({_id:  mongoskin.helper.toObjectID(req.body._id) },{day: day,after: after,before: before}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	db.collection('time').find().toArray(function(err, result) {
		time_forbidden = result;
		schedule();
	});
  });

});

router.delete('/time', function(req, res, next) {
  db.collection('time').remove({_id: mongoskin.helper.toObjectID(req.body._id)}, function(e, result){
    if (e) return next(e);
    res.send((result===1)?{msg:'success'}:{msg:'error'});
	db.collection('time').find().toArray(function(err, result) {
		time_forbidden = result;
		schedule();
	});
  });
});
//---------------------------cookie---------------------
router.post('/login', function(req, res, next) {
	if(req.body.key === constants.password)
	{
		res.cookie('key', constants.cookie, { httpOnly: true });
		res.send("yes");
	}
	else{
		res.send("no");
	}
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('key');
	res.send("yes");
});
module.exports = router;