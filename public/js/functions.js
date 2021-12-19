// Load the Visualization API and the corechart package.
 google.charts.load('current', {'packages':['corechart']});

 // Set a callback to run when the Google Visualization API is loaded.
 google.charts.setOnLoadCallback(drawChartDemo);

 function drawChartDemo() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Emoción');
    data.addColumn('number', 'Porcentaje');

    data.addRows([
        ["enojo",12.5],
        ["desprecio",12.5],
        ["disgusto",12.5],
        ["miedo",12.5],
        ["felicidad",12.5],
        ["neutral",12.5],
        ["tristeza",12.5],
        ["sorpresa",12.5]
    ]);

    // Set chart options
    var options = {'title':'Sentimientos',
                   'width':470,
                   'height':470,
                   'pieHole': 0.4,
                   'backgroundColor': 'transparent',
                   'chartArea':{left:20,top:0,width:'100%',height:'100%'},
                   'fontSize': 24,
                   'color': '#FFF',
                   'pieSliceText': 'label',
                   'legend': { position: 'none'}
                 };
 
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

 // Callback that creates and populates a data table,
 // instantiates the pie chart, passes in the data and
 // draws it.
 function drawChart(data) {
   // Set chart options
   var options = {'title':'Sentimientos',
                  'width':470,
                  'height':470,
                  'pieHole': 0.4,
                  'backgroundColor': 'transparent',
                  'chartArea':{left:20,top:0,width:'100%',height:'100%'},
                  'fontSize': 24,
                  'color': '#FFF',
                  'pieSliceText': 'label',
                  'legend': { position: 'none'}
                };

   // Instantiate and draw our chart, passing in some options.
   var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
   chart.draw(data, options);
 }

function prepareData(j){
    emotions = {"anger": "enojo", 
    "contempt": "desprecio", 
    "disgust": "disgusto", 
    "fear": "miedo", 
    "happiness": "felicidad", 
    "neutral": "neutral", 
    "sadness": "tristeza", 
    "surprise": "sorpresa"};

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Emoción');
    data.addColumn('number', 'Porcentaje');
    values = {};
    people_count = 0;
    for(key in j){
        person = j[key];
        for(emo in person){
            if(!values[emotions[emo]]){
                values[emotions[emo]] = 0;
            }
            values[emotions[emo]] += person[emo];
        }
        people_count++;
    }

    table = []
    for(key in values){
        table.push([ key,  (values[key] / people_count) * 100 ]) ;
    } 
    
    if(values["felicidad"]+values["sorpresa"] > 0.7)
        $("#msgres").text("¡Felicidades, tu regalo causo un excelente recibimiento!");
    else if(values["felicidad"]+values["sorpresa"] <= 0.7 && values["felicidad"]+values["sorpresa"] >= 0.5)
        $("#msgres").text("Tu regalo no fue bien recibido");
    else
        $("#msgres").text("Lo lamentamos, tu regalo no causo el impacto esperado");
    data.addRows(table);
    return data;
}

$(document).ready(function() {
    
    $("#adjBtn").click(function(){
        $("#myFile").click();
    });

    $("#subBtn").click(function(){
        var fd = new FormData();
        var files = $('#myFile')[0].files;

        if( files.length > 0)
        {
            fd.append("filename", files[0]);
            $.ajax({
                url: "https://faceemotion.azurewebsites.net/api/HttpTrigger1?code=kaAxIQx9cY937Ek11TAiPO00jnqCyBQrGcr2Erfn70RmaErGUe8Naw==",
                type: "POST",
                data: fd,
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'text json',
                success: function(response){
                    data = prepareData(response);
                    drawChart(data);
                },
                error: function(response){
                    console.log("error");
                    prepareData(response);
                }
              });
        }
    });      

    $("#myFile").change(function(){
        console.log("evento change");
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById("imgProcess").src = fr.result;
        }
        f = $(this).get(0).files[0];
        fr.readAsDataURL(f);
    });
    
});