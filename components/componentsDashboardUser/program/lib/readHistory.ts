export interface ReadArticle {
  id: string;
  user_id: string;
  article_id: string;
  article_title: string;
  article_category: string;
  article_image_url: string | null;
  last_read_at: string;
}

const STORAGE_KEY = 'nutrifit:user_article_reads';

export function getStoredReadArticles(): ReadArticle[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReadArticle[]) : [];
  } catch (error) {
    console.error('Failed to read stored read history:', error);
    return [];
  }
}

export function saveStoredReadArticles(articles: ReadArticle[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Failed to save stored read history:', error);
  }
}

export function upsertStoredReadArticle(article: ReadArticle) {
  const existing = getStoredReadArticles();
  const filtered = existing.filter((item) => item.article_id !== article.article_id || item.user_id !== article.user_id);
  const next = [
    {
      ...article,
      id: article.id || `${article.user_id}-${article.article_id}`,
    },
    ...filtered,
  ].sort((a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime());

  saveStoredReadArticles(next);
  return next;
}

export function removeStoredReadArticle(articleId: string) {
  const existing = getStoredReadArticles();
  const next = existing.filter((item) => item.article_id !== articleId);
  saveStoredReadArticles(next);
  return next;
}

export function mergeReadArticles(localArticles: ReadArticle[], remoteArticles: ReadArticle[]): ReadArticle[] {
  const merged = new Map<string, ReadArticle>();

  [...localArticles, ...remoteArticles].forEach((article) => {
    const key = `${article.user_id}-${article.article_id}`;
    const existing = merged.get(key);

    if (!existing || new Date(article.last_read_at) > new Date(existing.last_read_at)) {
      merged.set(key, article);
    }
  });

  return Array.from(merged.values()).sort((a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime());
}
