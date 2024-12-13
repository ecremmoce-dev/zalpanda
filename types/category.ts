export interface Category {
  categoryid: string;
  category_name: string;
  category_path: string;
}

export interface CategoriesResponse {
  categories: Category[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
} 