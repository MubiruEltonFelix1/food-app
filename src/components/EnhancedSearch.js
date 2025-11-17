import React, { useState, useEffect } from 'react';
import './EnhancedSearchModern.css';

function EnhancedSearch({ foods, onFilteredResults, loading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 50],
    cuisine: '',
    dietary: [],
    rating: 0,
    sortBy: 'relevance'
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const categories = ['All', 'Breakfast', 'Lunch', 'Chicken', 'Dessert', 'Beef', 'Seafood', 'Vegetarian'];
  const cuisines = ['African', 'American', 'British', 'Chinese', 'French', 'Indian', 'Italian', 'Mexican', 'Thai'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'No Nuts', 'No Dairy'];
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Voice Search Support
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Voice search is not supported in your browser');
    }
  };

  // Filter and Search Logic
  useEffect(() => {
    if (!foods || foods.length === 0) return;

    let filtered = foods.filter(food => {
      // Text search
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = food.strMeal.toLowerCase().includes(searchLower);
        const matchesArea = food.strArea?.toLowerCase().includes(searchLower);
        const matchesCategory = food.strCategory?.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesArea && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (filters.category && filters.category !== 'All') {
        if (food.strCategory !== filters.category) {
          return false;
        }
      }

      // Cuisine filter
      if (filters.cuisine) {
        if (food.strArea !== filters.cuisine) {
          return false;
        }
      }

      // Price filter (simulate price based on random)
      const price = Math.random() * 40 + 10; // 10-50k range
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Dietary restrictions (simulate based on meal name/category)
      if (filters.dietary.length > 0) {
        const isVegetarian = filters.dietary.includes('Vegetarian') && 
          (food.strCategory === 'Vegetarian' || food.strMeal.toLowerCase().includes('vegetable'));
        const isVegan = filters.dietary.includes('Vegan') && 
          food.strMeal.toLowerCase().includes('vegan');
        
        if (filters.dietary.includes('Vegetarian') && !isVegetarian) return false;
        if (filters.dietary.includes('Vegan') && !isVegan) return false;
      }

      return true;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort(() => Math.random() - 0.5); // Simulate price sorting
        break;
      case 'price-high':
        filtered.sort(() => Math.random() - 0.5);
        break;
      case 'rating':
        filtered.sort(() => Math.random() - 0.5); // Simulate rating sorting
        break;
      case 'newest':
        filtered.sort(() => Math.random() - 0.5);
        break;
      case 'popular':
        filtered.sort(() => Math.random() - 0.5);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    onFilteredResults(filtered);
  }, [searchQuery, filters, foods, onFilteredResults]);

  const handleDietaryChange = (option) => {
    setFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(item => item !== option)
        : [...prev.dietary, option]
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      priceRange: [0, 50],
      cuisine: '',
      dietary: [],
      rating: 0,
      sortBy: 'relevance'
    });
  };

  const activeFiltersCount = [
    filters.category && filters.category !== 'All',
    filters.cuisine,
    filters.dietary.length > 0,
    filters.rating > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 50
  ].filter(Boolean).length;

  return (
    <div className="enhanced-search">
      {/* Main Search Bar */}
      <div className="search-bar-container">
        <div className="main-search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for food, restaurants, cuisines..."
              className="search-input"
            />
            <button 
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={startVoiceSearch}
              title="Voice Search"
            >
              🎤
            </button>
          </div>
          
          <div className="search-actions">
            <button 
              className={`advanced-toggle ${isAdvancedOpen ? 'active' : ''}`}
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            >
              ⚙️ Filters
              {activeFiltersCount > 0 && (
                <span className="filter-count">{activeFiltersCount}</span>
              )}
            </button>
            
            {activeFiltersCount > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                ❌ Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="quick-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-chip ${filters.category === category ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                category: category === 'All' ? '' : category 
              }))}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {isAdvancedOpen && (
        <div className="advanced-filters">
          <div className="filters-grid">
            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">Price Range (UGX 000s)</label>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                  }))}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="range-slider"
                />
                <div className="price-display">
                  {filters.priceRange[0]}k - {filters.priceRange[1]}k
                </div>
              </div>
            </div>

            {/* Cuisine */}
            <div className="filter-group">
              <label className="filter-label">Cuisine</label>
              <select
                value={filters.cuisine}
                onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                className="filter-select"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              <div className="rating-filter">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    className={`rating-star ${filters.rating >= rating ? 'active' : ''}`}
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      rating: prev.rating === rating ? 0 : rating 
                    }))}
                  >
                    ⭐
                  </button>
                ))}
                <span className="rating-text">
                  {filters.rating > 0 ? `${filters.rating}+ stars` : 'Any rating'}
                </span>
              </div>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="filter-group full-width">
            <label className="filter-label">Dietary Preferences</label>
            <div className="dietary-filters">
              {dietaryOptions.map(option => (
                <label key={option} className="dietary-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.dietary.includes(option)}
                    onChange={() => handleDietaryChange(option)}
                  />
                  <span className="dietary-label">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {!loading && (
        <div className="search-summary">
          <span className="results-info">
            {searchQuery && `Showing results for "${searchQuery}"`}
            {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
          </span>
          
          {/* Popular Searches */}
          {!searchQuery && (
            <div className="popular-searches">
              <span className="popular-label">Popular: </span>
              {['Pizza', 'Burger', 'Rice', 'Chicken', 'Pasta'].map(term => (
                <button
                  key={term}
                  className="popular-term"
                  onClick={() => setSearchQuery(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EnhancedSearch;
