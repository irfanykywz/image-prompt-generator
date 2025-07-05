const form = document.getElementById('promptForm');
const imageUrlInput = document.getElementById('imageUrl');
const imageFileInput = document.getElementById('imageFile');
const dropZone = document.getElementById('dropZone');
const statusDiv = document.getElementById('status');
const tableContainer = document.getElementById('tableContainer');
const mainTable = document.getElementById('mainTable');
const mainBody = document.getElementById('mainBody');
const submitBtn = document.getElementById('submitBtn');
const removeAllBtn = document.getElementById('removeAllBtn');
const exportBtn = document.getElementById('exportBtn');

let images = [];
let db;

// Format file size function
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize IndexedDB
const initDB = () => {
  const request = indexedDB.open('ImagePromptDB', 1);
  
  request.onerror = () => {
    console.error('IndexedDB error:', request.error);
  };
  
  request.onsuccess = () => {
    db = request.result;
    loadSavedImages();
  };
  
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('images')) {
      const store = db.createObjectStore('images', { keyPath: 'id' });
      store.createIndex('timestamp', 'timestamp', { unique: false });
    }
  };
};

// Save images to IndexedDB
const saveImagesToDB = () => {
  if (!db) return;
  
  const transaction = db.transaction(['images'], 'readwrite');
  const store = transaction.objectStore('images');
  
  // Clear existing data
  store.clear();
  
  // Save current images
  images.forEach(image => {
    const imageData = {
      ...image,
      timestamp: Date.now()
    };
    store.add(imageData);
  });
};

// Load images from IndexedDB
const loadSavedImages = () => {
  if (!db) return;
  
  const transaction = db.transaction(['images'], 'readonly');
  const store = transaction.objectStore('images');
  const request = store.getAll();
  
  request.onsuccess = () => {
    const savedImages = request.result;
    if (savedImages.length > 0) {
      images = savedImages;
      images.forEach(image => addImageToTable(image));
      showStatus(`Loaded ${savedImages.length} saved image(s)!`, '#10b981');
    }
  };
};

function showStatus(msg, color = '#e11d48') {
  statusDiv.textContent = msg;
  statusDiv.style.color = color;
}
function clearStatus() {
  statusDiv.textContent = '';
}
function addImageToTable(image) {
  const row = document.createElement('tr');
  row.id = `image-${image.id}`;
  
  const imageCell = document.createElement('td');
  const img = document.createElement('img');
  
  // Handle different preview types
  if (image.preview instanceof File) {
    // For uploaded files, create object URL
    img.src = URL.createObjectURL(image.preview);
  } else {
    // For URLs, use the URL directly
    img.src = image.preview;
  }
  
  img.className = 'image-preview';
  img.title = image.source;
  
  // Create image info container
  const imageInfo = document.createElement('div');
  imageInfo.className = 'image-info';
  
  // Add image to cell
  imageCell.appendChild(img);
  imageCell.appendChild(imageInfo);
  
  // Load image to get dimensions and update info
  const tempImg = new Image();
  tempImg.onload = function() {
    const filename = image.preview instanceof File ? image.preview.name : image.source.split('/').pop() || 'image';
    const fileSize = image.preview instanceof File ? formatFileSize(image.preview.size) : 'Unknown';
    const dimensions = `${this.width} × ${this.height}`;
    
    imageInfo.innerHTML = `
      <div class="image-details">
        <div class="image-filename">${filename}</div>
        <div class="image-dimensions">${dimensions}</div>
        <div class="image-size">${fileSize}</div>
      </div>
    `;
  };
  tempImg.src = img.src;
  
  const promptCell = document.createElement('td');
  promptCell.textContent = image.prompt || '-';
  
  const statusCell = document.createElement('td');
  statusCell.textContent = image.prompt ? 'Completed' : 'Ready';
  
  const actionCell = document.createElement('td');
  actionCell.className = 'action-cell';
  
  // Add generate button if no prompt exists
  if (!image.prompt) {
    const generateBtn = document.createElement('button');
    generateBtn.className = 'icon-btn generate-btn';
    generateBtn.title = 'Generate Prompt';
    generateBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
      </svg>
    `;
    generateBtn.onclick = () => generatePromptForImage(image.id);
    actionCell.appendChild(generateBtn);
  }
  
 
  // Add copy button if prompt exists
  if (image.prompt) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'icon-btn copy-btn';
    copyBtn.title = 'Copy Prompt';
    copyBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    `;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(image.prompt);
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      `;
      copyBtn.title = 'Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        `;
        copyBtn.title = 'Copy Prompt';
      }, 1200);
    };
    actionCell.appendChild(copyBtn);
  }

  const removeBtn = document.createElement('button');
  removeBtn.className = 'icon-btn remove-btn';
  removeBtn.title = 'Remove Image';
  removeBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  `;
  removeBtn.onclick = () => removeImage(image.id);
  actionCell.appendChild(removeBtn);
  
  row.appendChild(imageCell);
  row.appendChild(promptCell);
  row.appendChild(statusCell);
  row.appendChild(actionCell);
  mainBody.appendChild(row);
  
  tableContainer.style.display = '';
}

function removeImage(id) {
  images = images.filter(img => img.id !== id);
  const row = document.getElementById(`image-${id}`);
  if (row) row.remove();
  if (images.length === 0) {
    tableContainer.style.display = 'none';
  }
  saveImagesToDB();
}

function removeAllImages() {
  if (confirm('Are you sure you want to remove all images? This action cannot be undone.')) {
    images = [];
    mainBody.innerHTML = '';
    tableContainer.style.display = 'none';
    saveImagesToDB();
    showStatus('All images removed!', '#10b981');
  }
}

function exportToCSV() {
  if (images.length === 0) {
    showStatus('No images to export!');
    return;
  }
  
  const csvContent = [
    ['Image Source', 'Status', 'Prompt', 'Added Date', 'Prompt Generated Date'],
    ...images.map(image => {
      const status = image.prompt ? 'Completed' : 'Ready';
      const prompt = image.prompt || '-';
      const addedDate = new Date(image.timestamp || Date.now()).toLocaleString();
      const promptDate = image.promptGeneratedAt ? new Date(image.promptGeneratedAt).toLocaleString() : '-';
      return [
        image.source,
        status,
        prompt,
        addedDate,
        promptDate
      ];
    })
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `image-prompts-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showStatus('CSV exported successfully!', '#10b981');
}

