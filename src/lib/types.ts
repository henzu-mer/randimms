export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  category_id: string;
  file_path: string;
  thumbnail_path: string;
  duration: number;
  views: number;
  upload_date: string;
  featured: number; // 0/1
  created_at: string;
  // joined
  category_name?: string;
  category_slug?: string;
  tags?: Tag[];
}

export interface VideoWithRelations extends Video {
  category?: Category;
  tags: Tag[];
}
