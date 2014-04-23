function wwidth(){
  return parseInt($("#wwidth").val()) || 80;
}
function wheight(){
  return parseInt($("#wheight").val()) || 40;
}
function mutation(){
  var mutation = parseInt($("#mutation").val());
  return _.isNaN(mutation)  ?  5 : mutation;  
}
function populationSize(){
  return parseInt($("#psize").val()) || 10; 
}
function selectByPosition(a){
  return $("[data-x='"+a.x+"'][data-y='"+a.y+"']");
}
function animationSpeed(){
  var speed = parseInt($("#animation").val());
  return  _.isNaN(speed)  ?  1000 : speed;
}
function polution(){
  var polution = parseInt($("#polution").val());
  return _.isNaN(polution)  ?  10 : polution;
}

function elitism(){
  var elitism = parseInt($("#elitism").val());
  return _.isNaN(elitism)  ?  20 : elitism; 
}

function showAlives(){
  if(_.isArray(window.timers)) 
        _.each(window.timers, clearInterval); 

  $(".alive, .new, .selecting, .selected, .egg")
    .removeClass("alive").removeClass("new").removeClass("egg")
    .removeClass("selecting").removeClass("selected");

  var pop = window.ga.population;
  _.each(pop, function(c){
    selectByPosition(c).addClass("alive");
  });     
  
  if(_.isArray(pop)){
    $("#bfitness").text(pop[0].fitness());
    $("#wfitness").text(pop[pop.length-1].fitness())
    $("#pop").text(pop.length)
    $("#elitists").text(window.ga.elitism())
    $("#muts").text(window.ga.mutation())
  }
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

function dotClass(x, y, range, klass){
  positions = [];
  for(var i = y-range; i <= y+range+1; i++)
    for(var j = x-range; j <= x+range+1; j++)
          positions.push("[data-x='"+j+"'][data-y='"+i+"']")
  $(positions.join(",")).addClass(klass);
}
function dangerDot(x, y, inc){
  var range = 0;
  var classes = window.dangerClasses;
  for(var i = 0; i < classes.length; i++){
    dotClass(x, y, range, classes[i]);
    range+=inc;
  }
}

function dangerRange(property){
  var total = 0; 
  var classes = window.dangerClasses;
  for(var i = 1; i <= classes.length; i++){
    var klass =  classes[classes.length-i];
    total += $("."+klass+property).length*i;  
  }
  return total;
}

function startUp(){
    window.world = new World();
    window.dangerClasses = ["dead", "almost-dead", "danger", "take-care", "warning", "soft-warning"];
    var height = window.world.height;
    var width = window.world.width;
    var pol = polution();
    if(pol > 0){
      for(var i = 0; i < 3; i++){
      dangerDot(
        _.random(width),
        _.random(height),
        parseInt(_.random(height < width ? height : width)*pol/100) );
      }
    } 


    window.ga = new GA({
      elitismPercent: elitism(),
      mutationPercent: mutation(),
      populationSize: populationSize(),
      generateFirstGen: true,
      chromosomesToEvolve: { 
        x: function(citizen, chromosome, value){
          return dangerRange("[data-x='"+citizen.x+"']") 
          + $(".alive[data-x='"+citizen.x+"'][data-y='"+citizen.y+"']").length*10 - 10;
        },
        y: function(citizen, chromosome, value){
          return dangerRange("[data-y='"+citizen.y+"']") 
          + $(".alive[data-x='"+citizen.x+"'][data-y='"+citizen.y+"']").length*10 - 10;
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
     showAlives()
  });
  $("#reset").click();


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
    var speed = animationSpeed();
    domChild.switchClass("", "new", speed).switchClass("new","egg", speed).switchClass("egg", "new", speed);
  }

  $("#evolve").on("click", function(){
    showAlives()
 
    if(_.isArray(window.timers)) 
      _.each(window.timers, clearInterval);
    window.ga.evolve(print, print, function(params){
      var speed = animationSpeed();
      var i = 0,
      timer = setInterval(callFuncs, speed);

      window.timers = window.timers || [];
      window.timers.push(timer);

      function callFuncs() {
        var index = i++;
          print(params[index]["c1"], params[index]["c2"], params[index]["child"]);
          if (i === params.length){
            clearInterval(timer);
            showAlives();
          } 
      }
    });
  });

});
