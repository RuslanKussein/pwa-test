import logo from './logo.svg';
import './App.css';
import InstallPromptSnackbar from "./InstallPromptSnackbar";
import {useCallback, useEffect, useState} from "react";

function App() {
    const [show, setShow] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(
        () => {
            function handleBeforeInstallPromptEvent(e) {
                // Prevent the mini-infobar from appearing on mobile
                e.preventDefault();
                // Stash the event so it can be triggered later.
                setDeferredPrompt(e);
                // Update UI notify the user they can install the PWA
                setShow( true);
            }

            //event is fired when the PWA meets the installability criteria.
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPromptEvent);

            return function () {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPromptEvent);
            }
        },
        //dependencies depends on the business logic
        []
    )

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    PWA best practices
                </p>
                <button className="push-button" disabled>
                    Enable Push Messages
                </button>
            </header>
            {
                show && (
                    <InstallPromptSnackbar
                        deferredPrompt={deferredPrompt}
                        setDeferredPrompt={setDeferredPrompt}
                    />
                )
            }
        </div>
    );
}

export default App;
