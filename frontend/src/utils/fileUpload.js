// Utility functions for file upload handling in AddVehicleModal

export const handlePhotoUpload = async (file, photoType, setPhotos, setPhotoFiles) => {
  if (!file) return;

  // Show loading state
  setPhotos(prev => ({ ...prev, [photoType]: 'loading' }));

  try {
    // Basic file validation
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size must be less than 5MB');
    }

    // Store the actual file object for backend upload
    setPhotoFiles(prev => ({
      ...prev,
      [photoType]: file
    }));

    // Create preview URL for display
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotos(prev => ({
        ...prev,
        [photoType]: event.target.result
      }));
    };
    reader.onerror = () => {
      throw new Error('Failed to read file');
    };
    reader.readAsDataURL(file);

  } catch (error) {
    console.error(`Error uploading ${photoType} photo:`, error);
    setPhotos(prev => ({ ...prev, [photoType]: null }));
    alert(error.message || 'Failed to upload photo');
  }
};

export const handleDrop = async (e, photoType, setPhotos, setPhotoFiles) => {
  e.preventDefault();
  e.stopPropagation();

  const files = e.dataTransfer.files;
  if (files && files[0]) {
    await handlePhotoUpload(files[0], photoType, setPhotos, setPhotoFiles);
  }
};

export const uploadPhotosToBackend = async (listingId, photoFiles, token) => {
  const uploadedPhotos = [];
  const photoTypes = ['front', 'side', 'back', 'interior'];
  
  for (const photoType of photoTypes) {
    const file = photoFiles[photoType];
    if (file) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('pictures', file);
        
        // Upload to backend
        const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000';
        const uploadResponse = await fetch(`${apiUrl}/listings/${listingId}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          if (uploadResult.pictures) {
            uploadedPhotos.push(...uploadResult.pictures);
          }
        } else {
          console.error(`Failed to upload ${photoType} photo:`, uploadResponse.statusText);
        }
      } catch (uploadError) {
        console.error(`Error uploading ${photoType} photo:`, uploadError);
      }
    }
  }
  
  return uploadedPhotos;
};
