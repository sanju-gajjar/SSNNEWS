import { Grid, Paper } from '@mui/material'
import React, { useState } from 'react'
import Para from '../UI/Para'
import UploadButton from '../UI/UploadButton'
import AdminTopPanel from '../AdminTopPanel/AdminTopPanel'
import AdminFilterPanel from '../AdminFilterPanel/AdminFilterPanel'
import AdminCardSection from '../AdminCardSection/AdminCardSection'
import HeadigBox from '../HeadingBox/HeadigBox'
import AdminHeaderPanel from '../AdminHeaderPanel/AdminHeaderPanel'
import AdminBreadCrumb from '../AdminBreadCrumb/AdminBreadCrumb'

function AdminRightPanel() {
    const [category, setCategory] = useState('Top News');

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };
    const cardSection = [
        {
            subheader: 'September 14, 2016',
            likeTxt: '32',
            commentTxt: '22',
            shareTxt: '12',
            viewTxt: '211',
            image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'It’s important to me that my savings are invested ethically and help to make a positive change'

        },

        {
            subheader: 'June 24, 2022',
            likeTxt: '42',
            commentTxt: '72',
            shareTxt: '1',
            viewTxt: '124',
            image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'This fleeting experience was a powerful reminder of the raw magic and tranquillity of the Arctic wilderness'

        },

        {
            subheader: 'Spteember 14, 2016',
            likeTxt: '32',
            commentTxt: '22',
            shareTxt: '12',
            viewTxt: '211',
            image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'Bearing nature’s beauty and fragility – snoozing king of the Arctic wins photo contest'

        },

        {
            subheader: 'Spteember 14, 2016',
            likeTxt: '32',
            commentTxt: '22',
            shareTxt: '12',
            viewTxt: '211',
            image: "https://plus.unsplash.com/premium_photo-1675368244123-082a84cf3072?q=80&w=1550&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
             title: 'It’s important to me that my savings are invested ethically and help to make a positive change'

        },

        {
            subheader: 'June 10, 2016',
            likeTxt: '56',
            commentTxt: '40',
            shareTxt: '12',
            viewTxt: '31',
            image: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=1430&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'Bearing nature’s beauty and fragility – snoozing king of the Arctic wins photo contest'


        },

        {
            subheader: 'July 14, 2022',
            likeTxt: '86',
            commentTxt: '22',
            shareTxt: '0',
            viewTxt: '121',
            image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'This fleeting experience was a powerful reminder of the raw magic and tranquillity of the Arctic wilderness'

        },

        {
            subheader: 'Spteember 14, 2019',
            likeTxt: '62',
            commentTxt: '11',
            shareTxt: '1',
            viewTxt: '2221',
            image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: 'This fleeting experience was a powerful reminder of the raw magic and tranquillity of the Arctic wilderness'

        },


    ]
    return (
        <>
            <AdminHeaderPanel sx={{mb:1.5}}/>
            <AdminBreadCrumb/>
            <Paper elevation={3} sx={{ mt: 1.5, textAlign: 'left', p: 3 }}>
                <Para variant='h3' color='grey' sx={{ mb: 2 }}>Hii Lynda</Para>

                <AdminTopPanel />
               

                <Paper elevation={4} sx={{ my: 2.5, py: 1, px: 2 }}>

                    <AdminFilterPanel category={category} onCategoryChange={handleCategoryChange}/>
                </Paper>

                <HeadigBox heading={category}/>

                <Grid container spacing={2}>
                    {
                        cardSection.map((e, index) => (
                            <Grid size={4}  key={index}><AdminCardSection 
                            subheader ={e.subheader}
                            title= {e.title}
                            image= {e.image}
                            likeTxt={e.likeTxt}
                            commentTxt={e.commentTxt}
                            shareTxt={e.shareTxt}
                            viewTxt={e.viewTxt}/>

                            </Grid>
                        ))
                    }

                </Grid>

            </Paper>
        </>
    )
}

export default AdminRightPanel