import React from 'react';
import Adsense from 'react-adsense'


const AdSense1 = () => {
  return (
    <div>
      <Adsense.Google 
        style={{display: "block"}}
        client="ca-pub-7416328580394075"
        slot="4572443902"
        format="auto"
        responsive="true"
      /> 
    </div>
  )
}

export default AdSense1
