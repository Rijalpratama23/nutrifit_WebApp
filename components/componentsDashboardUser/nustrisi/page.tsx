'use client';

import { useEffect, useState } from 'react';
import HeaderNutrisi from './ui/header/page';
import CartHead from './ui/cartHeader/page';
import CartMeal from './ui/mealCart/page';
import TipsCart from './ui/tipsCart/page';
import { supabase } from '@/utils/supabase/client';

type NutritionPlan = {
  id: string;
  user_id: string;
  consultation_id: string;
  kalori: number;
  protein_g: number;
  karbo_g: number;
  lemak_g: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  tips: string[];
  created_at: string;
};

export default function PageNutrisi() {
  const [plan, setPlan] = useState<NutritionPlan | null>(null);

  useEffect(() => {
    let channel: any;

    const loadPlan = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const userId = session.user.id;
      const { data, error } = await supabase.from('nutrition_plans').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle();

      if (!error) {
        setPlan(data as NutritionPlan | null);
      }

      channel = supabase
        .channel(`nutrition_plans_user_${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'nutrition_plans', filter: `user_id=eq.${userId}` }, (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setPlan(payload.new as NutritionPlan);
          } else if (payload.eventType === 'DELETE') {
            setPlan(null);
          }
        })
        .subscribe();
    };

    loadPlan();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-5 md:mt-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-6 sm:pb-8">
      <HeaderNutrisi />
      <CartHead plan={plan} />
      <CartMeal plan={plan} />
      <TipsCart plan={plan} />
    </div>
  );
}
