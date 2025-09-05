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

        // Download buttons
        document.getElementById('download-svg').addEventListener('click', () => {
            this.downloadSVG();
        });

        document.getElementById('download-pdf').addEventListener('click', () => {
            this.downloadPDF();
        });
    }

    selectStandardSize(button) {
        try {
            // Clear previous selections
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('selected');
            });

            // Select current button
            button.classList.add('selected');

            // Get the dimensions from the button
            const width = parseFloat(button.dataset.width);
            const height = parseFloat(button.dataset.height);
            
            console.log('Selected envelope size:', { width, height, name: button.dataset.name });
            
            // Generate template directly
            this.generateTemplateFromDimensions(width, height);
        } catch (error) {
            console.error('Error selecting standard size:', error);
            alert('Error generating template. Please try again.');
        }
    }

    generateTemplateFromDimensions(width, height) {
        try {
            // Validate dimensions
            if (!width || !height || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
                console.error('Invalid dimensions:', { width, height });
                alert('Invalid envelope dimensions. Please try again.');
                return;
            }

            // Use default flap height for now
            const flapHeight = 1.5;

            this.currentTemplate = this.createEnvelopeTemplate(width, height, flapHeight);
            this.showPreview();
        } catch (error) {
            console.error('Error generating template:', error);
            alert('Error generating template. Please try again.');
        }
    }

    createEnvelopeTemplate(width, height, flapHeight) {
        // Validate all parameters
        if (!width || !height || !flapHeight || 
            isNaN(width) || isNaN(height) || isNaN(flapHeight) ||
            width <= 0 || height <= 0 || flapHeight <= 0) {
            console.error('Invalid template parameters:', { width, height, flapHeight });
            throw new Error('Invalid template parameters');
        }

        // Convert inches to pixels (72 DPI for print quality)
        const dpi = 72;
        const pixelWidth = width * dpi;
        const pixelHeight = height * dpi;
        const pixelFlapHeight = flapHeight * dpi;

        // Validate pixel dimensions
        if (isNaN(pixelWidth) || isNaN(pixelHeight) || isNaN(pixelFlapHeight)) {
            console.error('Invalid pixel dimensions:', { pixelWidth, pixelHeight, pixelFlapHeight });
            throw new Error('Invalid pixel dimensions');
        }

        // Calculate template dimensions (envelope size + flaps)
        const sideFlapDepth = pixelFlapHeight / 2; // Half depth for side flaps
        const topFlapDepth = pixelFlapHeight; // Full depth for top flap
        const totalWidth = pixelWidth + (2 * sideFlapDepth); // Left and right flaps (half depth)
        const totalHeight = pixelHeight + topFlapDepth + sideFlapDepth; // Top flap (full) + bottom flap (half)

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
            .fold-line { stroke: #666; stroke-width: 0.5; fill: none; stroke-dasharray: 8,4; }
            .envelope-body { fill: none; stroke: #000; stroke-width: 1; }
            .label-text { font-family: Arial, sans-serif; font-size: 12px; fill: #666; }
        `;
        defs.appendChild(style);
        svg.appendChild(defs);

        // Calculate positions
        const centerX = totalWidth / 2;
        const centerY = totalHeight / 2;

        // Create the cut lines (perimeter with flaps) - goes behind score lines
        this.createCutLines(svg, pixelWidth, pixelHeight, pixelFlapHeight, centerX);

        // Create score line rectangle (the envelope size) - goes on top
        const scoreRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        scoreRect.setAttribute('x', sideFlapDepth + 0.5);
        scoreRect.setAttribute('y', topFlapDepth + 0.5);
        scoreRect.setAttribute('width', pixelWidth);
        scoreRect.setAttribute('height', pixelHeight);
        scoreRect.setAttribute('stroke', '#000');
        scoreRect.setAttribute('stroke-linecap', 'round');
        scoreRect.setAttribute('stroke-dasharray', '2 4');
        scoreRect.setAttribute('fill', 'none');
        svg.appendChild(scoreRect);

        // Add labels
        const labels = [
            { text: `${width}" × ${height}" envelope`, x: centerX, y: centerY, anchor: 'middle' }
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

        return {
            svg: svg,
            width: width,
            height: height,
            flapHeight: flapHeight,
            totalWidth: totalWidth / dpi,
            totalHeight: totalHeight / dpi
        };
    }

    createCutLines(svg, pixelWidth, pixelHeight, pixelFlapHeight, centerX) {
        // Create the cut lines (perimeter with flaps) as a single solid path
        const cutPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Calculate flap depths
        const topFlapDepth = pixelFlapHeight; // Full depth for top flap
        const sideFlapDepth = pixelFlapHeight / 2; // Half depth for side/bottom flaps
        
        // Calculate the score rectangle corners (where we start and end)
        const scoreLeft = sideFlapDepth;
        const scoreTop = topFlapDepth;
        const scoreRight = scoreLeft + pixelWidth;
        const scoreBottom = scoreTop + pixelHeight;
        
        // Build the cut path:
        // Start at upper left corner of score line
        let cutPathData = `M ${scoreLeft} ${scoreTop}`;
        
        // Top flap (rectangular, full depth)
        cutPathData += ` L ${scoreLeft} ${scoreTop - topFlapDepth}`; // Up to top edge
        cutPathData += ` L ${scoreRight} ${scoreTop - topFlapDepth}`; // Across to top right
        cutPathData += ` L ${scoreRight} ${scoreTop}`; // Back to upper right corner of score line
        
        // Right flap (rectangular, half depth)
        cutPathData += ` L ${scoreRight + sideFlapDepth} ${scoreTop}`; // Out to right edge
        cutPathData += ` L ${scoreRight + sideFlapDepth} ${scoreBottom}`; // Down to bottom
        cutPathData += ` L ${scoreRight} ${scoreBottom}`; // Back to lower right corner of score line
        
        // Bottom flap (rectangular, half depth)
        cutPathData += ` L ${scoreRight} ${scoreBottom + sideFlapDepth}`; // Down to bottom edge
        cutPathData += ` L ${scoreLeft} ${scoreBottom + sideFlapDepth}`; // Across to left
        cutPathData += ` L ${scoreLeft} ${scoreBottom}`; // Back to lower left corner of score line
        
        // Left flap (rectangular, half depth)
        cutPathData += ` L ${scoreLeft - sideFlapDepth} ${scoreBottom}`; // Out to left edge
        cutPathData += ` L ${scoreLeft - sideFlapDepth} ${scoreTop}`; // Up to top
        cutPathData += ` L ${scoreLeft} ${scoreTop}`; // Back to upper left corner of score line
        
        // Close the path
        cutPathData += ` Z`;
        
        cutPath.setAttribute('d', cutPathData);
        cutPath.setAttribute('stroke', '#000');
        cutPath.setAttribute('stroke-width', '1');
        cutPath.setAttribute('fill', 'none');
        
        // Add the cut path to the SVG (this will be behind the score lines)
        svg.appendChild(cutPath);
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