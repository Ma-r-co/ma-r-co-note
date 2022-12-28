import React from "react";
import styled, { keyframes } from "styled-components";
import { useStaticQuery, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

const delay = (opacity: number) => {
  return keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: ${opacity};
    }
  `;
};

interface PolygonStyleProps {
  background: string;
  width: string;
  height: string;
}

const Style = styled.div<PolygonStyleProps>`
  background: ${(props) => props.background || "#999"};
  background: linear-gradient(45deg, #2b7a78 0%, #17252a 74%);
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "400px"};
  position: fixed;
  top: 0;
  left: 0;
  #bg {
    width: ${(props) => props.width || "100%"};
    height: ${(props) => props.height || "400px"};
    overflow: hidden;
    opacity: 0;
    animation: 0.4s ${delay(1)} linear 0s forwards;
    position: relative;
    z-index: 1;
    // .gatsby-image-wrapper {
    //   width: 100vw;
    //   height: 100%;
    //   img {
    //     width: 100vw;
    //     height: 100%;
    //     object-fit: cover;
    //     position: relative;
    //   }
    // }
    &:after {
      width: 100%;
      height: 100%;
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      background: linear-gradient(45deg, #2b7a78 0%, #17252a 74%);
      opacity: 1;
      z-index: 999;
      mix-blend-mode: overlay;
    }
    &:before {
      width: 100%;
      height: 100%;
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      background: linear-gradient(45deg, #2b7a78 0%, #17252a 74%);
      opacity: 0.9;
      z-index: 9999;
      mix-blend-mode: multiply;
    }
  }
`;

interface PolygonProps {
  width: string;
  height: string;
  background: string;
}
const Polygon: React.FC<PolygonProps> = (props) => {
  const data: Queries.BackgroundImageQuery = useStaticQuery(graphql`
    query BackgroundImage {
      backgroundImage: file(
        absolutePath: { regex: "/math_on_whiteboard.jpg/" }
      ) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
    }
  `);
  return (
    <Style
      className="polygon"
      width={props.width}
      height={props.height}
      background={props.background}
    >
      <div id="bg">
        <GatsbyImage
          image={data!.backgroundImage!.childImageSharp!.gatsbyImageData}
          alt="math on whiteboard"
        />
      </div>
    </Style>
  );
};

export default Polygon;
