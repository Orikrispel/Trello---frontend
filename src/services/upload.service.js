export const uploadService = {
  uploadImgToCloud,
  loadImageFromInput,
}
async function uploadImgToCloud(ev) {
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  try {
    const formData = new FormData()
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('file', ev.target.files[0])

    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData
    })
    const imgUrl = await res.json()
    return imgUrl
  } catch (err) {
    console.error('Failed to upload', err)
    throw err
  }
}

// The next 2 functions handle IMAGE UPLOADING to img tag from file system:
function About(ev) {
  loadImageFromInput(ev, renderImg)
}

// CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
  const reader = new FileReader()
  // After we read the file
  reader.onload = function (event) {
    let img = new Image() // Create a new html img element
    img.src = event.target.result // Set the img src to the img file we read
    // Run the callBack func, To render the img on the canvas
    img.onload = onImageReady.bind(null, img)
    // Can also do it this way:
    // img.onload = () => onImageReady(img)
  }
  reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

function renderImg(img) {
  // Draw the img on the canvas
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

