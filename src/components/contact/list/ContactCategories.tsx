import React from 'react';

interface ContactCategoriesProps {
  categories: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

export const ContactCategories = ({ categories }: ContactCategoriesProps) => {
  console.log('Rendering categories:', categories);
  
  if (!categories.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <div
          key={category.id}
          className="px-2 py-1 rounded text-white text-sm inline-block"
          style={{ backgroundColor: category.color }}
        >
          {category.title}
        </div>
      ))}
    </div>
  );
};