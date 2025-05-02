import React from 'react';
import SafeHtml from '../../UI/SanitizedHTML/SafeHtml';


export default function Footer() {
  // const htmlContent1=`Copyright © 2024 The ERP CRM. All Rights Reserved. | Website Developed By ProZ Solutions LLP.`
  const htmlContent1 = `© 2024 The CRM. All Rights Reserved. |  Powered by ProZ Solutions LLP.`
 
  return (
    <>
    <footer className='text-center'>
    <SafeHtml content={htmlContent1}  />   
     </footer>
    </>
  )
}
