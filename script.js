class EnvelopeGenerator {
    constructor() {
        this.currentTemplate = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Standard size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectStandardSize(e.target);
            });
        });

        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateTemplate();
        });

        // Download buttons
        document.getElementById('download-svg').addEventListener('click', () => {
            this.downloadSVG();
        });

        document.getElementById('download-pdf').addEventListener('click', () => {
            this.downloadPDF();
        });

        // Input validation
        const inputs = document.querySelectorAll('#width, #height, #flap-height');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearStandardSelection();
            });
        });
    }

    selectStandardSize(button) {
        // Clear previous selections
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Select current button
        button.classList.add('selected');

        // Fill in the dimensions
        const width = parseFloat(button.dataset.width);
        const height = parseFloat(button.dataset.height);
        
        document.getElementById('width').value = width;
        document.getElementById('height').value = height;
        
        // Auto-generate template
        this.generateTemplate();
    }

    clearStandardSelection() {
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    generateTemplate() {
        const width = parseFloat(document.getElementById('width').value);
        const height = parseFloat(document.getElementById('height').value);
        const flapHeight = parseFloat(document.getElementById('flap-height').value) || 1.5;

        if (!width || !height || width <= 0 || height <= 0) {
            alert('Please enter valid width and height dimensions.');
            return;
        }

        this.currentTemplate = this.createEnvelopeTemplate(width, height, flapHeight);
        this.showPreview();
    }

    createEnvelopeTemplate(width, height, flapHeight) {
        // Convert inches to pixels (72 DPI for print quality)
        const dpi = 72;
        const pixelWidth = width * dpi;
        const pixelHeight = height * dpi;
        const pixelFlapHeight = flapHeight * dpi;

        // Calculate total template dimensions
        // The template includes the envelope body plus flaps on all sides
        const totalWidth = pixelWidth + (2 * pixelFlapHeight); // Left and right flaps
        const totalHeight = pixelHeight + (2 * pixelFlapHeight); // Top and bottom flaps

        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', totalWidth);
        svg.setAttribute('height', totalHeight);
        svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        // Define styles
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
            .cut-line { stroke: #000; stroke-width: 1; fill: none; }
            .fold-line { stroke: #000; stroke-width: 0.5; fill: none; stroke-dasharray: 3,3; }
            .envelope-body { fill: none; stroke: #000; stroke-width: 1; }
            .label-text { font-family: Arial, sans-serif; font-size: 12px; fill: #666; }
        `;
        defs.appendChild(style);
        svg.appendChild(defs);

        // Calculate positions
        const centerX = totalWidth / 2;
        const centerY = totalHeight / 2;
        const bodyLeft = pixelFlapHeight;
        const bodyTop = pixelFlapHeight;
        const bodyRight = bodyLeft + pixelWidth;
        const bodyBottom = bodyTop + pixelHeight;

        // Main envelope body (rectangle)
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        body.setAttribute('x', bodyLeft);
        body.setAttribute('y', bodyTop);
        body.setAttribute('width', pixelWidth);
        body.setAttribute('height', pixelHeight);
        body.setAttribute('class', 'envelope-body');
        svg.appendChild(body);

        // Top flap (triangular)
        const topFlap = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const topFlapPoints = [
            [bodyLeft, bodyTop],
            [centerX, bodyTop - pixelFlapHeight],
            [bodyRight, bodyTop]
        ].map(point => point.join(',')).join(' ');
        topFlap.setAttribute('points', topFlapPoints);
        topFlap.setAttribute('class', 'cut-line');
        svg.appendChild(topFlap);

        // Bottom flap (rectangular)
        const bottomFlap = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bottomFlap.setAttribute('x', bodyLeft);
        bottomFlap.setAttribute('y', bodyBottom);
        bottomFlap.setAttribute('width', pixelWidth);
        bottomFlap.setAttribute('height', pixelFlapHeight);
        bottomFlap.setAttribute('class', 'cut-line');
        svg.appendChild(bottomFlap);

        // Left flap (rectangular)
        const leftFlap = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        leftFlap.setAttribute('x', 0);
        leftFlap.setAttribute('y', bodyTop);
        leftFlap.setAttribute('width', pixelFlapHeight);
        leftFlap.setAttribute('height', pixelHeight);
        leftFlap.setAttribute('class', 'cut-line');
        svg.appendChild(leftFlap);

        // Right flap (rectangular)
        const rightFlap = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rightFlap.setAttribute('x', bodyRight);
        rightFlap.setAttribute('y', bodyTop);
        rightFlap.setAttribute('width', pixelFlapHeight);
        rightFlap.setAttribute('height', pixelHeight);
        rightFlap.setAttribute('class', 'cut-line');
        svg.appendChild(rightFlap);

        // Fold lines
        // Vertical fold lines (left and right edges of main body)
        const leftFoldLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftFoldLine.setAttribute('x1', bodyLeft);
        leftFoldLine.setAttribute('y1', 0);
        leftFoldLine.setAttribute('x2', bodyLeft);
        leftFoldLine.setAttribute('y2', totalHeight);
        leftFoldLine.setAttribute('class', 'fold-line');
        svg.appendChild(leftFoldLine);

        const rightFoldLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightFoldLine.setAttribute('x1', bodyRight);
        rightFoldLine.setAttribute('y1', 0);
        rightFoldLine.setAttribute('x2', bodyRight);
        rightFoldLine.setAttribute('y2', totalHeight);
        rightFoldLine.setAttribute('class', 'fold-line');
        svg.appendChild(rightFoldLine);

        // Horizontal fold lines (top and bottom edges of main body)
        const topFoldLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        topFoldLine.setAttribute('x1', 0);
        topFoldLine.setAttribute('y1', bodyTop);
        topFoldLine.setAttribute('x2', totalWidth);
        topFoldLine.setAttribute('y2', bodyTop);
        topFoldLine.setAttribute('class', 'fold-line');
        svg.appendChild(topFoldLine);

        const bottomFoldLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        bottomFoldLine.setAttribute('x1', 0);
        bottomFoldLine.setAttribute('y1', bodyBottom);
        bottomFoldLine.setAttribute('x2', totalWidth);
        bottomFoldLine.setAttribute('y2', bodyBottom);
        bottomFoldLine.setAttribute('class', 'fold-line');
        svg.appendChild(bottomFoldLine);

        // Add labels
        const labels = [
            { text: 'TOP', x: centerX, y: bodyTop - pixelFlapHeight/2 + 5, anchor: 'middle' },
            { text: `${width}" × ${height}" envelope`, x: centerX, y: centerY, anchor: 'middle' },
            { text: 'fold', x: totalWidth - 30, y: 15, anchor: 'start', class: 'fold-line' }
        ];

        labels.forEach(label => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', label.x);
            text.setAttribute('y', label.y);
            text.setAttribute('text-anchor', label.anchor);
            text.setAttribute('class', 'label-text');
            text.textContent = label.text;
            svg.appendChild(text);
        });

        // Add fold line legend
        const legendLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        legendLine.setAttribute('x1', totalWidth - 80);
        legendLine.setAttribute('y1', 10);
        legendLine.setAttribute('x2', totalWidth - 40);
        legendLine.setAttribute('y2', 10);
        legendLine.setAttribute('class', 'fold-line');
        svg.appendChild(legendLine);

        return {
            svg: svg,
            width: width,
            height: height,
            flapHeight: flapHeight,
            totalWidth: totalWidth / dpi,
            totalHeight: totalHeight / dpi
        };
    }

    showPreview() {
        const previewSection = document.getElementById('preview-section');
        const svgPreview = document.getElementById('svg-preview');
        const templateInfo = document.getElementById('template-dimensions');

        // Clear previous preview
        svgPreview.innerHTML = '';
        
        // Add new SVG
        svgPreview.appendChild(this.currentTemplate.svg);

        // Update template info
        templateInfo.innerHTML = `
            Envelope: ${this.currentTemplate.width}" × ${this.currentTemplate.height}" | 
            Flap Height: ${this.currentTemplate.flapHeight}" | 
            Total Template: ${this.currentTemplate.totalWidth.toFixed(2)}" × ${this.currentTemplate.totalHeight.toFixed(2)}"
        `;

        // Show preview section
        previewSection.style.display = 'block';
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }

    downloadSVG() {
        if (!this.currentTemplate) {
            alert('Please generate a template first.');
            return;
        }

        const svgData = new XMLSerializer().serializeToString(this.currentTemplate.svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `envelope-${this.currentTemplate.width}x${this.currentTemplate.height}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadPDF() {
        if (!this.currentTemplate) {
            alert('Please generate a template first.');
            return;
        }

        const { jsPDF } = window.jspdf;
        
        // Create PDF in landscape orientation to fit the template better
        const pdf = new jsPDF({
            orientation: this.currentTemplate.totalWidth > this.currentTemplate.totalHeight ? 'landscape' : 'portrait',
            unit: 'in',
            format: [this.currentTemplate.totalWidth, this.currentTemplate.totalHeight]
        });

        // Convert SVG to canvas, then to PDF
        const svgData = new XMLSerializer().serializeToString(this.currentTemplate.svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, this.currentTemplate.totalWidth, this.currentTemplate.totalHeight);
            pdf.save(`envelope-${this.currentTemplate.width}x${this.currentTemplate.height}.pdf`);
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnvelopeGenerator();
});