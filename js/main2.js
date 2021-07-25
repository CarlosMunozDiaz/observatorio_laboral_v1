let tooltip = d3.select('#chartTooltip');
let charts = document.getElementsByClassName('chart__viz');

function getOut() {
    alert("Entra 2");
    alert(charts[0]);
    alert(tooltip);
}

getOut();