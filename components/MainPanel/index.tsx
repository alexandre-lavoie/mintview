import * as React from 'react';
import { AppBar, Grid, IconButton, Tooltip } from '@material-ui/core';
import Create from '@material-ui/icons/Create';
import Mouse from '@material-ui/icons/Mouse';
import Flip from '@material-ui/icons/Flip';
import Delete from '@material-ui/icons/Delete';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Camera from '@material-ui/icons/CameraAlt';
import Lock from '@material-ui/icons/Lock';
import Copy from '@material-ui/icons/FileCopy';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';
import { Action } from '../../utils';

interface MainPanelProps {
    /** Current action to perform on canvas. */
    action?: Action,
    /** Is webcam active? */
    webcam?: boolean,
    onFlip?: () => void,
    onChangeAction?: () => void,
    onDelete?: () => void,
    onUndo?: () => void,
    onRedo?: () => void,
    onWebcamCapture?: () => void,
    onWebcamChange?: () => void,
    onLock?: () => void,
    onCopy?: () => void
}

const MainPanel: React.FC<MainPanelProps> = (props) => {
    return <AppBar position='fixed' style={{ bottom: 0, top: 'auto', padding: '1em' }}>
        <Grid container>
            <Grid container item xs spacing={2}>
                {(() => {
                    switch (props.action) {
                        case Action.DRAW:
                            return (
                                <Grid item>
                                    <Tooltip title="Undo">
                                        <IconButton onClick={() => (props.onUndo) ? props.onUndo() : {}}>
                                            <ArrowBack />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                    }
                })()}
                <Grid item>
                    <Tooltip title="Change Mode">
                        <IconButton onClick={() => (props.onChangeAction) ? props.onChangeAction() : {}}>
                            {(() => {
                                switch (props.action) {
                                    case Action.DRAW:
                                        return <Create />
                                    default:
                                        return <Mouse />;
                                }
                            })()}
                        </IconButton>
                    </Tooltip>
                </Grid>
                {(() => {
                    switch (props.action) {
                        case Action.DRAW:
                            return (
                                <Grid item>
                                    <Tooltip title="Redo">
                                        <IconButton onClick={() => (props.onRedo) ? props.onRedo() : {}}>
                                            <ArrowForward />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                    }
                })()}
                <Grid item>
                    <Tooltip title="Copy">
                        <IconButton onClick={() => (props.onCopy) ? props.onCopy() : {}}>
                            <Copy />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => (props.onDelete) ? props.onDelete() : {}}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Lock">
                        <IconButton onClick={() => (props.onLock) ? props.onLock() : {}}>
                            <Lock />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Flip">
                        <IconButton onClick={() => (props.onFlip) ? props.onFlip() : {}}>
                            <Flip />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs justify='flex-end'>
                <Grid item>
                    <Tooltip title="Toggle Camera">
                        <IconButton onClick={() => (props.onWebcamChange) ? props.onWebcamChange() : {}}>
                            {(props.webcam) ? <Videocam /> : <VideocamOff />}
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Screenshot">
                        <IconButton onClick={() => (props.onWebcamCapture) ? props.onWebcamCapture() : {}}>
                            <Camera />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    </AppBar>
}

export default MainPanel;