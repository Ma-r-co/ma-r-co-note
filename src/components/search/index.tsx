import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Link } from "gatsby";
import { FaSearch } from "react-icons/fa";
import TextHighlighter from "./highlight";
import { Wrapper, ResultWrapper } from "./style";

interface SearchResultProps {
  value: string;
  focus: boolean;
}

interface SearchResultFrontmatter {
  date: string | null;
  title: string | null;
  slug: string | null;
  tags: readonly (string | null)[] | null;
  keywords: string | null;
}

const SearchResult: React.FC<SearchResultProps> = (props) => {
  // 全記事データ取得 //
  const allArticles: Queries.SearchAllArticlesQuery = useStaticQuery(graphql`
    query SearchAllArticles {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 1000) {
        edges {
          node {
            frontmatter {
              date(formatString: "YYYY-MM-DD")
              title
              slug
              tags
              keywords
            }
          }
        }
      }
    }
  `);
  const [data, setData] = useState<SearchResultFrontmatter[]>([]);
  useEffect(() => {
    const temp = allArticles.allMarkdownRemark.edges.map((e) => {
      return { ...e.node!.frontmatter! };
    });
    setData(temp);
  }, [allArticles.allMarkdownRemark.edges]);

  // 表示非表示の切り替え //
  const [className, setClassName] = useState<"active" | "">("");
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (props.focus && props.value !== "") {
      id = setTimeout(() => {
        setClassName("active");
      }, 100);
    } else {
      id = setTimeout(() => {
        setClassName("");
      }, 100);
    }
    return () => {
      clearTimeout(id);
    };
  }, [props.focus, props.value]);

  // 検索処理 //
  const [result, setResult] = useState<SearchResultFrontmatter[]>([]);

  useEffect(() => {
    if (props.value !== "") {
      const value = props.value.toLowerCase();
      const temp = data.filter((e) => {
        const target = `
          ${e.title?.toLowerCase()}
          ${e.tags?.join(" ").toLowerCase()}
          ${e.keywords?.toLowerCase()}
        `;
        return target.indexOf(value) !== -1;
      });
      setResult(temp);
    }
  }, [props.value, data]);

  return (
    <ResultWrapper className={className}>
      <div className="result-inner">
        <span className="res">
          <b>{result.length}</b>件ヒットしました
        </span>
        <ul>
          {result.map((e) => {
            return (
              <li key={e.slug}>
                <Link to={`/${e.slug}/`}>
                  <TextHighlighter str={e.title!} includes={props.value} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </ResultWrapper>
  );
};

interface SearchProps {
  className: string;
}

const Search: React.FC<SearchProps> = (props) => {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");
  const onFocus = () => {
    setFocus(true);
  };
  const onBlur = () => {
    setFocus(false);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <Wrapper className={props.className} focus={focus}>
      <FaSearch />
      <input
        type="text"
        placeholder="Search..."
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      />
      <SearchResult focus={focus} value={value} />
    </Wrapper>
  );
};

export default Search;
