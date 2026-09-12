import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Stars from '../../components/Stars';
import RatingModal from '../../components/RatingModal';
import api from '../../api/client';

const UserStoresPage = () => {
  const [masterStores, setMasterStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedShopType, setSelectedShopType] = useState('');
  
  const [ratingModal, setRatingModal] = useState(null);
  const [toast, setToast] = useState('');

  const fetchStores = () => {
    setLoading(true);
    api
      .get(`/stores`) // Fetch all stores without search query to populate filters
      .then((res) => {
        setMasterStores(res.data.stores);
      })
      .catch(() => setError('Failed to load stores.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchStores(); 
  }, []);

  // Compute unique values and counts for filters
  const availableStates = useMemo(() => {
    const counts = {};
    masterStores.forEach(s => {
      if (s.state) {
        counts[s.state] = (counts[s.state] || 0) + 1;
      }
    });
    return counts;
  }, [masterStores]);

  const availableCities = useMemo(() => {
    return [...new Set(masterStores.map(s => s.city).filter(Boolean))].sort();
  }, [masterStores]);

  const availableShopTypes = useMemo(() => {
    return [...new Set(masterStores.map(s => s.shopType).filter(Boolean))].sort();
  }, [masterStores]);

  // Apply filters locally whenever filter states change
  useEffect(() => {
    let result = masterStores;
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) || 
        (s.address && s.address.toLowerCase().includes(q)) ||
        (s.shopType && s.shopType.toLowerCase().includes(q))
      );
    }
    
    if (selectedState) {
      result = result.filter(s => s.state === selectedState);
    }
    
    if (selectedCity) {
      const c = selectedCity.toLowerCase();
      result = result.filter(s => s.city && s.city.toLowerCase() === c);
    }
    
    if (selectedShopType) {
      result = result.filter(s => s.shopType === selectedShopType);
    }
    
    setFilteredStores(result);
  }, [masterStores, search, selectedState, selectedCity, selectedShopType]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleStateChange = (e) => setSelectedState(e.target.value);
  const handleCityChange = (e) => setSelectedCity(e.target.value);
  const handleShopTypeChange = (e) => setSelectedShopType(e.target.value);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRatingSubmit = async (value) => {
    const { store, isModify } = ratingModal;
    if (isModify) {
      await api.put(`/stores/${store.id}/ratings`, { value });
      showToast(`✅ Rating updated for ${store.name}`);
    } else {
      await api.post(`/stores/${store.id}/ratings`, { value });
      showToast(`✅ Rating submitted for ${store.name}`);
    }
    setRatingModal(null);
    fetchStores(); // Refresh to get updated ratings
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Browse Stores</h1>
              <p className="page-subtitle">Find the best rated stores near you</p>
            </div>
          </div>

          {toast && (
            <div className="alert alert-success" style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000, maxWidth: 360 }}>
              {toast}
            </div>
          )}

          <div className="filters-bar" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Top Row: Search */}
            <div className="search-input-wrapper" style={{ flex: 1, width: '100%' }}>
              <span className="search-icon">🔍</span>
              <input
                id="store-search"
                className="form-control search-input"
                placeholder="Search by store name, type, or address..."
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Bottom Row: Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              
              <div style={{ flex: 1, minWidth: '200px' }}>
                <select className="form-control" value={selectedState} onChange={handleStateChange}>
                  <option value="">All States</option>
                  {Object.entries(availableStates)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([state, count]) => (
                      <option key={state} value={state}>
                        {state} ({count})
                      </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <input
                  list="cities-list"
                  className="form-control"
                  placeholder="Filter by City..."
                  value={selectedCity}
                  onChange={handleCityChange}
                />
                <datalist id="cities-list">
                  {availableCities.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <select className="form-control" value={selectedShopType} onChange={handleShopTypeChange}>
                  <option value="">All Shop Types</option>
                  {availableShopTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : filteredStores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <p>No stores found matching your filters. Try a different search.</p>
            </div>
          ) : (
            <div className="stores-grid">
              {filteredStores.map((store) => (
                <div key={store.id} className="store-card">
                  <div className="store-card-name">{store.name}</div>
                  
                  {store.shopType && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--secondary-color)', fontWeight: 600, marginBottom: 4 }}>
                      {store.shopType}
                    </div>
                  )}
                  
                  <div className="store-card-address">
                    📍 {store.city ? `${store.city}, ${store.state}` : store.address}
                  </div>

                  <div className="store-card-ratings">
                    <div className="store-card-rating-row">
                      <span className="store-card-rating-label">Overall Rating</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Stars value={store.avgRating} />
                        <span className="rating-number">
                          {store.avgRating > 0 ? store.avgRating.toFixed(1) : 'No ratings'}{' '}
                          {store.ratingCount > 0 && `(${store.ratingCount})`}
                        </span>
                      </div>
                    </div>

                    <div className="store-card-rating-row">
                      <span className="store-card-rating-label">Your Rating</span>
                      {store.userRating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Stars value={store.userRating} />
                          <span className="rating-number">{store.userRating}/5</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not rated yet</span>
                      )}
                    </div>
                  </div>

                  <div className="store-card-actions" style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/user/store/${store.id}`} className="btn btn-primary btn-sm flex-1 text-center">
                      🛍️ Visit
                    </Link>
                    {store.userRating ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        id={`modify-rating-${store.id}`}
                        onClick={() => setRatingModal({ store, isModify: true })}
                      >
                        ✏️ Modify
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        id={`submit-rating-${store.id}`}
                        onClick={() => setRatingModal({ store, isModify: false })}
                      >
                        ⭐ Rate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {ratingModal && (
          <RatingModal
            storeName={ratingModal.store.name}
            existingRating={ratingModal.isModify ? ratingModal.store.userRating : null}
            onSubmit={handleRatingSubmit}
            onClose={() => setRatingModal(null)}
          />
        )}
      </main>
    </div>
  );
};

export default UserStoresPage;