function updateImageStatus(id, status, isError = false) {
  const row = document.getElementById(`image-${id}`);
  if (row) {
    const statusCell = row.cells[2];
    const actionCell = row.cells[3];
    
    if (isError) {
      statusCell.innerHTML = `<span style="color: #ef4444;">${status}</span>`;
      // Re-enable generate button on error
      const generateBtn = document.createElement('button');
      generateBtn.className = 'icon-btn generate-btn';
      generateBtn.title = 'Generate Prompt';
      generateBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      `;
      generateBtn.onclick = () => generatePromptForImage(id);
      actionCell.innerHTML = '';
      actionCell.appendChild(generateBtn);
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'icon-btn remove-btn';
      removeBtn.title = 'Remove Image';
      removeBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      `;
      removeBtn.onclick = () => removeImage(id);
      actionCell.appendChild(removeBtn);
    } else if (status === 'Processing...') {
      statusCell.innerHTML = '<div class="loading"></div> Processing...';
      // Disable generate button during processing
      const generateBtn = actionCell.querySelector('.generate-btn');
      if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        `;
        generateBtn.title = 'Generating...';
      }
    } else {
      statusCell.textContent = status;
    }
  }
}

function updateImagePrompt(id, prompt) {
  const row = document.getElementById(`image-${id}`);
  if (row) {
    const promptCell = row.cells[1];
    const actionCell = row.cells[3];
    
    promptCell.textContent = prompt;
    
    // Update the image object with the prompt
    const imageIndex = images.findIndex(img => img.id === id);
    if (imageIndex !== -1) {
      images[imageIndex].prompt = prompt;
      images[imageIndex].promptGeneratedAt = Date.now();
    }
    
    // Clear action cell and rebuild buttons
    actionCell.innerHTML = '';
    
    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'icon-btn copy-btn';
    copyBtn.title = 'Copy Prompt';
    copyBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    `;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(prompt);
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      `;
      copyBtn.title = 'Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        `;
        copyBtn.title = 'Copy Prompt';
      }, 1200);
    };
    actionCell.appendChild(copyBtn);
    
    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'icon-btn remove-btn';
    removeBtn.title = 'Remove Image';
    removeBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
    `;
    removeBtn.onclick = () => removeImage(id);
    actionCell.appendChild(removeBtn);
  }
}

function hideResults() {
  // Clear all prompts and copy buttons
  images.forEach(image => {
    const row = document.getElementById(`image-${image.id}`);
    if (row) {
      row.cells[1].textContent = '-';
      // Keep only the remove button in action cell
      const actionCell = row.cells[3];
      const removeBtn = actionCell.querySelector('.remove-btn');
      actionCell.innerHTML = '';
      if (removeBtn) actionCell.appendChild(removeBtn);
    }
  });
}
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
async function urlToBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch image.');
    const blob = await res.blob();
    return await fileToBase64(blob);
  } catch (e) {
    throw new Error('Could not fetch or convert image URL.');
  }
}

async function addImagesFromUrls() {
  const urlsText = imageUrlInput.value.trim();
  if (!urlsText) {
    return;
  }
  
  const urls = urlsText.split('\n').filter(url => url.trim() !== '');
  if (urls.length === 0) {
    return;
  }
  
  try {
    showStatus(`Processing ${urls.length} image URL(s)...`, '#2563eb');
    
    for (let url of urls) {
      url = url.trim();
      if (url) {
        try {
          const base64 = await urlToBase64(url);
          const image = {
            id: Date.now() + Math.random(),
            source: url,
            preview: url,
            base64: base64
          };
          images.push(image);
          addImageToTable(image);
        } catch (err) {
          showStatus(`Error processing ${url}: ${err.message}`);
        }
      }
    }
    
    imageUrlInput.value = '';
    saveImagesToDB();
    showStatus(`${urls.length} image(s) added!`, '#10b981');
  } catch (err) {
    showStatus('Error: ' + err.message);
  }
}

async function addImagesFromFiles() {
  const files = imageFileInput.files;
  if (files.length === 0) {
    return;
  }
  
  try {
    showStatus('Processing image files...', '#2563eb');
    for (let file of files) {
      const base64 = await fileToBase64(file);
      const image = {
        id: Date.now() + Math.random(),
        source: file.name,
        preview: file,
        base64: base64
      };
      images.push(image);
      addImageToTable(image);
    }
    imageFileInput.value = '';
    saveImagesToDB();
    showStatus(`${files.length} image(s) added!`, '#10b981');
  } catch (err) {
    showStatus('Error: ' + err.message);
  }
}

async function handleDroppedFiles(files) {
  const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
  
  if (imageFiles.length === 0) {
    showStatus('No image files found in the dropped files.');
    return;
  }
  
  try {
    showStatus(`Processing ${imageFiles.length} dropped image(s)...`, '#2563eb');
    for (let file of imageFiles) {
      const base64 = await fileToBase64(file);
      const image = {
        id: Date.now() + Math.random(),
        source: file.name,
        preview: file,
        base64: base64
      };
      images.push(image);
      addImageToTable(image);
    }
    saveImagesToDB();
    showStatus(`${imageFiles.length} image(s) added!`, '#10b981');
  } catch (err) {
    showStatus('Error: ' + err.message);
  }
}

async function generatePromptForImage(imageId) {
  const image = images.find(img => img.id === imageId);
  if (!image) {
    showStatus('Image not found!');
    return;
  }
  
  updateImageStatus(imageId, 'Processing...');
  
  try {
    // Prepare API payload
    const payload = {
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'create prompt from this image for recreate a high accurate similar image in paragraph, output only prompt, no explanation' },
            { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + image.base64 } }
          ]
        }
      ],
      model: 'openai',
      jsonMode: false,
      seed: 678614
    };
    
    // Call API
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://ykywz-image-prompt.blogspot.com',
        'referer': 'https://ykywz-image-prompt.blogspot.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) throw new Error('API error: ' + response.status);
    const responseText = await response.text();
    
    let prompt = responseText.trim();
    if (!prompt) {
      throw new Error('No prompt found in API response.');
    }
    
    updateImagePrompt(imageId, prompt);
    updateImageStatus(imageId, 'Completed');
    saveImagesToDB();
    
    showStatus('Prompt generated successfully!', '#10b981');
    
  } catch (err) {
    updateImageStatus(imageId, 'Error: ' + err.message, true);
    showStatus('Error generating prompt: ' + err.message);
  }
}


form.onsubmit = async (e) => {
  e.preventDefault();
  if (images.length === 0) {
    showStatus('Please add at least one image first.');
    return;
  }
  
  clearStatus();
  hideResults();
  submitBtn.disabled = true;
  

  
  // Process each image
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    updateImageStatus(image.id, 'Processing...');
    
    try {
      // Prepare API payload
      const payload = {
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'create prompt from this image for recreate a high accurate similar image in paragraph, output only prompt, no explanation' },
              { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + image.base64 } }
            ]
          }
        ],
        model: 'openai',
        jsonMode: false,
        seed: 678614
      };
      
      // Call API
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'content-type': 'application/json',
          'dnt': '1',
          'origin': 'https://ykywz-image-prompt.blogspot.com',
          'referer': 'https://ykywz-image-prompt.blogspot.com/',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('API error: ' + response.status);
      const responseText = await response.text();
      
      let prompt = responseText.trim();
      if (!prompt) {
        throw new Error('No prompt found in API response.');
      }
      
      updateImagePrompt(image.id, prompt);
      updateImageStatus(image.id, 'Completed');
      
    } catch (err) {
      updateImageStatus(image.id, 'Error: ' + err.message, true);
    }
  }
  
  saveImagesToDB();
  
  const successCount = images.filter(img => {
    const row = document.getElementById(`image-${img.id}`);
    return row && row.cells[2].textContent === 'Completed';
  }).length;
  
  if (successCount > 0) {
    showStatus(`${successCount} prompt(s) generated successfully!`, '#10b981');
  } else {
    showStatus('No prompts were generated. Please check the errors above.');
  }
  
  submitBtn.disabled = false;
};

// Drag and drop event listeners
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  handleDroppedFiles(files);
});

// Click to browse functionality
dropZone.addEventListener('click', (e) => {
  // Prevent triggering if clicking on the file input itself
  if (e.target !== imageFileInput) {
    imageFileInput.click();
  }
});

// Remove all images button
removeAllBtn.addEventListener('click', removeAllImages);

// Export to CSV button
exportBtn.addEventListener('click', exportToCSV);

// Initialize IndexedDB when page loads
initDB();