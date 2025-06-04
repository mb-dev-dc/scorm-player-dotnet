window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script2 = function()
{
  objLMS.SetScore(42*(1/.75),100,0)
objLMS.CommitData();
}

window.Script3 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script4 = function()
{
  objLMS.SetScore(45*(1/.75),100,0)
objLMS.CommitData();
}

window.Script5 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script6 = function()
{
  objLMS.SetScore(43*(1/.75),100,0)
objLMS.CommitData();
}

window.Script7 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script8 = function()
{
  objLMS.SetScore(44*(1/.75),100,0)
objLMS.CommitData();
}

window.Script9 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script10 = function()
{
  objLMS.SetScore(46*(1/.75),100,0)
objLMS.CommitData();
}

window.Script11 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script12 = function()
{
  objLMS.SetScore(47*(1/.75),100,0)
objLMS.CommitData();
}

window.Script13 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script14 = function()
{
  objLMS.SetScore(48*(1/.75),100,0)
objLMS.CommitData();
}

window.Script15 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script16 = function()
{
  objLMS.SetScore(49*(1/.75),100,0)
objLMS.CommitData();
}

window.Script17 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script18 = function()
{
  objLMS.SetScore(50*(1/.75),100,0)
objLMS.CommitData();
}

window.Script19 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script20 = function()
{
  objLMS.SetScore(51*(1/.75),100,0)
objLMS.CommitData();
}

window.Script21 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script22 = function()
{
  objLMS.SetScore(52*(1/.75),100,0)
objLMS.CommitData();
}

window.Script23 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script24 = function()
{
  objLMS.SetScore(53*(1/.75),100,0)
objLMS.CommitData();
}

window.Script25 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script26 = function()
{
  objLMS.SetScore(54*(1/.75),100,0)
objLMS.CommitData();
}

window.Script27 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script28 = function()
{
  objLMS.SetScore(55*(1/.75),100,0)
objLMS.CommitData();
}

window.Script29 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script30 = function()
{
  objLMS.SetScore(56*(1/.75),100,0)
objLMS.CommitData();
}

window.Script31 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script32 = function()
{
  objLMS.SetScore(57*(1/.75),100,0)
objLMS.CommitData();
}

window.Script33 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script34 = function()
{
  objLMS.SetScore(58*(1/.75),100,0)
objLMS.CommitData();
}

window.Script35 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script36 = function()
{
  objLMS.SetScore(59*(1/.75),100,0)
objLMS.CommitData();
}

window.Script37 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script38 = function()
{
  objLMS.SetScore(60*(1/.75),100,0)
objLMS.CommitData();
}

window.Script39 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script40 = function()
{
  objLMS.SetScore(61*(1/.75),100,0)
objLMS.CommitData();
}

window.Script41 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script42 = function()
{
  objLMS.SetScore(62*(1/.75),100,0)
objLMS.CommitData();
}

window.Script43 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script44 = function()
{
  objLMS.SetScore(63*(1/.75),100,0)
objLMS.CommitData();
}

window.Script45 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script46 = function()
{
  objLMS.SetScore(64*(1/.75),100,0)
objLMS.CommitData();
}

window.Script47 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script48 = function()
{
  objLMS.SetScore(65*(1/.75),100,0)
objLMS.CommitData();
}

window.Script49 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script50 = function()
{
  objLMS.SetScore(66*(1/.75),100,0)
objLMS.CommitData();
}

window.Script51 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script52 = function()
{
  objLMS.SetScore(67*(1/.75),100,0)
objLMS.CommitData();
}

window.Script53 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script54 = function()
{
  objLMS.SetScore(68*(1/.75),100,0)
objLMS.CommitData();
}

window.Script55 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script56 = function()
{
  objLMS.SetScore(69*(1/.75),100,0)
objLMS.CommitData();
}

window.Script57 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script58 = function()
{
  objLMS.SetScore(70*(1/.75),100,0)
objLMS.CommitData();
}

window.Script59 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script60 = function()
{
  objLMS.SetScore(71*(1/.75),100,0)
objLMS.CommitData();
}

window.Script61 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script62 = function()
{
  objLMS.SetScore(72*(1/.75),100,0)
objLMS.CommitData();
}

window.Script63 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script64 = function()
{
  objLMS.SetScore(73*(1/.75),100,0)
objLMS.CommitData();
}

window.Script65 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script66 = function()
{
  objLMS.SetScore(74*(1/.75),100,0)
objLMS.CommitData();
}

window.Script67 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script68 = function()
{
  objLMS.SetScore(75*(1/.75),100,0)
objLMS.CommitData();
}

window.Script69 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script70 = function()
{
  objLMS.SetScore(1*(1/.75),100,0)
objLMS.CommitData();
}

window.Script71 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script72 = function()
{
  objLMS.SetScore(2*(1/.75),100,0)
objLMS.CommitData();
}

window.Script73 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script74 = function()
{
  objLMS.SetScore(3*(1/.75),100,0)
objLMS.CommitData();
}

window.Script75 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script76 = function()
{
  objLMS.SetScore(6*(1/.75),100,0)
objLMS.CommitData();
}

window.Script77 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script78 = function()
{
  objLMS.SetScore(8*(1/.75),100,0)
objLMS.CommitData();
}

window.Script79 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script80 = function()
{
  objLMS.SetScore(4*(1/.75),100,0)
objLMS.CommitData();
}

