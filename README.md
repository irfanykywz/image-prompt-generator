# Image Prompt Generator

A modern web application that transforms images into detailed AI prompts using advanced image analysis. Upload images or paste URLs to generate creative, descriptive prompts for AI image generation tools.

![Image Prompt Generator](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## ✨ Features

- **Multiple Input Methods**: Upload images directly or paste image URLs
- **Drag & Drop Support**: Intuitive drag and drop interface for file uploads
- **Batch Processing**: Generate prompts for multiple images simultaneously
- **Individual Generation**: Generate prompts for specific images
- **Data Persistence**: Automatically saves images and prompts using IndexedDB
- **CSV Export**: Export all image data and prompts to CSV format
- **Copy to Clipboard**: One-click copying of generated prompts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful glass morphism design with smooth animations
- **Image Information**: Displays file size, dimensions, and filename for each image

## 🚀 Live Demo

[Try the Image Prompt Generator](https://irfanykywz.github.io/image-prompt-generator/)

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: IndexedDB for local data persistence
- **API**: Pollinations AI for image analysis
- **Styling**: Modern CSS with glass morphism effects
- **Icons**: SVG icons for better performance

## 📦 Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/irfanykywz/image-prompt-generator.git
   cd image-prompt-generator
   ```

2. **Open the application**
   - Simply open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Add your assets** (optional)
   - Replace `logo.png` with your own logo
   - Replace `favicon.ico` with your own favicon

## 🎯 Usage

### Adding Images

1. **URL Method**:
   - Paste image URLs in the textarea (one per line)
   - Images are automatically added to the preview table

2. **File Upload**:
   - Click the upload area or drag and drop images
   - Supports multiple file selection
   - Compatible formats: JPG, PNG, GIF, WebP, etc.

### Generating Prompts

1. **Individual Generation**:
   - Click the generate button (🔄) next to any image
   - Wait for the AI to analyze and generate a prompt

2. **Batch Generation**:
   - Click "Generate Prompts for All Images"
   - All images without prompts will be processed sequentially

### Managing Data

- **Copy Prompts**: Click the copy button (📋) to copy prompts to clipboard
- **Remove Images**: Click the remove button (🗑️) to delete individual images
- **Remove All**: Use "Remove All Images" to clear everything
- **Export Data**: Click "Export to CSV" to download all data

## 📁 Project Structure

```
image-prompt-generator/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── logo.png            # Application logo
├── favicon.ico         # Browser favicon
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## 🔧 Configuration

### Customizing the API

The application uses the Pollinations AI API. To use a different service:

1. Open `script.js`
2. Find the `generatePromptForImage` function
3. Replace the API endpoint and request format as needed

### Styling Customization

- Edit `styles.css` to modify colors, fonts, and layout
- The design uses CSS custom properties for easy theming
- Responsive breakpoints are defined for mobile optimization

## 🌟 Features in Detail

### Image Analysis
- Automatic dimension detection
- File size calculation
- Format validation
- Preview generation

### Data Management
- Persistent storage using IndexedDB
- Automatic data recovery on page reload
- Export functionality with timestamps
- Individual and bulk operations

### User Experience
- Real-time status updates
- Loading animations
- Error handling with user feedback
- Keyboard shortcuts and accessibility

## 📱 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ Internet Explorer (not supported)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and formatting
- Add comments for complex logic
- Test on multiple browsers
- Ensure responsive design works
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pollinations AI** for providing the image analysis API
- **Inter Font** for the beautiful typography
- **SVG Icons** for the clean iconography
- **CSS Glass Morphism** for the modern design inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/irfanykywz/image-prompt-generator/issues)
- **Email**: your-email@example.com
- **Website**: [https://irfanykywz.github.io](https://irfanykywz.github.io)

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Basic image upload and URL support
- AI prompt generation
- Data persistence
- CSV export functionality
- Responsive design
- Modern UI with glass morphism

---

**Made with ❤️ by [irfanykywz](https://irfanykywz.github.io)** 