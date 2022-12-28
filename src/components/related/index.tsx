import React, { useState, useEffect } from "react";
import Wrapper from "./style";
import { Link, PageProps } from "gatsby";
import { FaCalendarAlt } from "react-icons/fa";
import { LatestPost } from "../../types/Post";

interface LatestProps {
  latest: LatestPost[];
}

export const Latest: React.FC<LatestProps> = (props) => {
  return (
    <Wrapper>
      <div className="tab-header-wrapper">
        <span className="active auto">最新記事</span>
        <span className="auto"></span>
      </div>
      <div className="tab-wrapper">
        <div className="tab-item">
          {props.latest.map((e) => {
            return (
              <div key={`${e.slug}`} className="tab-post-item">
                <span className="date">
                  <FaCalendarAlt />
                  <span>{e.date}</span>
                </span>
                <span className="title">
                  <Link to={`/${e.slug}/`}>{e.title} </Link>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};

interface RelatedProps {
  latest: {
    slug: string;
    date: string;
    title: string;
  }[];
  related: {
    slug: string;
    date: string;
    title: string;
  }[];
}

const Related: React.FC<RelatedProps> = (props) => {
  const latestPosts = props.latest;
  const relatedPosts = props.related;
  const [isRelated, setIsRelated] = useState(true);
  const [data, setData] = useState(relatedPosts);

  const related = () => {
    setIsRelated(true);
  };
  const latest = () => {
    setIsRelated(false);
  };

  useEffect(() => {
    if (isRelated) {
      setData(relatedPosts);
    } else {
      setData(latestPosts);
    }
  }, [isRelated, relatedPosts, latestPosts]);

  return (
    <Wrapper>
      <div className="tab-header-wrapper">
        <span onClick={related} className={`${isRelated ? "active" : ""}`}>
          関連記事
        </span>
        <span onClick={latest} className={`${!isRelated ? "active" : ""}`}>
          最新記事
        </span>
      </div>
      <div className="tab-wrapper">
        <div className="tab-item">
          {data.map((e) => {
            return (
              <div key={`${e.slug}`} className="tab-post-item">
                <span className="date">
                  <FaCalendarAlt />
                  <span>{e.date}</span>
                </span>
                <span className="title">
                  <Link to={`/${e.slug}/`}>{e.title} </Link>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};

export default Related;
