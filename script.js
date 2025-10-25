class EnvelopeGenerator {
    constructor() {
        this.currentTemplate = null;
        this.currentFlapHeight = 1.5;
        this.currentFlapStyle = 'square';
        this.currentOverlapAmount = 0.5;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Standard size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectStandardSize(e.target);
            });
        });

        // Flap controls
        document.getElementById('flap-height').addEventListener('input', (e) => {
            this.currentFlapHeight = parseFloat(e.target.value);
            document.getElementById('flap-height-value').textContent = e.target.value + '"';
            this.regenerateTemplate();
        });

        // Flap style buttons
        document.querySelectorAll('.flap-style-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                document.querySelectorAll('.flap-style-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.closest('.flap-style-btn').classList.add('active');
                // Update current style
                this.currentFlapStyle = e.target.closest('.flap-style-btn').dataset.style;
                this.regenerateTemplate();
            });
        });

        document.getElementById('overlap-amount').addEventListener('input', (e) => {
            this.currentOverlapAmount = parseFloat(e.target.value);
            document.getElementById('overlap-amount-value').textContent = e.target.value + '"';
            this.regenerateTemplate();
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
            
            // Store current dimensions for regeneration
            this.currentWidth = width;
            this.currentHeight = height;
            
            // Generate template directly
            this.generateTemplateFromDimensions(width, height);
        } catch (error) {
            console.error('Error selecting standard size:', error);
            alert('Error generating template. Please try again.');
        }
    }

    regenerateTemplate() {
        if (this.currentWidth && this.currentHeight) {
            this.generateTemplateFromDimensions(this.currentWidth, this.currentHeight);
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

            this.currentTemplate = this.createEnvelopeTemplate(width, height, this.currentFlapHeight, this.currentFlapStyle, this.currentOverlapAmount);
            this.showPreview();
        } catch (error) {
            console.error('Error generating template:', error);
            alert('Error generating template. Please try again.');
        }
    }

    createEnvelopeTemplate(width, height, flapHeight, flapStyle, overlapAmount) {
        // Validate all parameters
        if (!width || !height || !flapHeight || !flapStyle || !overlapAmount ||
            isNaN(width) || isNaN(height) || isNaN(flapHeight) || isNaN(overlapAmount) ||
            width <= 0 || height <= 0 || flapHeight <= 0 || overlapAmount <= 0) {
            console.error('Invalid template parameters:', { width, height, flapHeight, flapStyle, overlapAmount });
            throw new Error('Invalid template parameters');
        }

        // Convert inches to pixels (72 DPI for print quality)
        const dpi = 72;
        const pixelWidth = width * dpi;
        const pixelHeight = height * dpi;
        const pixelFlapHeight = flapHeight * dpi;
        const pixelOverlapAmount = overlapAmount * dpi;

        // Validate pixel dimensions
        if (isNaN(pixelWidth) || isNaN(pixelHeight) || isNaN(pixelFlapHeight) || isNaN(pixelOverlapAmount)) {
            console.error('Invalid pixel dimensions:', { pixelWidth, pixelHeight, pixelFlapHeight, pixelOverlapAmount });
            throw new Error('Invalid pixel dimensions');
        }

        // Calculate template dimensions with proper overlap
        // Side flaps should be half the envelope width plus overlap for proper sealing
        // But limit the overlap to prevent excessive template sizes
        const maxOverlap = pixelWidth * 0.5; // Limit overlap to 50% of envelope width
        const limitedOverlap = Math.min(pixelOverlapAmount, maxOverlap);
        const sideFlapDepth = (pixelWidth / 2) + limitedOverlap; // Half width + limited overlap
        const topFlapDepth = pixelFlapHeight; // Full depth for top flap
        const bottomFlapDepth = pixelFlapHeight / 2; // Half depth for bottom flap
        
        // Calculate extra space needed for pointed/rounded flaps
        let extraTopSpace = 0;
        let extraBottomSpace = 0;
        let extraLeftSpace = 0;
        let extraRightSpace = 0;
        
        if (flapStyle === 'pointed') {
            extraTopSpace = topFlapDepth * 0.3; // 30% extra for pointed tip
            extraBottomSpace = bottomFlapDepth * 0.3; // 30% extra for pointed tip
            extraLeftSpace = sideFlapDepth * 0.3; // 30% extra for pointed tip
            extraRightSpace = sideFlapDepth * 0.3; // 30% extra for pointed tip
        } else if (flapStyle === 'rounded') {
            extraTopSpace = topFlapDepth * 0.2; // 20% extra for rounded curve
            extraBottomSpace = bottomFlapDepth * 0.2; // 20% extra for rounded curve
            extraLeftSpace = sideFlapDepth * 0.2; // 20% extra for rounded curve
            extraRightSpace = sideFlapDepth * 0.2; // 20% extra for rounded curve
        }
        
        // Total template size includes the envelope plus flaps plus extra space for pointed/rounded shapes
        const totalWidth = sideFlapDepth + pixelWidth + sideFlapDepth + extraLeftSpace + extraRightSpace;
        const totalHeight = pixelHeight + topFlapDepth + bottomFlapDepth + extraTopSpace + extraBottomSpace;
        
        // Debug logging
        console.log('Template calculations:', {
            envelopeWidth: pixelWidth,
            envelopeHeight: pixelHeight,
            sideFlapDepth: sideFlapDepth,
            topFlapDepth: topFlapDepth,
            bottomFlapDepth: bottomFlapDepth,
            totalWidth: totalWidth,
            totalHeight: totalHeight,
            originalOverlap: pixelOverlapAmount,
            limitedOverlap: limitedOverlap,
            maxOverlap: maxOverlap,
            flapStyle: flapStyle,
            extraSpaces: { extraTopSpace, extraBottomSpace, extraLeftSpace, extraRightSpace }
        });
        
        // Validate that template dimensions are reasonable
        if (totalWidth > 2000 || totalHeight > 2000) {
            console.warn('Template dimensions are very large:', { totalWidth, totalHeight });
        }
        
        if (sideFlapDepth > pixelWidth) {
            console.warn('Side flap depth is larger than envelope width:', { sideFlapDepth, pixelWidth });
        }
        
        // Show warning if overlap was limited
        const overlapWarning = document.getElementById('overlap-warning');
        if (limitedOverlap < pixelOverlapAmount) {
            overlapWarning.style.display = 'block';
        } else {
            overlapWarning.style.display = 'none';
        }

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
        this.createCutLines(svg, pixelWidth, pixelHeight, pixelFlapHeight, pixelOverlapAmount, flapStyle, sideFlapDepth, topFlapDepth, bottomFlapDepth, extraLeftSpace, extraTopSpace);

        // Create score line rectangle (the envelope size) - goes on top
        // Position the score rectangle accounting for extra space needed for pointed/rounded flaps
        const scoreRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        scoreRect.setAttribute('x', sideFlapDepth + extraLeftSpace + 0.5);
        scoreRect.setAttribute('y', topFlapDepth + extraTopSpace + 0.5);
        scoreRect.setAttribute('width', pixelWidth - 1);
        scoreRect.setAttribute('height', pixelHeight - 1);
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
            flapStyle: flapStyle,
            overlapAmount: overlapAmount,
            totalWidth: totalWidth / dpi,
            totalHeight: totalHeight / dpi
        };
    }

    createCutLines(svg, pixelWidth, pixelHeight, pixelFlapHeight, pixelOverlapAmount, flapStyle, sideFlapDepth, topFlapDepth, bottomFlapDepth, extraLeftSpace, extraTopSpace) {
        // Calculate the score rectangle corners (where we start and end)
        // Account for extra space needed for pointed/rounded flaps
        const scoreLeft = sideFlapDepth + extraLeftSpace;
        const scoreTop = topFlapDepth + extraTopSpace;
        const scoreRight = scoreLeft + pixelWidth;
        const scoreBottom = scoreTop + pixelHeight;
        
        // Build the cut path based on flap style
        let cutPathData = '';
        
        if (flapStyle === 'square') {
            cutPathData = this.createSquareFlaps(scoreLeft, scoreTop, scoreRight, scoreBottom, topFlapDepth, sideFlapDepth, bottomFlapDepth);
        } else if (flapStyle === 'pointed') {
            cutPathData = this.createPointedFlaps(scoreLeft, scoreTop, scoreRight, scoreBottom, topFlapDepth, sideFlapDepth, bottomFlapDepth);
        } else if (flapStyle === 'rounded') {
            cutPathData = this.createRoundedFlaps(scoreLeft, scoreTop, scoreRight, scoreBottom, topFlapDepth, sideFlapDepth, bottomFlapDepth);
        }
        
        const cutPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cutPath.setAttribute('d', cutPathData);
        cutPath.setAttribute('stroke', '#000');
        cutPath.setAttribute('stroke-width', '1');
        cutPath.setAttribute('fill', 'none');
        
        // Add the cut path to the SVG (this will be behind the score lines)
        svg.appendChild(cutPath);
    }

    createSquareFlaps(scoreLeft, scoreTop, scoreRight, scoreBottom, topFlapDepth, sideFlapDepth, bottomFlapDepth) {
        // Start at upper left corner of score line
        let pathData = `M ${scoreLeft} ${scoreTop}`;
        
        // Top flap (rectangular, full depth)
        pathData += ` L ${scoreLeft} ${scoreTop - topFlapDepth}`; // Up to top edge
        pathData += ` L ${scoreRight} ${scoreTop - topFlapDepth}`; // Across to top right
        pathData += ` L ${scoreRight} ${scoreTop}`; // Back to upper right corner of score line
        
        // Right flap (rectangular, with overlap)
        pathData += ` L ${scoreRight + sideFlapDepth} ${scoreTop}`; // Out to right edge
        pathData += ` L ${scoreRight + sideFlapDepth} ${scoreBottom}`; // Down to bottom
        pathData += ` L ${scoreRight} ${scoreBottom}`; // Back to lower right corner of score line
        
        // Bottom flap (rectangular, half depth)
        pathData += ` L ${scoreRight} ${scoreBottom + bottomFlapDepth}`; // Down to bottom edge
        pathData += ` L ${scoreLeft} ${scoreBottom + bottomFlapDepth}`; // Across to left
        pathData += ` L ${scoreLeft} ${scoreBottom}`; // Back to lower left corner of score line
        
        // Left flap (rectangular, with overlap)
        pathData += ` L ${scoreLeft - sideFlapDepth} ${scoreBottom}`; // Out to left edge
        pathData += ` L ${scoreLeft - sideFlapDepth} ${scoreTop}`; // Up to top
        pathData += ` L ${scoreLeft} ${scoreTop}`; // Back to upper left corner of score line
        
        // Close the path
        pathData += ` Z`;
        
        return pathData;
    }

    createPointedFlaps(scoreLeft, scoreTop, scoreRight, scoreBottom, topFlapDepth, sideFlapDepth, bottomFlapDepth) {
        // Start at upper left corner of score line
        let pathData = `M ${scoreLeft} ${scoreTop}`;
        
        // Top flap (pointed)
        const topCenterX = (scoreLeft + scoreRight) / 2;
        const topCenterY = scoreTop - topFlapDepth;
        pathData += ` L ${scoreLeft} ${scoreTop - topFlapDepth}`; // Up to top left
        pathData += ` L ${topCenterX} ${topCenterY - (topFlapDepth * 0.3)}`; // To center point
        pathData += ` L ${scoreRight} ${scoreTop - topFlapDepth}`; // To top right
        pathData += ` L ${scoreRight} ${scoreTop}`; // Back to upper right corner of score line
        
        // Right flap (pointed)
        const rightCenterY = (scoreTop + scoreBottom) / 2;
        const rightCenterX = scoreRight + sideFlapDepth;
        pathData += ` L ${scoreRight + sideFlapDepth} ${scoreTop}`; // Out to right top
        pathData += ` L ${rightCenterX + (sideFlapDepth * 0.3)} ${rightCenterY}`; // To center point
        pathData += ` L ${scoreRight + sideFlapDepth} ${scoreBottom}`; // To right bottom
        pathData += ` L ${scoreRight} ${scoreBottom}`; // Back to lower right corner of score line
        
        // Bottom flap (pointed)
        const bottomCenterX = (scoreLeft + scoreRight) / 2;
        const bottomCenterY = scoreBottom + bottomFlapDepth;
        pathData += ` L ${scoreRight} ${scoreBottom + bottomFlapDepth}`; // Down to bottom right
        pathData += ` L ${bottomCenterX} ${bottomCenterY + (bottomFlapDepth * 0.3)}`; // To center point
        pathData += ` L ${scoreLeft} ${scoreBottom + bottomFlapDepth}`; // To bottom left
        pathData += ` L ${scoreLeft} ${scoreBottom}`; // Back to lower left corner of score line
        
        // Left flap (pointed)
        const leftCenterY = (scoreTop + scoreBottom) / 2;
        const leftCenterX = scoreLeft - sideFlapDepth;
        pathData += ` L ${scoreLeft - sideFlapDepth} ${scoreBottom}`; // Out to left bottom
        pathData += ` L ${leftCenterX - (sideFlapDepth * 0.3)} ${leftCenterY}`; // To center point
        pathData += ` L ${scoreLeft - sideFlapDepth} ${scoreTop}`; // To left top
        pathData += ` L ${scoreLeft} ${scoreTop}`; // Back to upper left corner of score line
        
        // Close the path
        pathData += ` Z`;
        
        return pathData;
    }

    createRoundedFlaps(scoreLeft, scoreTop, scoreRight, scoreBottom, topFlapDepth, sideFlapDepth, bottomFlapDepth) {
        // Start at upper left corner of score line
        let pathData = `M ${scoreLeft} ${scoreTop}`;
        
        // Top flap (rounded)
        pathData += ` L ${scoreLeft} ${scoreTop - topFlapDepth}`; // Up to top left
        pathData += ` Q ${(scoreLeft + scoreRight) / 2} ${scoreTop - topFlapDepth - (topFlapDepth * 0.2)} ${scoreRight} ${scoreTop - topFlapDepth}`; // Rounded top
        pathData += ` L ${scoreRight} ${scoreTop}`; // Back to upper right corner of score line
        
        // Right flap (rounded)
        pathData += ` L ${scoreRight + sideFlapDepth} ${scoreTop}`; // Out to right top
        pathData += ` Q ${scoreRight + sideFlapDepth + (sideFlapDepth * 0.2)} ${(scoreTop + scoreBottom) / 2} ${scoreRight + sideFlapDepth} ${scoreBottom}`; // Rounded right
        pathData += ` L ${scoreRight} ${scoreBottom}`; // Back to lower right corner of score line
        
        // Bottom flap (rounded)
        pathData += ` L ${scoreRight} ${scoreBottom + bottomFlapDepth}`; // Down to bottom right
        pathData += ` Q ${(scoreLeft + scoreRight) / 2} ${scoreBottom + bottomFlapDepth + (bottomFlapDepth * 0.2)} ${scoreLeft} ${scoreBottom + bottomFlapDepth}`; // Rounded bottom
        pathData += ` L ${scoreLeft} ${scoreBottom}`; // Back to lower left corner of score line
        
        // Left flap (rounded)
        pathData += ` L ${scoreLeft - sideFlapDepth} ${scoreBottom}`; // Out to left bottom
        pathData += ` Q ${scoreLeft - sideFlapDepth - (sideFlapDepth * 0.2)} ${(scoreTop + scoreBottom) / 2} ${scoreLeft - sideFlapDepth} ${scoreTop}`; // Rounded left
        pathData += ` L ${scoreLeft} ${scoreTop}`; // Back to upper left corner of score line
        
        // Close the path
        pathData += ` Z`;
        
        return pathData;
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
            Style: ${this.currentTemplate.flapStyle} | 
            Overlap: ${this.currentTemplate.overlapAmount}" | 
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
        a.download = `envelope-${this.currentTemplate.width}x${this.currentTemplate.height}-${this.currentTemplate.flapStyle}.svg`;
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
            pdf.save(`envelope-${this.currentTemplate.width}x${this.currentTemplate.height}-${this.currentTemplate.flapStyle}.pdf`);
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnvelopeGenerator();
});