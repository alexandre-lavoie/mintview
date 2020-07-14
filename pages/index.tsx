import * as React from 'react';
import { Grid, Button } from '@material-ui/core';
import { useRouter } from 'next/router';

const Home: React.FC = () => {

    const router = useRouter();

    return (
        <Grid
            container
            justify='center'
            alignItems='center'
            style={{
                width: '100%',
                height: '100vh',
                overflow: 'hidden'
            }}
        >
            <Grid 
                item 
                container 
                direction='column'
                justify='center'
                alignItems='center'
                spacing={4}
            >
                <Grid item>
                    <img src='/logo.svg' width='500px' />
                </Grid>
                <Grid item>
                    <Button variant='contained' color='primary' onClick={() => router.push('/app')}>Open</Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Home;