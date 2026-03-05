export class CreateArticleDto {
  title: string;
  bodyHTML: string;
  author: string;

  pictureId: string;
  category: string[];
}