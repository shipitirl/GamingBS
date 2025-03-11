import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './JournalistDashboard.css';

const API_BASE_URL = 'http://localhost:3001';

const JournalistDashboard = () => {
  const [state, setState] = useState({
    formData: {
      title: '',
      description: '',
      category: 'Latest',
      platform: '',
      author: 'STAFF',
      tags: '',
    },
    selectedFiles: [],
    previewUrls: [],
    loading: false,
    message: '',
    errors: {},
    retryCount: 0,
  });

  const categories = [
    'Latest',
    'Games',
    'Movies',
    'TV',
    'PlayStation',
    'Xbox',
    'Nintendo',
  ];
  const platforms = ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Mobile', 'Multiple'];

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // Increased timeout to 30 seconds for network issues
    headers: { 'Accept': 'application/json' },
  });

  const validateForm = useCallback(() => {
    const errors = {};
    const { title, description, category, author, tags } = state.formData;
  
    // Title: At least 5 characters (adjust based on backend requirements)
    if (!title?.trim() || title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long';
    }
  
    // Description: At least 10 characters (adjust based on backend requirements)
    if (!description?.trim() || description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }
  
    // Category: Must be non-empty and one of the allowed values
    const allowedCategories = [
      'Latest',
      'Games',
      'Movies',
      'TV',
      'PlayStation',
      'Xbox',
      'Nintendo',
    ];
    if (!category?.trim()) {
      errors.category = 'Category is required';
    } else if (!allowedCategories.includes(category.trim())) {
      errors.category = 'Category must be one of: Latest, Games, Movies, TV, PlayStation, Xbox, Nintendo';
    }
  
    // Author: Required, no minimum length specified (adjust if backend requires more)
    if (!author?.trim()) {
      errors.author = 'Author name is required';
    }
  
    // Tags: At least two comma-separated tags, trimmed
    const tagArray = tags?.trim().split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) || [];
    if (tagArray.length < 2) {
      errors.tags = 'Please provide at least two comma-separated tags';
    }
  
    // Images: At least one image required
    if (state.selectedFiles.length === 0) {
      errors.images = 'Please upload at least one image';
    }
  
    return errors;
  }, [state.formData, state.selectedFiles]);



  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [name]: value },
      errors: { ...prev.errors, [name]: '' },
    }));
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const validFiles = files.filter((file) => {
        const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            images: 'Please upload only valid image files (jpg/png, max 5MB each)'
          }
        }));
        return;
      }

      state.previewUrls.forEach((url) => URL.revokeObjectURL(url));
      const previews = validFiles.map((file) => URL.createObjectURL(file));

      setState((prev) => ({
        ...prev,
        selectedFiles: validFiles,
        previewUrls: previews,
        errors: { ...prev.errors, images: '' },
      }));
    }
  };

  const prepareFormData = () => {
    const formData = new FormData();
    const { title, description, category, platform, author, tags } = state.formData;

    const trimmedTitle = title?.trim() || '';
    const trimmedDescription = description?.trim() || '';
    const trimmedCategory = category?.trim() || '';

    if (!trimmedTitle || !trimmedDescription || !trimmedCategory) {
      throw new Error('Required fields cannot be empty');
    }

    formData.append('title', trimmedTitle);
    formData.append('description', trimmedDescription);
    formData.append('category', trimmedCategory);

    const processedTags = tags
      ?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .join(',');
    
    if (processedTags) {
      formData.append('tags', processedTags);
    }

    if (platform?.trim()) {
      formData.append('platform', platform.trim());
    }
    
    if (author?.trim()) {
      formData.append('author', author.trim());
    }

    state.selectedFiles.forEach((file, index) => {
      formData.append('images', file, `image-${index + 1}.${file.name.split('.').pop()}`);
    });

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setState((prev) => ({
        ...prev,
        errors: formErrors,
        message: 'Please fill in all required fields correctly.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, message: '', errors: {} }));

    try {
      const formData = prepareFormData();
      console.log('Submitting to:', `${API_BASE_URL}/api/articles`);
      console.log('Form data fields:', Array.from(formData.keys()));

      const response = await api.post('/api/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
        },
      });

      if (response.status === 201 || response.status === 200) {
        setState((prev) => ({
          ...prev,
          formData: {
            title: '',
            description: '',
            category: 'Latest',
            platform: '',
            author: 'STAFF',
            tags: '',
          },
          selectedFiles: [],
          previewUrls: [],
          loading: false,
          message: 'Article published successfully!',
          errors: {},
          retryCount: 0,
        }));
      }
    } catch (error) {
      console.error('Submission error:', error.response || error);

      let errorMessage = 'Error publishing article. Please try again.';
      let shouldRetry = false;

      if (error.response) {
        if (error.response.status === 400) {
          const validationErrors = error.response.data.errors || {};
          errorMessage = 'Validation error: ' + Object.values(validationErrors).join(', ');
          setState((prev) => ({
            ...prev,
            errors: validationErrors,
          }));
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again in a few moments.';
          shouldRetry = state.retryCount < 2;
        }
      } else if (error.request) {
        errorMessage = 'Unable to reach the server. Please check your connection.';
        shouldRetry = true;
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        message: errorMessage,
        retryCount: prev.retryCount + 1,
      }));

      if (shouldRetry) {
        setTimeout(() => {
          handleSubmit(e);
        }, 3000);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Create New Article</h1>

      {state.message && (
        <div className={`message ${state.message.includes('successfully') ? 'success' : 'error'}`}>
          {state.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="article-form" noValidate>
        <div className={`form-group ${state.errors.title ? 'has-error' : ''}`}>
          <label htmlFor="title">Title: *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={state.formData.title}
            onChange={handleInputChange}
            required
            minLength={3}
            placeholder="Enter article title (min. 3 characters)"
          />
          {state.errors.title && <span className="error-message">{state.errors.title}</span>}
        </div>

        <div className={`form-group ${state.errors.category ? 'has-error' : ''}`}>
          <label htmlFor="category">Category: *</label>
          <select
            id="category"
            name="category"
            value={state.formData.category}
            onChange={handleInputChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {state.errors.category && <span className="error-message">{state.errors.category}</span>}
        </div>

        {state.formData.category === 'Games' && (
          <div className="form-group">
            <label htmlFor="platform">Platform:</label>
            <select
              id="platform"
              name="platform"
              value={state.formData.platform}
              onChange={handleInputChange}
            >
              <option value="">Select Platform</option>
              {platforms.map((plat) => (
                <option key={plat} value={plat}>{plat}</option>
              ))}
            </select>
          </div>
        )}

        <div className={`form-group ${state.errors.description ? 'has-error' : ''}`}>
          <label htmlFor="description">Description: *</label>
          <textarea
            id="description"
            name="description"
            value={state.formData.description}
            onChange={handleInputChange}
            required
            minLength={3}
            placeholder="Enter article description (min. 3 characters)"
          />
          {state.errors.description && <span className="error-message">{state.errors.description}</span>}
        </div>

        <div className={`form-group ${state.errors.images ? 'has-error' : ''}`}>
          <label htmlFor="images">Images: *</label>
          <input
            type="file"
            id="images"
            name="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={state.loading}
          />
          <div className="image-previews">
            {state.previewUrls.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index + 1}`} />
            ))}
          </div>
          {state.errors.images && <span className="error-message">{state.errors.images}</span>}
        </div>

        <div className={`form-group ${state.errors.tags ? 'has-error' : ''}`}>
          <label htmlFor="tags">Tags (comma-separated): *</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={state.formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., RPG, Action, Adventure"
            required
          />
          {state.errors.tags && <span className="error-message">{state.errors.tags}</span>}
        </div>

        <div className={`form-group ${state.errors.author ? 'has-error' : ''}`}>
          <label htmlFor="author">Author: *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={state.formData.author}
            onChange={handleInputChange}
            required
          />
          {state.errors.author && <span className="error-message">{state.errors.author}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={state.loading}>
          {state.loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
};

export default JournalistDashboard;