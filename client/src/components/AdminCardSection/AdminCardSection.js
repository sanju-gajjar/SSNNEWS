import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Para from '../UI/Para';
import PropTypes from 'prop-types';
import MessageIcon from '@mui/icons-material/Message';
import './AdminCardSection.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminNewsCard(props) {

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader

                action={
                    <IconButton aria-label="settings" spacing={1}>
                        <EditIcon color='primary' />

                    </IconButton>
                }
                title={props.title}
                // subheader="Spteember 14, 2016"
                subheader={props.subheader}
            />
            <CardMedia
                component="img"
                height="194"
                image={props.image}
              //  image="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Paella dish"
            />
            {/* <CardContent>
        <Para variant="body2" sx={{ color: 'text.secondary' }}>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Para>
      </CardContent> */}
            <CardActions disableSpacing>
                <CardContent component='div' className='cardIcons'>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon color='primary' />
                    </IconButton>
                    <Para variant='subtitle2' color='grey'>{props.likeTxt}</Para>
                </CardContent>

                <CardContent component='div' className='cardIcons'>

                    <IconButton aria-label="share">
                        <ShareIcon color='primary' />
                    </IconButton>
                    <Para variant='subtitle2' color='grey'>{props.shareTxt}</Para>
                </CardContent>

                <CardContent component='div' className='cardIcons' disableSpacing>

                    <IconButton aria-label="share">
                        <VisibilityIcon color='primary' />
                    </IconButton>
                    <Para variant='subtitle2' color='grey'>{props.viewTxt}</Para>
                </CardContent>

                <CardContent component='div' className='cardIcons' disableSpacing>

                    <IconButton aria-label="share">
                        <MessageIcon color='primary' />
                    </IconButton>
                    <Para variant='subtitle2' color='grey'>{props.commentTxt}</Para>
                </CardContent>


                <CardContent component='div' className='cardIcons'>

                    <IconButton aria-label="share">
                        <DeleteIcon sx ={{color:'#d32f2f'}} />
                    </IconButton>
                    
                </CardContent>



            </CardActions>

        </Card>
    );
}

AdminNewsCard.protoTypes = {
    subheader: PropTypes.string,
    title: PropTypes.string,
    commentTxt: PropTypes.string,
    likeTxt: PropTypes.number,
    shareTxt: PropTypes.number,
    viewTxt: PropTypes.number,
    image:PropTypes.string

}