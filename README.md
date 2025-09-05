# Seed Envelope Template Generator

Generates custom seed envelope templates for Cricut or xTool vinyl cutters. Creates both cut lines (for the blade) and score lines (for the scoring head) in a single SVG file.

## Features

- **4 Predefined Seed Envelope Sizes**: #3, #4.5, #5, and #6 envelopes optimized for seed storage
- **Dual-Tool Support**: Cut lines for blade tool, score lines for scoring head
- **xTool M1 Ultra Optimized**: Vector-based paths for efficient processing
- **Clean UI**: Two-column layout with size selection and live preview
- **Download Options**: SVG and PDF export

## Changelog - Latest Session

### 🎯 Core Functionality
- **Fixed fold line issues**: Resolved diagonal line problems in SVG output
- **Vector-based paths**: Converted from individual line elements to single vector paths
- **Dual-tool optimization**: Separate cut lines (solid) and score lines (dashed) for xTool M1 Ultra
- **Proper path closure**: Eliminated unwanted diagonal lines with correct SVG path syntax

### 🌱 Seed Envelope Focus
- **Updated to seed storage sizes**: Replaced generic envelope sizes with seed-specific dimensions
- **4 optimized sizes**: #3 (2½" × 4¼"), #4.5 (3" × 4⅞"), #5 (2⅞" × 5¼"), #6 (3⅜" × 6")
- **Seed storage research**: Based on common seed packet envelope standards

### 🎨 UI/UX Improvements
- **Two-column layout**: 1/3 left column for size selection, 2/3 right column for preview
- **Streamlined interface**: Removed custom dimension inputs, focused on predefined sizes
- **Download buttons**: Positioned in lower right corner of preview area
- **Removed clutter**: Eliminated preview headers and legends for cleaner design

### 🔧 Technical Improvements
- **Error handling**: Added comprehensive validation to prevent NaN errors
- **Separate functions**: Modular code with dedicated functions for cut lines and score lines
- **Flap design**: Rectangular flaps with top flap (full depth) and side/bottom flaps (half depth)
- **Proper layering**: Cut lines behind score lines for correct visual hierarchy

### 📐 Template Structure
- **Cut lines**: Solid black perimeter with rectangular flaps of varying depths
- **Score lines**: Dashed black rectangle around envelope body for folding
- **Flap configuration**: Top flap (full depth), side/bottom flaps (half depth)
- **Clean geometry**: No diagonal lines or path closure issues

## Usage

1. Open `index.html` in your browser
2. Select one of the four seed envelope sizes
3. Preview the template with cut lines (solid) and score lines (dashed)
4. Download SVG for use with xTool M1 Ultra or other cutting machines
5. Set cut lines to blade tool, score lines to scoring head

## Technical Details

- **DPI**: 72 DPI for print quality
- **Format**: SVG with vector paths
- **Tools**: Blade tool for cut lines, scoring head for score lines
- **Flap depths**: Top flap (1.5"), side/bottom flaps (0.75")
