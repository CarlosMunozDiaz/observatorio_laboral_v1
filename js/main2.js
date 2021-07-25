let tooltip = d3.select('#chartTooltip');
let charts = document.getElementsByClassName('chart__viz');

function getFirstChart() {
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
        alert("Entra5.6-3");

        //Creación del elemento SVG en el contenedor
        let margin = {top: 5, right: 5, bottom: 25, left: 35};
        let {width, height, chart} = setChart(chartBlock, margin);

        //Disposición del eje X
        let x = d3.scaleBand()
            .domain(data.map(function(d) { return d.Fecha }))
            .range([0, width])
            .paddingInner(0.25);

        //Estilos para eje X
        let xAxis = function(g){
            g.call(d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){
                let each = 4;
                if(window.innerWidth < 575) { 
                    each = 8
                } 
                return !(i%each)})))
            g.call(function(g){
                g.selectAll('.tick line')
                    .attr('y1', '0%')
                    .attr('y2', `-${height}`)
            })
            g.call(function(g){g.select('.domain').remove()});
        }
        
        //Inicialización eje X
        chart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //Disposición del eje Y
        let y = d3.scaleLinear()
            .domain([-10,10])
            .range([height,0])
            .nice();
    
        let yAxis = function(svg){
            svg.call(d3.axisLeft(y).tickFormat(function(d) { return d + '%'; }))
            svg.call(function(g){
                g.selectAll('.tick line')
                    .attr('class', function(d,i) {
                        if (d == 0) {
                            return 'line-special';
                        }
                    })
                    .attr("x1", `${x.bandwidth() / 2}`)
                    .attr("x2", `${width - x.bandwidth() / 2}`)
            })
            svg.call(function(g){g.select('.domain').remove()})
        }        
        
        chart.append("g")
            .call(yAxis);

        //Inicialización de barras
        function initChart() {
            chart.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr('class', function(d, i) { return `bar bar-${i}`; })
                .style('fill', '#081C29')
                .attr('x', function(d) { return x(d.Fecha) + x.bandwidth() / 2; })
                .attr('width', x.bandwidth() / 2)
                .attr("y", function(d) { return y(0); })
                .on('touchstart touchmove mouseenter mousemove pointerenter pointermove', function(d, i, e) {
                    let css = e[i].getAttribute('class').split('-')[1];
                    
                    //Texto
                    let html = `<p class="chart__tooltip--title">${d.Fecha}</p><p class="chart__tooltip--text"><p>`;
                    tooltip.html(html);

                    //Posibilidad visualización línea diferente
                    let bars = chartBlock.selectAll('.bar');                    
                
                    bars.each(function() {
                        this.style.opacity = '0.4';
                        let split = this.getAttribute('class').split(" ")[1];
                        if(split == `bar-${css}`) {
                            this.style.opacity = '1';
                        }
                    });
                
                    //Tooltip
                    positionTooltip(window.event, tooltip);
                    getInTooltip(tooltip);
                })
                .on('touchend mouseout', function(d, i, e) {
                    //Quitamos los estilos de la línea
                    let bars = chartBlock.selectAll('.bar');
                    bars.each(function() {
                        this.style.opacity = '1';
                    });
                
                    //Quitamos el tooltip
                    getOutTooltip(tooltip); 
                })
                .transition()
                .duration(3000)
                .attr("y", function(d) { return y(Math.max(0, d['América Latina y Caribe'])); })     
                .attr('height', d => Math.abs(y(d['América Latina y Caribe']) - y(0)));
        }

        chartBlock.node().classList.add('visible');
        initChart();
    });
}

getFirstChart();

/* Inicialización del gráfico */
function setChart(chartBlock, margin) {
    let width = parseInt(chartBlock.style('width')) - margin.left - margin.right,
    height = parseInt(chartBlock.style('height')) - margin.top - margin.bottom;

    let chart = chartBlock
        .append('svg')
        .lower()
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return {margin, width, height, chart};
}

/* Helper */
// function numberWithCommas(x) {
//     return x.toString().replace(/\./g, ',').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
// }

/*
* FUNCIONES TOOLTIP
*/
function getInTooltip(tooltip) {
    tooltip.style('display','block').style('opacity', 1);
}

function getOutTooltip(tooltip) {
    tooltip.transition().style('display','none').style('opacity', 0);
}

function positionTooltip(event, tooltip) {
    let x = event.pageX || window.event.pageX;
    let y = event.pageY || window.event.pageY;

    //Tamaño
    let ancho = parseInt(tooltip.style('width'));
    
    let distanciaAncho = isNaN(ancho) ? 100 : ancho;

    //Posición
    let left = window.innerWidth / 2 > x ? 'left' : 'right';
    let mobile = window.innerWidth < 525 ? -40 : 40;
    let horizontalPos = left == 'left' ? 20 : - distanciaAncho + mobile;

    tooltip.style('top', y + 17 + 'px');
    tooltip.style('left', (x + horizontalPos) + 'px');
}