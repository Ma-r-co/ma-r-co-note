export type LatestPost = {
  title: string;
  slug: string;
  date: string;
};

export type RelatedPost = {
  title: string;
  slug: string;
  date: string;
  score: number;
};

export type Post = {
  node: {
    fields: {
      slug: string;
    };
    frontmatter: {
      title: string;
      date: string;
      tags: string[];
      slug: string;
      keywords: string[];
    };
  };
};
