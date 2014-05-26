    queue()
    .defer(d3.csv, "metadata.csv")
    .defer(d3.json, "topics.json")
    .defer(d3.csv, "doclinks.csv")
    .await(function(error, metadataFile, topicsFile, doclinksFile) { createTMViewer(metadataFile, topicsFile, doclinksFile); });

function createTMViewer(metadata, topics, docs) {

// Global variables to find out what's wrong in the browser
  exposedMetadata = metadata;
  exposedTopics = topics;
  exposedDocs = docs;

  newTopics = [];
    
    for (x in exposedTopics.topics) {
      newTopicObj = {};
      newTopicObj.label = exposedTopics.topics[x].label;
      newTopicObj.totaltokens = exposedTopics.topics[x].totaltokens;
      newTopicObj.uniquetokens = exposedTopics.topics[x].uniquetokens;
      newTopicObj.tNumber = exposedTopics.topics[x].label.split(" ")[1]
      newTopicObj.words = [];
      newTopicObj.time = [];
      newTopicObj.docs = [];
      for (y in exposedTopics.topics[x].words) {
        newWordObj = {};
        for (z in exposedTopics.topics[x].words[y]) {
         newWordObj.text = z;
         newWordObj.percent = exposedTopics.topics[x].words[y][z];
        newTopicObj.words.push(newWordObj);
        }
      }
            
        for (x in exposedDocs) {
        if (exposedDocs[x].label == newTopicObj.label) {
          newDocObj = {};
          newDocObj.strength = parseFloat(exposedDocs[x].strength);
          newDocObj.doc = exposedDocs[x].document;
          newTopicObj.docs.push(newDocObj);
        }
      }
      
      newTopics.push(newTopicObj);
    }
    
    
    mdHash = {};
    
    for (x in metadata) {
      mdHash[metadata[x].id] = metadata[x]
    }
    
    topicGram();

}
  
  function topicGram() {
    
    d3.select("#vizcontainer").on("click", svgClick)


wordScale=d3.scale.linear().domain([0.01,0.1,0.5,1]).range([10,40,80,160]).clamp(true);
wordColor=d3.scale.linear().domain([10,40,80,160]).range(["blue","green","orange","red"]);

newTopics.sort(function (a,b) {
    if (parseInt(a.tNumber) > parseInt(b.tNumber))
    return 1;
    if (parseInt(a.tNumber) < parseInt(b.tNumber))
    return -1;
    return 0;
    });
 
 for (x in newTopics) {
 var curX = (x%10) * 220;
 var curY = (Math.floor(x/10)) * 220;
 d3.layout.cloud().size([200, 200])
      .words(newTopics[x].words)
      .rotate(function() { return ~~(Math.random() * 2) * 5; })
      .fontSize(function(d) { return wordScale(d.percent); })
      .on("end", draw)
      .start();
 
  function draw(words) {

      var thisG = d3.select("#vizcontainer").append("svg").attr("width", "250px").attr("height", "250px")
      .style("border", "1px solid gray")
      .style("margin", "5px")
      .style("float", "left").append("g").attr("class", "tmContainer")
        .attr("transform", "translate(125,125)")
        .attr("id", "topicG" + newTopics[x].label);
        
      thisG.selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("fill", function(d) { return wordColor(d.size); })
        .style("opacity", .75)
	.attr("class", "tmWord")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
        

	thisG
        .append("text")
        .data([newTopics[x]])
        .style("font-size", 20)
        .style("font-weight", 900)
        .attr("x", -25)
        .attr("y", 100)
        .text(function(d) { return d.label; })
        .style("cursor", "pointer")
        .on("click", topicClick);

	var timeG = thisG
        .insert("g", "text")
        .attr("transform", "translate(-100,120)");
        
 
  }
 }

  }
  
function topicClick(d,i) {
    svgClick();

    d3.event.stopPropagation();

    d.docs.sort(function(a,b) {
    if (parseInt((parseInt(a.doc.substr(2,2)) > 20 ? "19" : "20") + a.doc.substr(2,2)) > parseInt((parseInt(b.doc.substr(2,2)) > 20 ? "19" : "20") + b.doc.substr(2,2)))
    return 1;
    if (parseInt((parseInt(a.doc.substr(2,2)) > 20 ? "19" : "20") + a.doc.substr(2,2)) < parseInt((parseInt(b.doc.substr(2,2)) > 20 ? "19" : "20") + b.doc.substr(2,2)))
    return -1;
    return 0;
    });
    
  var newContent = "";
  newContent += "<h3>" + d.label + "</h3>"
  newContent += "<h4>Total Tokens: " + d.totaltokens + "</h4>"
  newContent += "<h4>Unique Tokens: " + d.uniquetokens + "</h4>"
  newContent += "<p style='border-top:1px gray solid;'>Examples:</p>"
  for (x in d.docs) {
    if ( mdHash[d.docs[x].doc]) {
    newContent += '<p><ul><li>"' + mdHash[d.docs[x].doc].author + '"</li>';
    newContent += "<li>" + mdHash[d.docs[x].doc].type + "</li></ul></p>";
    }
    else {
      newContent += "<p style=\"cursor:pointer;\" onclick=\"documentDetails('"+d.docs[x].doc+"','"+d.docs[x].doc+"')\">" + (parseInt(d.docs[x].doc.substr(2,2)) > 20 ? "19" : "20") + d.docs[x].doc.substr(2,2) + "<br><span style='font-weight:900;color:darkred;'>" + Math.floor(d.docs[x].strength * 100) + "%<br></span> " + d.docs[x].doc + "</p>"
    }
}
  
  d3.select("#topicDetails").style("display", "block").html(newContent)
  
}

function svgClick() {
  d3.selectAll(".modal").style("display", "none")
}

function documentDetails(docID,docTitle) {
  svgClick();
var docContent = "<p><h3>"+docTitle+"</h3><ul>" 
  for (x in exposedDocs) {
    if (exposedDocs[x].document == docID) {
      docContent += "<li>" + exposedDocs[x].label + ": " + Math.floor(exposedDocs[x].strength * 100) + "%";
    }
  }
  docContent += "</ul></p>";
  
  d3.select("#docDetails").style("display", "block").html(docContent);
}