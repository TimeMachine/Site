
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function detectmob() {
if(window.innerWidth <= 800 && window.innerHeight <= 600) {
     return true;
   } else {
     return false;
   }
}

//----------------------------------------
function getData() {
	  $.getJSON('api_2/data/', function( data ) {
		  userdata.loadData(data);
	  });
}

function postData(data) {
	$.ajax({
	  url: 'api_2/data/',
	  data: {name: data.name,power1: data.power1,power1_Special: data.power1_Special,power2: data.power2,power2_Special: data.power2_Special,power3: data.power3,power3_Special: data.power3_Special,type: data.type},
	  type:"POST",
	  dataType:'json',
	  success: function(msg){
                    getData();
                }
	});
}

function putData(data) {
	$.ajax({
	  url: 'api_2/data/',
	  data: {_id: data._id,name: data.name,power1: data.power1,power1_Special: data.power1_Special,power2: data.power2,power2_Special: data.power2_Special,power3: data.power3,power3_Special: data.power3_Special,type: data.type},
	  type:"PUT",
	  dataType:'json',
	  success: function(msg){
                    getData();
                }
	});
}

function delData(data) {
	$.ajax({
	  url: 'api_2/data/',
	  data: {_id: data._id},
	  type:"DELETE",
	  dataType:'json',
	  success: function(msg){
                    getData();
                }
	});
}
//-------------------------------Renderer------------------------------------------
var powerRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  td.style.color = 'black';
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if(value >= 6000)
	td.style.backgroundColor = "#FF7F50";
  else if(value >= 5000)
	td.style.backgroundColor = 'yellow';

};

var specialRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if(value === 'Y' || value === 1|| value === '1')
	td.style.color = 'red';
};
var cycle_n = 0;
var buildingRenderer = function(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if(row < cycle_n)
	td.style.backgroundColor = "#C1FFC1";
};
//-------------------------------building------------------------------------------
function getBuilding() {
	  $.getJSON('api_2/building/', function( data ) {
		  building.loadData(data);
	  });
}

function postBuilding(data) {
	$.ajax({
	  url: 'api_2/building/',
	  data: {name: data.name,limit: data.limit,rank: data.rank},
	  type:"POST",
	  dataType:'json',
	  success: function(msg){
                    getBuilding();
                }
	});
}

function putBuilding(data) {
	$.ajax({
	  url: 'api_2/building/',
	  data: {_id: data._id,name: data.name,limit: data.limit,rank: data.rank},
	  type:"PUT",
	  dataType:'json',
	  success: function(msg){
                    getBuilding();
                }
	});
}

function delBuilding(data) {
	$.ajax({
	  url: 'api_2/building/',
	  data: {_id: data._id},
	  type:"DELETE",
	  dataType:'json',
	  success: function(msg){
                    getBuilding();
                }
	});
}
	
//-------------------------------deploy------------------------------------------
function getDeploy() {
	  $.getJSON('api_2/deploy/', function( data ) {
		  var containerdeploy = document.getElementById('deploy');
		  while (containerdeploy.firstChild) {
			containerdeploy.removeChild(containerdeploy.firstChild);
		}
		  for(var i=0 ; i<data.length ;i++)
		  {
			var div_t = document.createElement("div");
			div_t.classname = 'deploy'+i;
			var array = $.map(data[i].people, function(value, index) {
			return [value];
			});
			var deploy = new Handsontable(div_t,
			  {
				colHeaders: Array.apply(null, Array(15)).map(function (_, i) {return i+1;}),
				rowHeaders: ['名稱', '戰鬥力', '幾軍','特殊隊長'],
				startCols: 15,
				startRows: 4,
				cells: function(r,c, prop) {
				var cellProperties = {};
				cellProperties.readOnly = true;
				this.renderer = powerRenderer;
				return cellProperties;
				}
			  });
			var li_t = document.createElement("li");
			var li_v = document.createTextNode(data[i].name);
			li_t.appendChild(li_v);
			containerdeploy.appendChild(li_t);
			containerdeploy.appendChild(div_t);
			deploy.loadData(array);
		  }

	  });
}
//-------------------------------schedule------------------------------------------
function getSchedule() {
	  $.getJSON('api_2/schedule/', function( data ) {
		  schedule.loadData(data);
		  cycle_n = data[0].cycle;
		  building.render();
	  });
}

function putSchedule(data) {
	$.ajax({
	  url: 'api_2/schedule/',
	  data: {_id: data._id,cycle: data.cycle,cycle_len: data.cycle_len,lowerBound: data.lowerBound},
	  type:"PUT",
	  dataType:'json',
	  success: function(msg){
                    getSchedule();
					getDeploy();
                }
	});
}
//-------------------------------special------------------------------------------
function getSpecial() {
	  $.getJSON('api_2/special/', function( data ) {
		  special.loadData(data);
	  });
}

function postSpecial(data) {
	$.ajax({
	  url: 'api_2/special/',
	  data: {name: data.name,power: data.power},
	  type:"POST",
	  dataType:'json',
	  success: function(msg){
                    getSpecial();
                }
	});
}

function putSpecial(data) {
	$.ajax({
	  url: 'api_2/special/',
	  data: {_id: data._id,name: data.name,power: data.power},
	  type:"PUT",
	  dataType:'json',
	  success: function(msg){
                    getSpecial();
                }
	});
}

function delSpecial(data) {
	$.ajax({
	  url: 'api_2/special/',
	  data: {_id: data._id},
	  type:"DELETE",
	  dataType:'json',
	  success: function(msg){
                    getSpecial();
                }
	});
}
//-------------------------------time------------------------------------------
function getTime() {
	  $.getJSON('api_2/time/', function( data ) {
		  time.loadData(data);
	  });
}

function postTime(data) {
	$.ajax({
	  url: 'api_2/time/',
	  data: {day: data.day,after: data.after,before: data.before},
	  type:"POST",
	  dataType:'json',
	  success: function(msg){
                    getTime();
                }
	});
}

function putTime(data) {
	$.ajax({
	  url: 'api_2/time/',
	  data: {_id: data._id,day: data.day,after: data.after,before: data.before},
	  type:"PUT",
	  dataType:'json',
	  success: function(msg){
                    getTime();
                }
	});
}

function delTime(data) {
	$.ajax({
	  url: 'api_2/time/',
	  data: {_id: data._id},
	  type:"DELETE",
	  dataType:'json',
	  success: function(msg){
                    getTime();
                }
	});
}