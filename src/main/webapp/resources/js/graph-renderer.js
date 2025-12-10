function createGraph() {
    console.log('создаю график');
    const container = document.getElementById('graphContainer');
    if (!container) return;

    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '400');
    svg.setAttribute('id', 'areaGraph');
    svg.style.cursor = 'crosshair';
    svg.style.border = '2px solid #ddd';
    svg.style.borderRadius = '8px';
    svg.style.background = '#f9f9f9';

    // оси
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '0'); xAxis.setAttribute('y1', '200');
    xAxis.setAttribute('x2', '400'); xAxis.setAttribute('y2', '200');
    xAxis.setAttribute('stroke', 'black'); xAxis.setAttribute('stroke-width', '2');
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '200'); yAxis.setAttribute('y1', '0');
    yAxis.setAttribute('x2', '200'); yAxis.setAttribute('y2', '400');
    yAxis.setAttribute('stroke', 'black'); yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);

    // стрелки
    const xArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    xArrow.setAttribute('points', '395,200 385,195 385,205');
    xArrow.setAttribute('fill', 'black'); svg.appendChild(xArrow);

    const yArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    yArrow.setAttribute('points', '200,5 195,15 205,15');
    yArrow.setAttribute('fill', 'black'); svg.appendChild(yArrow);

    // подписи осей
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.textContent = 'X'; xLabel.setAttribute('x', '390'); xLabel.setAttribute('y', '190');
    xLabel.setAttribute('style', 'font: 14px Arial'); svg.appendChild(xLabel);

    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.textContent = 'Y'; yLabel.setAttribute('x', '210'); yLabel.setAttribute('y', '15');
    yLabel.setAttribute('style', 'font: 14px Arial'); svg.appendChild(yLabel);

    // подписи значений
    const labels = [
        {id: 'labelMinusR', x: 100, y: 215, text: '-R', anchor: 'middle'},
        {id: 'labelR', x: 300, y: 215, text: 'R', anchor: 'middle'},
        {id: 'labelTopR', x: 185, y: 100, text: 'R', anchor: 'end'},
        {id: 'labelBottomMinusR', x: 185, y: 300, text: '-R', anchor: 'end'},
        {id: 'labelMinusR2', x: 150, y: 235, text: '-R/2', anchor: 'middle', small: true},
        {id: 'labelR2', x: 250, y: 235, text: 'R/2', anchor: 'middle', small: true},
        {id: 'labelTopR2', x: 170, y: 150, text: 'R/2', anchor: 'end', small: true},
        {id: 'labelBottomMinusR2', x: 170, y: 250, text: '-R/2', anchor: 'end', small: true}
    ];

    labels.forEach(label => {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.textContent = label.text;
        textEl.setAttribute('x', label.x);
        textEl.setAttribute('y', label.y);

        // Стили с цветом
        const fontSize = label.small ? '10px' : '12px';
        const fillColor = label.small ? '#666666' : '#000000';
        textEl.setAttribute('style', `font: ${fontSize} Arial; fill: ${fillColor};`);

        textEl.setAttribute('text-anchor', label.anchor);
        if (label.id) textEl.id = label.id;
        svg.appendChild(textEl);
    });

    // фигуры (области)
    const quarterCircle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    quarterCircle.setAttribute('d', 'M200,150 A50,50 0 0,0 150,200 L200, 200 Z');
    quarterCircle.setAttribute('class', 'figure');
    quarterCircle.setAttribute('fill', '#3498db');
    quarterCircle.setAttribute('fill-opacity', '0.3');
    quarterCircle.setAttribute('stroke', '#2980b9');
    quarterCircle.setAttribute('stroke-width', '1.5');
    svg.appendChild(quarterCircle);

    const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    square.setAttribute('x', '200');
    square.setAttribute('y', '100');
    square.setAttribute('width', '100');
    square.setAttribute('height', '100');
    square.setAttribute('class', 'figure');
    square.setAttribute('fill', '#3498db');
    square.setAttribute('fill-opacity', '0.3');
    square.setAttribute('stroke', '#2980b9');
    square.setAttribute('stroke-width', '1.5');
    svg.appendChild(square);

    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    triangle.setAttribute('points', '200,200 300,200 200,250');
    triangle.setAttribute('class', 'figure');
    triangle.setAttribute('fill', '#3498db');
    triangle.setAttribute('fill-opacity', '0.3');
    triangle.setAttribute('stroke', '#2980b9');
    triangle.setAttribute('stroke-width', '1.5');
    svg.appendChild(triangle);

    container.appendChild(svg);
    console.log('график создан');
}