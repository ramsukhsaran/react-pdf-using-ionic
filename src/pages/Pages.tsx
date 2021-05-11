import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,IonLoading, IonLabel } from '@ionic/react';
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router';
import {Document,Page} from "react-pdf";
import './Page.css';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import {pdfjs} from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc=`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`



const Pages: React.FC = () => {
  const [showLoading,setShowLoading] = useState(true)
  const [b64Data,setb64Data] = useState<any>(null)
  const [numPages,setNumPages] = useState<any>(null)

  const { name } = useParams<{ name: string; }>();
   
  const onDocumentLoadSuccess = ({numPages}:any)=>{
    setNumPages(numPages)
  }
  useEffect(()=>{
         fetch('/samplePdf.json')
            .then(res=>res.json())
            .then(data=>setb64Data(data.pdfres))
    setShowLoading(false)
  })

  const base64ToPdf = ()=>{
    const byteCharacters = atob(b64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for(let i=0;i<byteCharacters.length;i++){
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray],{type:'application/pdf'})
    const url=URL.createObjectURL(blob)
    return (
      <>
      <div className="all-page-container">
        <Document className="new-class PDFDocument"
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
        >
        {
          Array.apply(null,Array(numPages))
               .map((x,i)=>i+1)
               .map((page)=><Page pageNumber={page} scale={1.59} className="PDFPage PDFPageOne page-style" />)
        }
        </Document>

      </div>
      </>
    )
  }
    return (
    <IonPage>
      
      
      <IonContent fullscreen>
       <IonLoading cssClass="my-custom-class" isOpen={showLoading} message="Please wait we are loading" duration={9000}/>
       {
         b64Data?base64ToPdf():''
       }
      </IonContent>
    </IonPage>
  );
};

export default Pages;
