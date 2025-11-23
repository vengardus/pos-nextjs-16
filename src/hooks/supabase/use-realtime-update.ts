import { useEffect } from 'react';
import { supabase } from '@/infrastructure/db/supabase';
import { useRealTimeStore } from '@/stores/general/real-time.store';


export function useRealtimeUpdate(tableName: string) {
  //const [updated, setUpdated] = useState(false);
  const updated = useRealTimeStore((state) => state.updated);
  const setUpdated = useRealTimeStore((state) => state.setUpdated);

  useEffect(() => {
    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          console.log('SET-REVALIDATE Realtime update');
          setUpdated(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, setUpdated]);

  return { updated, reset: () => setUpdated(false) };
}
