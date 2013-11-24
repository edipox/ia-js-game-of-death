function wwidth(){
  return $("#wwidth").val() || 40;
}
function wheight(){
  return $("#wheight").val() || 40;
}

var Row = { new: function(){ return $("<div class='row'></div>") } }
var Block = { new: function(){ return $("<span class='block'></span>") } }

function createWorld(world, wwidth, wheight){
  for(var i = 0; i < wheight; i++){
    row = Row.new();
    for(var j = 0; j < wwidth; j++){
      row.append(Block.new())
    } 
    world.append(row);
  }
}


$(document).ready(function(){
    //$(".block.alive.example").animate

    $("#reset").on("click",function(){
      var world = $("#world");
      world.empty();
      createWorld(world, wwidth(), wheight());
    });
});
