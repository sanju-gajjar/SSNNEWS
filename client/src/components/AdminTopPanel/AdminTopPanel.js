
import React from 'react'
import Para from '../UI/Para'
import UploadButton from '../UI/UploadButton'
import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import ColorSlider from '../UI/ColorSlider';
import AdminTopCss from './AdminTopPanel.css'



function AdminTopPanel() {
  return (
    <section>
<Grid container spacing={2}>
    <Grid size={4}>
    <Card sx={{height:'100%'}}>
    <CardHeader className='cardHeader' title='Upload Top News' />
    
    <CardContent component='div' spacing={2} sx={{px:2, display:'flex',flexDirection:'column',height:'65%', textAlign:'center', justifyContent:'center',alignItems:'center'}}>
        <Para variant='subtitle1'>Upload top news Post from here</Para>
<UploadButton children='Upload Post ' sx={{mt:2}}/>
</CardContent>
</Card> 

    </Grid>

    <Grid size={4}>
    <Card sx={{height:'100%'}}>
    <CardHeader className='cardHeader' title='Total Post Status' sx={{lineHeight:0.7}}/>
    <CardContent component='div' sx={{px:2}}>
    <Para variant='subtitle2'>Followers</Para>
    <ColorSlider color='primary' defaultValue='40' val='100'/>
    <Para variant='subtitle2' >Likes</Para>
    <ColorSlider color='secondary'  defaultValue='60' val='140'/>
    <Para variant='subtitle2'>Views</Para>
    <ColorSlider color='grey' defaultValue='20' val='100'/>
    </CardContent>
</Card> 

    </Grid>

    <Grid size={4}>
    <Card sx={{height:'100%'}}>
    <CardHeader className='cardHeader' title='Live News Status' />
    <CardContent component='div' sx={{px:2}}>
    <Para variant='subtitle2'>Views</Para>
    <ColorSlider color='secondary' defaultValue='40' val='100'/>
    <Para variant='subtitle2' >Likes</Para>
    <ColorSlider color='grey'  defaultValue='60' val='140'/>
    <Para variant='subtitle2'>Comments</Para>
    <ColorSlider color='primary' defaultValue='20' val='100'/>
    </CardContent>
</Card> 

    </Grid>


</Grid>               
</section>

  )
}

export default AdminTopPanel

