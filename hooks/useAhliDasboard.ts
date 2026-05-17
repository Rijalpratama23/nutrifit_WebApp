export function useAhliDashboard(): AhliDashboardData {
  const [data, setData] = useState<AhliDashboardData>({
    permintaanBaru: 0,
    konsultasiAktif: 0,
    selesai: 0,
    konsultasiTerbaru: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const ahliId = session.user.id;

      const [
        { count: permintaanBaru },
        { count: konsultasiAktif },
        { count: selesai },
        { data: terbaru },
      ] = await Promise.all([
        // Permintaan baru (pending)
        supabase.from('consultations').select('*', { count: 'exact', head: true })
          .eq('ahli_id', ahliId).eq('status', 'pending'),

        // Konsultasi aktif (confirmed + ongoing)
        supabase.from('consultations').select('*', { count: 'exact', head: true })
          .eq('ahli_id', ahliId).in('status', ['confirmed', 'ongoing']),

        // Selesai (completed)
        supabase.from('consultations').select('*', { count: 'exact', head: true })
          .eq('ahli_id', ahliId).eq('status', 'completed'),

        // Konsultasi terbaru dengan data user
        supabase.from('consultations')
          .select(`id, status, created_at, scheduled_at, users!consultations_user_id_fkey(full_name, email)`)
          .eq('ahli_id', ahliId)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(7),
      ]);

      const konsultasiTerbaru: KonsultasiItem[] = (terbaru ?? []).map((item: any) => ({
        id: item.id,
        user_name: item.users?.full_name ?? 'User',
        user_email: item.users?.email ?? '',
        status: item.status,
        created_at: item.created_at,
        scheduled_at: item.scheduled_at,
      }));

      setData({
        permintaanBaru: permintaanBaru ?? 0,
        konsultasiAktif: konsultasiAktif ?? 0,
        selesai: selesai ?? 0,
        konsultasiTerbaru,
        loading: false,
      });
    };

    fetchData();
  }, []);

  return data;
}