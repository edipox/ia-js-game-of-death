function wwidth(){
  return Number($("#wwidth").val()) || 40;
}
function wheight(){
  return Number($("#wheight").val()) || 40;
}
function mutation(){
  return Number($("#mutation").val()) || 10;
}
function populationSize(){
  return Number($("#psize").val()) || 10; 
}
function selectByPosition(a){
  return $("[data-x='"+a.x+"'][data-y='"+a.y+"']");
}
function animationSpeed(){
  return Number($("#animation").val()) || 500;
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

function startUp(){
    window.world = new World();
    window.ga = new GA({
      elitismPercent: 50,
      mutationPercent: mutation(),
      populationSize: populationSize(),
      generateFirstGen: true,
      chromosomesToEvolve: { 
        x: function(citizen, chromosome, value){
          return _.random(window.world.width -1);
        },
        y: function(citizen, chromosome, value){
          return _.random(window.world.height -1 );
        }
      },
      builder: function(evolvedChromosomes){
        return evolvedChromosomes;
      },
      randomBuilder: function(){
        return { x: _.random(window.world.width - 1), y: _.random(window.world.height - 1) }
      }
    });
}

$(document).ready(function(){

  $("#reset").on("click",function(){
     startUp();
  });

  var print = function(a,b, child){
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
    domChild.switchClass("", "new").switchClass("new","egg").switchClass("egg", "new");
  }

  $("#evolve").on("click", function(){
    $(".alive").removeClass("alive");
    $(".new").removeClass("new");
    _.each(window.ga.population, function(c){
      selectByPosition(c).addClass("alive");
    });     
    if(_.isArray(window.timers)) _.each(window.timers, clearInterval);
    window.ga.evolve(print, print, function(params){
      var speed = animationSpeed();
      var i = 0,
      timer = setInterval(callFuncs, speed);

      window.timers = window.timers || [];
      window.timers.push(timer);

      function callFuncs() {
        var index = i++;
        // if(_.isUndefined(funcs[index])){
        //   clearInterval(timer);
        // }else{
          print(params[index]["c1"], params[index]["c2"], params[index]["child"]);
          if (i === params.length){
            clearInterval(timer);
            $(".alive").removeClass("alive");
            $(".new").removeClass("new");
            _.each(window.ga.population, function(c){
              selectByPosition(c).addClass("alive");
            });     
            $(".selecting").removeClass("selecting");
            $(".selected").removeClass("selected");
            $(".egg").removeClass("egg");
          } 
        // }
      }
    });
  });

  // setInterval(function(){ 
  //   $(".new").removeClass("new");
  //   _.each(window.ga.population, function(c){
  //     selectByPosition(c).addClass("new");
  //   }); 
  // }, 1000)
});
