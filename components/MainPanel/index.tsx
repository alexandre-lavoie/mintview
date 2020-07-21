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
import Unlock from '@material-ui/icons/LockOpen';
import Copy from '@material-ui/icons/FileCopy';
import Videocam from '@material-ui/icons/Visibility';
import VideocamOff from '@material-ui/icons/VisibilityOff';
import Settings from '@material-ui/icons/Settings';
import GridOn from '@material-ui/icons/GridOn';
import GridOff from '@material-ui/icons/GridOff';
import Screenshot from '@material-ui/icons/AspectRatio';
import { Action } from '../../utils';
import { useTranslation } from 'react-i18next';

interface MainPanelProps {
    /** Current action to perform on canvas. */
    action?: Action,
    /** Is webcam active? */
    webcam?: boolean,
    /** Is grid active? */
    grid?: boolean,
    onFlip?: () => void,
    onChangeAction?: () => void,
    onDelete?: () => void,
    onUndo?: () => void,
    onRedo?: () => void,
    onWebcamCapture?: () => void,
    onScreenshot?: () => void,
    onWebcamChange?: () => void,
    onLock?: () => void,
    onUnlock?: () => void,
    onCopy?: () => void,
    onSettingsChange?: () => void,
    onGridChange?: () => void
}

const MainPanel: React.FC<MainPanelProps> = (props) => {
    const { t } = useTranslation();

    return <AppBar position='fixed' style={{ top: 0, bottom: 'auto', padding: '1em' }}>
        <Grid container>
            <Grid container item xs spacing={2}>
                {(() => {
                    switch (props.action) {
                        case Action.DRAW:
                            return (
                                <Grid item>
                                    <Tooltip title={t("Undo") as string}>
                                        <IconButton onClick={() => (props.onUndo) ? props.onUndo() : {}}>
                                            <ArrowBack />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                    }
                })()}
                <Grid item>
                    <Tooltip title={t("Change Mode") as string}>
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
                                    <Tooltip title={t("Redo") as string}>
                                        <IconButton onClick={() => (props.onRedo) ? props.onRedo() : {}}>
                                            <ArrowForward />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                    }
                })()}
                <Grid item>
                    <Tooltip title={t("Copy") as string}>
                        <IconButton onClick={() => (props.onCopy) ? props.onCopy() : {}}>
                            <Copy />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={t("Delete") as string}>
                        <IconButton onClick={() => (props.onDelete) ? props.onDelete() : {}}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={t("Lock") as string}>
                        <IconButton onClick={() => (props.onLock) ? props.onLock() : {}}>
                            <Lock />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={t("Unlock") as string}>
                        <IconButton onClick={() => (props.onUnlock) ? props.onUnlock() : {}}>
                            <Unlock />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={t("Flip") as string}>
                        <IconButton onClick={() => (props.onFlip) ? props.onFlip() : {}}>
                            <Flip />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs justify='flex-end'>
                <Grid item>
                    <Tooltip title={t("Photo") as string}>
                        <IconButton onClick={() => (props.onWebcamCapture) ? props.onWebcamCapture() : {}}>
                            <Camera />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={t("Screenshot") as string}>
                        <IconButton onClick={() => (props.onScreenshot) ? props.onScreenshot() : {}}>
                            <Screenshot />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={t("Grid") as string}>
                        <IconButton onClick={() => (props.onGridChange) ? props.onGridChange() : {}}>
                            {(() => {
                                if (props.grid) {
                                    return <GridOn />
                                } else {
                                    return <GridOff />
                                }
                            })()}
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={t("Toggle Camera") as string}>
                        <IconButton onClick={() => (props.onWebcamChange) ? props.onWebcamChange() : {}}>
                            {(props.webcam) ? <Videocam /> : <VideocamOff />}
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={t("Settings") as string}>
                        <IconButton onClick={() => (props.onSettingsChange) ? props.onSettingsChange() : {}}>
                            <Settings />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    </AppBar>
}

export default MainPanel;