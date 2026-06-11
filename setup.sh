#!/bin/bash

echo "========================================"
echo "Bob: Your AI Teammate - Setup Script"
echo "========================================"
echo ""

echo "Checking system..."
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "ERROR: index.html not found!"
    echo "Please run this script from the bob-ai-teammate-showcase directory."
    exit 1
fi

echo "[OK] Project files found"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Your Bob showcase is ready to run!"
echo ""
echo "To view the showcase:"
echo "  1. Open index.html in your web browser"
echo "  2. Or use a local server (recommended):"
echo "     - Python: python -m http.server 8000"
echo "     - Python 3: python3 -m http.server 8000"
echo "     - Node.js: npx serve"
echo "     - PHP: php -S localhost:8000"
echo ""
echo "Then navigate to: http://localhost:8000"
echo ""
echo "========================================"
echo "Quick Start Commands:"
echo "========================================"
echo ""

# Check for Python
if command -v python3 &> /dev/null; then
    echo "✓ Python 3 detected"
    echo "  Start server: python3 -m http.server 8000"
    echo ""
elif command -v python &> /dev/null; then
    echo "✓ Python detected"
    echo "  Start server: python -m http.server 8000"
    echo ""
fi

# Check for Node.js
if command -v node &> /dev/null; then
    echo "✓ Node.js detected"
    echo "  Start server: npx serve"
    echo ""
fi

# Check for PHP
if command -v php &> /dev/null; then
    echo "✓ PHP detected"
    echo "  Start server: php -S localhost:8000"
    echo ""
fi

echo "========================================"
echo ""

# Ask if user wants to start a server
read -p "Start a local server now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v python3 &> /dev/null; then
        echo "Starting Python 3 server on http://localhost:8000"
        echo "Press Ctrl+C to stop the server"
        echo ""
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "Starting Python server on http://localhost:8000"
        echo "Press Ctrl+C to stop the server"
        echo ""
        python -m http.server 8000
    else
        echo "Python not found. Please install Python or use another method."
        echo "Opening index.html in browser..."
        if command -v open &> /dev/null; then
            open index.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open index.html
        else
            echo "Please open index.html manually in your browser."
        fi
    fi
fi

echo ""
echo "For more information, see README.md"
echo ""

# Made with Bob