window.Script81 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script82 = function()
{
  objLMS.SetScore(7*(1/.75),100,0)
objLMS.CommitData();
}

window.Script83 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script84 = function()
{
  objLMS.SetScore(5*(1/.75),100,0)
objLMS.CommitData();
}

window.Script85 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script86 = function()
{
  objLMS.SetScore(9*(1/.75),100,0)
objLMS.CommitData();
}

window.Script87 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script88 = function()
{
  objLMS.SetScore(10*(1/.75),100,0)
objLMS.CommitData();
}

window.Script89 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script90 = function()
{
  objLMS.SetScore(11*(1/.75),100,0)
objLMS.CommitData();
}

window.Script91 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script92 = function()
{
  objLMS.SetScore(12*(1/.75),100,0)
objLMS.CommitData();
}

window.Script93 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script94 = function()
{
  objLMS.SetScore(13*(1/.75),100,0)
objLMS.CommitData();
}

window.Script95 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script96 = function()
{
  objLMS.SetScore(14*(1/.75),100,0)
objLMS.CommitData();
}

window.Script97 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script98 = function()
{
  objLMS.SetScore(15*(1/.75),100,0)
objLMS.CommitData();
}

window.Script99 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script100 = function()
{
  objLMS.SetScore(16*(1/.75),100,0)
objLMS.CommitData();
}

window.Script101 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script102 = function()
{
  objLMS.SetScore(17*(1/.75),100,0)
objLMS.CommitData();
}

window.Script103 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script104 = function()
{
  objLMS.SetScore(18*(1/.75),100,0)
objLMS.CommitData();
}

window.Script105 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script106 = function()
{
  objLMS.SetScore(19*(1/.75),100,0)
objLMS.CommitData();
}

window.Script107 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script108 = function()
{
  objLMS.SetScore(20*(1/.75),100,0)
objLMS.CommitData();
}

window.Script109 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script110 = function()
{
  objLMS.SetScore(21*(1/.75),100,0)
objLMS.CommitData();
}

window.Script111 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script112 = function()
{
  objLMS.SetScore(22*(1/.75),100,0)
objLMS.CommitData();
}

window.Script113 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script114 = function()
{
  objLMS.SetScore(23*(1/.75),100,0)
objLMS.CommitData();
}

window.Script115 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script116 = function()
{
  objLMS.SetScore(24*(1/.75),100,0)
objLMS.CommitData();
}

window.Script117 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script118 = function()
{
  objLMS.SetScore(25*(1/.75),100,0)
objLMS.CommitData();
}

window.Script119 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script120 = function()
{
  objLMS.SetScore(26*(1/.75),100,0)
objLMS.CommitData();
}

window.Script121 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script122 = function()
{
  objLMS.SetScore(27*(1/.75),100,0)
objLMS.CommitData();
}

window.Script123 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script124 = function()
{
  objLMS.SetScore(28*(1/.75),100,0)
objLMS.CommitData();
}

window.Script125 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script126 = function()
{
  objLMS.SetScore(29*(1/.75),100,0)
objLMS.CommitData();
}

window.Script127 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script128 = function()
{
  objLMS.SetScore(30*(1/.75),100,0)
objLMS.CommitData();
}

window.Script129 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script130 = function()
{
  objLMS.SetScore(31*(1/.75),100,0)
objLMS.CommitData();
}

window.Script131 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script132 = function()
{
  objLMS.SetScore(32*(1/.75),100,0)
objLMS.CommitData();
}

window.Script133 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script134 = function()
{
  objLMS.SetScore(33*(1/.75),100,0)
objLMS.CommitData();
}

window.Script135 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script136 = function()
{
  objLMS.SetScore(34*(1/.75),100,0)
objLMS.CommitData();
}

window.Script137 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script138 = function()
{
  objLMS.SetScore(35*(1/.75),100,0)
objLMS.CommitData();
}

window.Script139 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script140 = function()
{
  objLMS.SetScore(36*(1/.75),100,0)
objLMS.CommitData();
}

window.Script141 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script142 = function()
{
  objLMS.SetScore(37*(1/.75),100,0)
objLMS.CommitData();
}

window.Script143 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script144 = function()
{
  objLMS.SetScore(38*(1/.75),100,0)
objLMS.CommitData();
}

window.Script145 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script146 = function()
{
  objLMS.SetScore(39*(1/.75),100,0)
objLMS.CommitData();
}

window.Script147 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script148 = function()
{
  objLMS.SetScore(40*(1/.75),100,0)
objLMS.CommitData();
}

window.Script149 = function()
{
  var player = GetPlayer(); 

var slideNo = player.GetVar("SlideNo").toString(); 

var isGetCurrentSlideNo = player.GetVar("isGetCurrentSlideNo").toString(); 

 

if(isGetCurrentSlideNo === "true") { 

var addr = window.location.search.substring(6); 

player.SetVar("goToSlideNo",addr);     

player.SetVar("isGetCurrentSlideNo", false); 

}  

else { 

// Don't count first slide because its our jump slide, get saved slide then. 

if(slideNo === "0") { 

slideNo = window.location.search.substring(6); 

} 

var data = { 

model: { 

'SlideNo': slideNo, 

} 

}; 

 

$.ajax({ 

type: 'POST', 

url: $("#GetInsertUserActivityUrl", parent.document).val(), 

data: data, 

dataType: 'json' 

}); 

}  
}

window.Script150 = function()
{
  objLMS.SetScore(41*(1/.75),100,0)
objLMS.CommitData();
}

};
