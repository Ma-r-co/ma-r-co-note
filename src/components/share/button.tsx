import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import { PageProps } from "gatsby";

const Wrapper = styled.div`
  background: #cccccc;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  font-size: 0.95rem;
  opacity: 0.8;
  margin: 0 10px;
  &:last-child {
    margin-right: 0;
  }
  a {
    text-decoration: none;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    svg,
    b {
      font-size: 0.9rem;
    }
  }
  &.twitter {
    background: linear-gradient(0deg, #3aafa9, ${rgba("#3AAFA9", 0.7)});
    text-shadow: 0 1px 1px #3aafa9;
    // box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.1),
    //   0 2px 10px -1px ${rgba("#3AAFA9", 0.6)};
  }
  &.facebook {
    background: linear-gradient(0deg, #3aafa9, ${rgba("#3AAFA9", 0.8)});
    text-shadow: 0 1px 1px #3aafa9;
    // box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.1),
    //   0 2px 10px -1px ${rgba("#3AAFA9", 0.6)};
  }
  &.hatena {
    background: linear-gradient(0deg, #3aafa9, ${rgba("#3AAFA9", 0.8)});
    text-shadow: 0 1px 1px #3aafa9;
    // box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.1),
    //   0 2px 10px -1px ${rgba("#3AAFA9", 0.6)};
  }
  &.pocket {
    background: linear-gradient(0deg, #3aafa9, ${rgba("#3AAFA9", 0.7)});
    text-shadow: 0 1px 1px #3aafa9;
    // box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.1),
    //   0 2px 10px -1px ${rgba("#3AAFA9", 0.6)};
  }
  &:hover {
    opacity: 1;
    box-shadow: none;
  }
`;

interface ButtonProps {
  href: string;
  className: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <Wrapper className={props.className}>
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    </Wrapper>
  );
};

export default Button;
