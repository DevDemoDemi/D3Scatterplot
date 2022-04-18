$(document).ready(function () {
    req = new XMLHttpRequest();
    req.open("GET", './cyclist-data.json', true);
    req.send();
    req.onload = function () {
        json = JSON.parse(req.responseText)

        function time(d) {
            let [min, sec] = d.split(':')
            return new Date(2000, 0, 1, 0, parseInt(min), parseInt(sec))
        }

        let dataset = json.map(obj=> {
            let data = {time: time(obj['Time']), year: obj['Year'], secs: obj['Seconds']}
            return data
        })
        const xDate = d => d.year

        let year = dataset.map(obj => obj.year)
        year.sort((a,b) => a-b)

        const yVal = d => d.time

        const w = 1200

        const h = 600

        const padding = 50

        const svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h)

        const tooltip = d3.select('.tooltip')
            .append('div')
            .attr('id', 'tooltip')

        const xScale = d3.scaleBand()
            .domain(year)
            .range([padding, w-padding])

        const yScale = d3.scaleTime()
            .domain([new Date(2000, 0, 1, 0, 40, 0), new Date(2000, 0, 1, 0, 36, 30)])
            .range([h-padding, padding])
        
        const timeFormat = d3.timeFormat('%M:%S')

        svg.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('r', 3)
            .attr('cx', (d)=>xScale(xDate(d)) + padding)
            .attr('cy', (d)=>yScale(yVal(d)))
            .attr('class', 'dot')
            .attr('data-xvalue', (d) => xDate(d))
            .attr('data-yvalue', (d)=> d.time)
            .on('mouseover', (d) => {
                tooltip.text(`${d.year}` + ', ' + `${d.time}`)
                .attr('data-year', d.year)
                .style('opacity', '1')
            })
            .on('mouseout', (d) => {
                tooltip.style('opacity', '0')
            })
            .attr('fill', (d)=>{
                let color = '';
                if (d.secs >= 2340) {
                    color = 'red'
                } else if (d.secs < 2340 && d.secs >= 2280) {
                    color = 'blue'
                } else if (d.secs < 2280 && d.secs >= 2220) {
                    color = 'orange'
                } else {
                    color = 'green'
                }
                return color
            })
            // .append('title')
            // .text((d) => d.year)
            // .attr('id', 'tooltip')

        const xAxis = d3.axisBottom(xScale)
            // .tickFormat(d3.format('d'))

        const yAxis = d3.axisLeft(yScale)
                .tickFormat(timeFormat)

        svg.append('g')
            .attr('transform', 'translate(0,' + (h-padding) + ')')
            .call(xAxis)
            .attr('id', 'x-axis')

        svg.append('g')
            .attr('transform', 'translate(' + padding + ',0)')
            .call(yAxis)
            .attr('id', 'y-axis')


    }
})