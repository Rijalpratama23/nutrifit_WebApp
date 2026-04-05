'use client';

import HeaderNutrisi from './ui/header/page';
import CartHead from './ui/cartHeader/page';
import CartMeal from './ui/mealCart/page';
import TipsCart from './ui/tipsCart/page';

export default function PageNutrisi() {

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-5 md:mt-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-6 sm:pb-8">
      <HeaderNutrisi />
      <CartHead />
      <CartMeal />
      <TipsCart />
    </div>
  );
}
