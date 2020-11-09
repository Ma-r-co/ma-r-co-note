import React, {useEffect} from 'react';


const AdSense1 = props => {
  const { currentPath } = props
  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  }, [currentPath])
  
  return (
    <div>
      <ins 
        className="adsbygoogle"
        style={{display:"block"}}
        data-ad-client="ca-pub-7416328580394075"
        data-ad-slot="4572443902"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default AdSense1
