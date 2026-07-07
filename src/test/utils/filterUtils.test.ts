import { describe, it, expect } from 'vitest';

// Test utility functions that might be used across components
describe('Filter Utilities', () => {
  it('filters items by search query', () => {
    const items = [
      { name: 'Red Shirt', brand: 'Nike' },
      { name: 'Blue Jeans', brand: 'Levis' },
      { name: 'Green Jacket', brand: 'Adidas' },
    ];

    const searchQuery = 'red';
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Red Shirt');
  });

  it('filters items by category', () => {
    const items = [
      { name: 'Shirt', category: 'Tops' },
      { name: 'Jeans', category: 'Bottoms' },
      { name: 'Jacket', category: 'Outerwear' },
    ];

    const category = 'Tops';
    const filtered = items.filter(item => item.category === category);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Shirt');
  });

  it('filters items by favorites', () => {
    const items = [
      { name: 'Item 1', is_favorite: true },
      { name: 'Item 2', is_favorite: false },
      { name: 'Item 3', is_favorite: true },
    ];

    const filtered = items.filter(item => item.is_favorite);

    expect(filtered).toHaveLength(2);
    expect(filtered.every(item => item.is_favorite)).toBe(true);
  });

  it('handles empty search results', () => {
    const items = [
      { name: 'Red Shirt', brand: 'Nike' },
      { name: 'Blue Jeans', brand: 'Levis' },
    ];

    const searchQuery = 'nonexistent';
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(filtered).toHaveLength(0);
  });

  it('handles case-insensitive search', () => {
    const items = [
      { name: 'Red Shirt', brand: 'Nike' },
      { name: 'BLUE JEANS', brand: 'Levis' },
    ];

    const searchQuery = 'blue';
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('BLUE JEANS');
  });
});
