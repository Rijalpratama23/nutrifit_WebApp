export interface ProgramContent {
  id: string;
  title: string;
  description: string;
  guideDetail: string[];
  expertTarget: string[];
  slug?: string;
  category?: string;
}

export interface ProgramRecord {
  id?: string;
  slug?: string | null;
  title?: string | null;
  description?: string | null;
  guide_detail?: string[] | string | null;
  expert_target?: string[] | string | null;
  category?: string | null;
}

const PROGRAM_LIBRARY: Record<string, ProgramContent> = {
  diet: {
    id: 'diet',
    title: 'Program Diet & Nutrisi',
    description: 'Program yang membantu Anda membangun pola makan yang lebih terarah dan konsisten.',
    guideDetail: ['Tetapkan target kalori harian yang realistis.', 'Pilih makanan dengan porsi seimbang dan rutin minum air.', 'Pantau asupan protein, serat, dan sayur setiap hari.'],
    expertTarget: ['Menurunkan berat badan secara bertahap dan aman.', 'Meningkatkan kualitas pola makan sehari-hari.', 'Membantu menjaga energi dan metabolisme tetap stabil.'],
  },
  fitness: {
    id: 'fitness',
    title: 'Program Kebugaran',
    description: 'Program yang fokus pada aktivitas fisik yang ringan sampai menengah untuk menjaga stamina.',
    guideDetail: ['Lakukan olahraga ringan secara rutin, misalnya jalan kaki atau stretching.', 'Sesuaikan intensitas latihan dengan kondisi tubuh.', 'Jaga jadwal istirahat agar tubuh pulih dengan baik.'],
    expertTarget: ['Meningkatkan stamina dan kebugaran tubuh.', 'Membantu menjaga postur dan fleksibilitas.', 'Mendorong kebiasaan aktif secara konsisten.'],
  },
  wellness: {
    id: 'wellness',
    title: 'Program Kesehatan Holistik',
    description: 'Program yang membantu Anda menjaga pola hidup lebih sehat secara menyeluruh.',
    guideDetail: ['Prioritaskan tidur yang cukup dan pola makan teratur.', 'Kelola stres dengan rutinitas yang menenangkan.', 'Perhatikan tanda tubuh dan lakukan evaluasi berkala.'],
    expertTarget: ['Meningkatkan kualitas tidur dan istirahat.', 'Membantu mengurangi stres secara bertahap.', 'Mendorong gaya hidup yang lebih seimbang.'],
  },
  default: {
    id: 'default',
    title: 'Program Rekomendasi',
    description: 'Program ini akan disesuaikan berdasarkan topik artikel yang Anda baca.',
    guideDetail: ['Baca artikel secara rutin untuk melihat rekomendasi program yang lebih relevan.', 'Pilih fokus program sesuai kebutuhan Anda saat ini.', 'Gunakan program ini sebagai panduan awal.'],
    expertTarget: ['Membantu membangun kebiasaan sehat secara bertahap.', 'Memberi arahan yang lebih personal sesuai minat Anda.', 'Meningkatkan pemahaman tentang topik kesehatan yang sedang dipelajari.'],
  },
};

function normalizeText(value: string | null | undefined) {
  return (value || '').toLowerCase().trim();
}

function parseStringArray(value: string[] | string | null | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim());
  }

  if (typeof value === 'string') {
    return value
      .split(/\n|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function getProgramContent(category: string, remotePrograms: ProgramRecord[] = []): ProgramContent {
  const normalizedCategory = normalizeText(category);

  const matchedProgram = remotePrograms.find((program) => {
    const slug = normalizeText(program.slug);
    const title = normalizeText(program.title);
    const categoryName = normalizeText(program.category);

    return (
      Boolean(slug && (normalizedCategory.includes(slug) || slug.includes(normalizedCategory))) ||
      Boolean(title && (normalizedCategory.includes(title) || title.includes(normalizedCategory))) ||
      Boolean(categoryName && (normalizedCategory.includes(categoryName) || categoryName.includes(normalizedCategory)))
    );
  });

  if (matchedProgram) {
    return {
      id: matchedProgram.id || 'remote-program',
      title: matchedProgram.title || 'Program',
      description: matchedProgram.description || 'Program yang disesuaikan dari data dinamis.',
      guideDetail: parseStringArray(matchedProgram.guide_detail),
      expertTarget: parseStringArray(matchedProgram.expert_target),
      slug: matchedProgram.slug || undefined,
      category: matchedProgram.category || undefined,
    };
  }

  if (normalizedCategory.includes('diet') || normalizedCategory.includes('nutrisi') || normalizedCategory.includes('makan')) {
    return PROGRAM_LIBRARY.diet;
  }

  if (normalizedCategory.includes('olahraga') || normalizedCategory.includes('fitness') || normalizedCategory.includes('kebugaran')) {
    return PROGRAM_LIBRARY.fitness;
  }

  if (normalizedCategory.includes('tidur') || normalizedCategory.includes('stress') || normalizedCategory.includes('wellness')) {
    return PROGRAM_LIBRARY.wellness;
  }

  return PROGRAM_LIBRARY.default;
}
