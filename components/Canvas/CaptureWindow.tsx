import * as React from 'react';
import { Drawer, Divider, TextField, Grid, Typography, Button } from '@material-ui/core';

interface CaptureWindowProps {
    /** Is the popup open? */
    open?: boolean,
    /** Event for closing window. */
    onClose?: () => void
}

const CaptureWindow: React.FC<CaptureWindowProps> = (props) => {
    /** Title for image. */
    const [title, setTitle] = React.useState('');
    /** Year for image. */
    const [year, setYear] = React.useState(new Date().getFullYear());

    /**
     * Downloads image with properties.
     */
    function downloadImage() {
        let capture = (document.getElementById('capture') as HTMLImageElement);
        let e = document.createElement('a');
        e.setAttribute('href', capture.src);
        e.setAttribute('download', `${title}.png`);
        document.body.appendChild(e);
        e.click();
        document.body.removeChild(e);
    }

    return <Drawer anchor='right' open={props.open} onClose={() => (props.onClose) ? props.onClose() : {}}>
        <div style={{ padding: '1em' }}>
            <img id="capture" width={640} height={480} />
            <Divider style={{ marginBottom: '1em'}} />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>Title</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        variant='outlined' 
                        placeholder="Title" 
                        style={{ width: '100%'}} 
                    />   
                </Grid>
                <Grid item xs={12}>
                    <Typography>Year</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        value={year} 
                        onChange={e => setYear(parseInt(e.target.value))} 
                        InputProps={{ inputProps: { min: 0 }}} 
                        type='number' 
                        variant='outlined' 
                        placeholder='Year' 
                        style={{ width: '100%'}} 
                    /> 
                </Grid>
                <Grid container item xs={12} justify='center' spacing={2}>
                    <Grid item>
                        <Button variant='contained'>Upload</Button>
                    </Grid>
                    <Grid item>
                        <Button variant='contained' color='primary' onClick={() => downloadImage()}>Download</Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    </Drawer>
}

export default CaptureWindow;