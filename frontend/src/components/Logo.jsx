import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Logo = ({ size = 'default' }) => {
  const isLarge = size === 'large';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        position: 'relative', 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ShoppingBag 
          size={isLarge ? 36 : 24} 
          style={{ color: '#0f766e', fill: '#0f766e' }} // Teal color for bag
        />
        {/* Star badge on top right of the bag */}
        <div style={{
          position: 'absolute',
          top: isLarge ? -4 : -3,
          right: isLarge ? -6 : -4,
          background: 'white',
          borderRadius: '50%',
          width: isLarge ? 16 : 12,
          height: isLarge ? 16 : 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}>
          <span style={{ color: '#ea580c', fontSize: isLarge ? '12px' : '9px', lineHeight: 1 }}>★</span>
        </div>
      </div>
      
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        fontSize: isLarge ? '28px' : '20px',
        color: '#1e3a8a', // Dark blue text
        letterSpacing: '-0.02em',
      }}>
        Dukan<span style={{ color: '#ea580c' }}>.com</span>
      </div>
    </div>
  );
};

export default Logo;
