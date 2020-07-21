import * as React from 'react';
import { Typography, Dialog, Slider, Select, MenuItem, Popover } from '@material-ui/core';
import { HuePicker, ColorResult } from 'react-color';
import { useTranslation } from 'react-i18next';
import { languages } from '../../localization';

interface SettingsPanelProps {
    /** Is the popup open? */
    open?: boolean,
    /** Event for closing window. */
    onClose?: () => void,
    /** Pen color */
    penColor: string,
    /** Pen width */
    penWidth: number,
    /** On pen color change. */
    onPenColorChange?: (c: ColorResult) => void
    /** On pen width change. */
    onPenWidthChange?: (width: number) => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
    /** Localization. */
    const { t, i18n } = useTranslation();

    return <Dialog open={props.open != false} onClose={() => (props.onClose) ? props.onClose() : {}}>
        <div style={{ padding: '2em' }}>
            <Typography>{t('Pen Color')}</Typography>
            <HuePicker
                color={props.penColor}
                onChange={(c) => props.onPenColorChange ? props.onPenColorChange(c) : {}}
            />
            <br></br>
            <Typography>{t('Pen Width')}</Typography>
            <Slider 
                valueLabelDisplay="auto"
                value={props.penWidth}
                onChange={(e, v) => props.onPenWidthChange ? props.onPenWidthChange(v as number) : {}}
            />
            <Typography>{t('Language')}</Typography>
            <Select 
                value={(i18n.language) ? i18n.language : "unknown"}
                onChange={(e) => {i18n.changeLanguage(e.target.value as string); localStorage.setItem('language', e.target.value as string)}}
            >
                {
                    languages.map((language, index) => <MenuItem key={index} value={language}>{language}</MenuItem>)
                }
            </Select>
        </div>
    </Dialog>
}

export default SettingsPanel;