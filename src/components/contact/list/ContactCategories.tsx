import React from 'react';

interface ContactCategoriesProps {
  categories: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

export const ContactCategories = ({ categories }: ContactCategoriesProps) => {
  console.log('ContactCategories - Received categories:', categories);
  
  if (!categories || categories.length === 0) {
    console.log('ContactCategories - No categories found');
    return (
      <div className="text-sm text-gray-500 italic">
        No categories assigned
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        console.log('ContactCategories - Rendering category:', category);
        return (
          <div
            key={category.id}
            className="px-2 py-1 rounded text-white text-sm inline-block"
            style={{ backgroundColor: category.color }}
          >
            {category.title}
          </div>
        );
      })}
    </div>
  );
};