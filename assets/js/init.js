function wwidth(){
  return $("#wwidth").val() || 40;
}
function wheight(){
  return $("#wheight").val() || 40;
}
function selectByPosition(a){
  return $("[data-x='"+a.x+"'][data-y='"+a.y+"']");
}
var Row = { new: function(){ return $("<div class='row'></div>") } }
var Block = { new: function(x, y){ return $("<span class='block' data-x='"+x+"' data-y='"+y+"'></span>") } }

var World = function(){
    this.DOM = $("#world");
    this.DOM.empty();
    this.width = wwidth();
    this.height = wheight();

    for(var i = 0; i < this.height; i++){
      row = Row.new();
      for(var j = 0; j < this.width; j++){
        row.append(Block.new(j,i));
      } 
      this.DOM.append(row);
    }
}


$(document).ready(function(){
    //$(".block.alive.example").animate
  window.world = new World();
  window.ga = new GA({
    elitismPercent: 90,
    mutationPercent: 5,
    populationSize: 240,
    generateFirstGen: true,
    chromosomesToEvolve: { 
      x: function(citizen, chromosome, value){
        return _.random(39);
      },
      y: function(citizen, chromosome, value){
        return _.random(39);
      },
      z: function(){ return _.random(150); }
    },
    builder: function(evolvedChromosomes){
      return evolvedChromosomes;
    },
    randomBuilder: function(){
      return { x: _.random(window.world.width - 1), y: _.random(window.world.height - 1) }
    }
  });

  $("#reset").on("click",function(){
    window.world = new World();      
  });

  var print = function(a,b, child, func2){
    var domA = selectByPosition(a);
    var domB = selectByPosition(b);

    $(".selecting").removeClass("selecting")
    $("[data-x='"+a.x+"']").addClass("selecting");
    $("[data-y='"+a.y+"']").addClass("selecting");
    $("[data-x='"+b.x+"']").addClass("selecting");
    $("[data-y='"+b.y+"']").addClass("selecting");

    var domChild = selectByPosition(child);
    $(".selected").removeClass("selected");
    domA.addClass("selected");
    domB.addClass("selected");
    $(".egg").removeClass("egg");
    domChild.text(child.z).addClass("egg");
  }

  $("#evolve").on("click", function(){
    window.ga.evolve(print, print, function(funcs){
      i = 0,
      timer = setInterval(callFuncs, 500);

      function callFuncs() {
        var index = i++;
        if(_.isUndefined(funcs[index])){
          clearInterval(timer);
        }else{
          funcs[index]();
          if (i === funcs.length) clearInterval(timer);
        }
      }
    });
  });

  setInterval(function(){ 
    $(".alive").removeClass("alive")
    _.each(window.ga.population, function(c){
      $("[data-x='"+c.x+"'][data-y='"+c.y+"']").addClass("alive");
    }); 
  }, 1000)
});
