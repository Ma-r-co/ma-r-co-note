import React from "react";
import { navigate } from 'gatsby';
import Recaptcha from 'react-google-recaptcha';
import styled from "styled-components";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MdPerson, MdEmail } from "react-icons/md";
import { useSiteMetadata } from "../components/queries";


const Wrapper = styled.div`
  width: var(--width);
  text-align: center;
  h1 {
    font-size: 1.4rem;
    font-weight: 600;
    padding: 10px 0;
  }
  p {
    font-size: 0.9rem;
  }
  .iptxt {
    position: relative;
    width: 60%;
    margin: 40px auto;
    margin-bottom: 20px;
  }
  .iptxt input {
    font-size: 0.9rem;
    box-sizing: border-box;
    width: 100%;
    padding: 0.3em;
    padding-left: 40px;
    transition: 0.3s;
    letter-spacing: 1px;
    border: 0;
    border-bottom: 2px solid var(--gray);
    background: transparent;
  }
  .iptxt input:focus {
    outline: none;
  }
  .iptxt input:focus::after {
    outline: none;
  }
  .iptxt i {
    position: absolute;
    top: -3px;
    left: 0;
    padding: 9px 5px;
    transition: 0.3s;
    color: var(--gray);
  }
  .iptxt textarea {
    font-size: 0.9rem;
    box-sizing: border-box;
    width: 100%;
    height: 10rem;
    padding: 0.3em 1rem 0.3rem 1rem;
    transition: 0.3s;
    letter-spacing: 1px;
    border: 2px solid var(--gray);
    border-radius: 4px;
    background: transparent;
  }
  .g-recaptcha {
    display: inline-block;
    margin: 10px auto;
    margin-bottom: 20px;
  }
  .submit-button {
    padding: 0.3em 1em;
    text-decoration: none;
    color: var(--gray);
    border: solid 2px var(--gray);
    border-radius: 5px;
    transition: .3s;
  }
  .submit-button:hover {
    background: var(--primary);
    border: solid 2px var(--primary);
    color: var(--white);
    box-shadow: 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.2);
  }
  .submit-button:active {
    box-shadow: none;
    transition: .1s;
  }
  @media screen and (max-width: 780px) {
    .iptxt {
      width: 80%;
    }
  }
`

function encode(data) {
return Object.keys(data)
.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
.join('&')
}


const ContactPage = (props, location) => {
  const [state, setState] = React.useState({})
  const recaptchaRef = React.createRef()
  const { siteRecaptchaKey } = useSiteMetadata();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const recaptchaValue = recaptchaRef.current.getValue()
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        'g-recaptcha-response': recaptchaValue,
        ...state,
      }),
    })
      .then(() => navigate(form.getAttribute('action')))
      .catch((error) => alert(error))
  }

  return (
    <Layout location={location} title="contact">
      <SEO title="お問合せ" noindex />
      <Wrapper className='inner'>
        <h1>お問合せ</h1>
        <form
          name="contact"
          method="post"
          action="/thanks/"
          data-netlify="true"
          data-netlify-recaptcha="true"
          onSubmit={handleSubmit}
        >
          <noscript>
            <p>This form won’t work with Javascript disabled</p>
          </noscript>
          <div className='iptxt'>
            <input type="text" required name="name" placeholder="お名前*" onChange={handleChange} />
            <i aria-hidden='true'>
              <MdPerson size="1.4em"/>
            </i>
          </div>
          <div className='iptxt'>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <i aria-hidden='true'>
              <MdEmail size="1.2em"/>
            </i>
          </div>
          <div className='iptxt'>
            <textarea name="message" required placeholder="お問合せ内容*" onChange={handleChange} />
          </div>
          <Recaptcha ref={recaptchaRef} sitekey={siteRecaptchaKey} className="g-recaptcha" />
          <div>
            <button type="submit" className='submit-button'>送信</button>
          </div>
        </form>
      </Wrapper>
    </Layout>
  )
}

export default ContactPage