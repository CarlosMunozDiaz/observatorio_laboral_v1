let tooltip = d3.select('#chartTooltip');
let charts = document.getElementsByClassName('chart__viz');

function getOut() {
    //Bloque de la visualización
    let chartBlock = d3.select('#chart-one');
    
    //Lectura de datos
    let file = './data/chart-one.csv';
    d3.csv(file, function(d) {
        return {
            Fecha: d.Year,
            'América Latina y Caribe': +d['LAC'].replace(/,/g, '.')
        }
    }, function(error, data) {
        if (error) throw alert(error);
        alert(data);
    });
}

getOut();