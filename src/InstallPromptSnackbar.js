import React, {useState} from "react";
import {Button, IconButton, Snackbar} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close'

export default function InstallPromptSnackbar({deferredPrompt, setDeferredPrompt}) {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleClickInstallButton = () => {
        setOpen(false);

        deferredPrompt.prompt();
        setDeferredPrompt(null);
    }


    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Install PWA"
            action={
                <>
                    <Button color="secondary" size="small" onClick={handleClickInstallButton}>
                        Install
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </>
            }
        />
    )
}