import React, {useEffect} from 'react';
import { useSiteMetadata } from "../../components/queries";



export const AdsenseAuto = () => {
  const { adsense } = useSiteMetadata();
  
  useEffect(() => {
    if (window) {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
    }
  });


  return (
      <ins 
        className="adsbygoogle"
        style={{display:'block'}}
        data-ad-client={adsense.clientKey}
        data-ad-slot={adsense.slot1}
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
  )
}

export const AdsenseHori = () => {
  const { adsense } = useSiteMetadata();
  
  useEffect(() => {
    if (window) {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
    }
  });


  return (
      <ins 
        className="adsbygoogle"
        style={{display:'block'}}
        data-ad-client={adsense.clientKey}
        data-ad-slot={adsense.slot1}
        data-ad-format='horizontal'
        data-full-width-responsive='true'
      />
  )
}
