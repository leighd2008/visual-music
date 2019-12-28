import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Visualizer from '../../components/Visualizer/Visualizer.component';
import PlayerBar from '../../components/PlayerBar/PlayerBar';
import classes from './App.module.scss';

import HamburgerToggle from '../../components/HamburgerToggle/HamburgerToggle';
import VisualPanel from '../../components/VisualPanel/VisualPanel';
import ScreenshotModal from '../../components/ScreenshotModal/ScreenshotModal';
import Error from '../../components/Error/Error';
import Success from '../../components/Success/Success';
import ShowElementsOnFullSize from '../../utils/ShowElementsOnFullSize';

export default function App({ song }) {
    // Local States
    const [playPressed, setPlayPressed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [isTogglePanel, setisTogglePanel] = useState(false);
    const [isSongEnded, setisSongEnded] = useState(false);
    // Redux States
    const { downloadState } = useSelector(state => state.download);
    const {
        screenshotUrl,
        takeScreenshot,
        screenshotSuccess,
        screenshotError
    } = useSelector(state => state.screenshot);
    const { isFullSize, isElementsShowed } = useSelector(
        state => state.fullSize
    );

    // Update state when a new song is uploaded
    useEffect(() => {
        setisSongEnded(false);
        setPlayPressed(false);
        setIsPlaying(false);
    }, [song]);

    const onSongEnd = () => {
        setIsPlaying(false);
        setPlayPressed(false);
        setisSongEnded(true);
    };

    return (
        <>
            <div className={classes.pageContainer}>
                <div className={classes.visualmusic}>
                    <div className={classes.visualContainer}>
                        <div
                            className={`${classes.visualmusic}
                             ${isTogglePanel && classes.shrink}`}
                        >
                            <div
                                id="hamburger"
                                className={`${classes.hamburger} 
                             ${isFullSize &&
                                 !isElementsShowed &&
                                 classes.hideHamburger}`}
                            >
                                <HamburgerToggle
                                    initToggle={isTogglePanel}
                                    onClick={toggleState =>
                                        setisTogglePanel(toggleState)
                                    }
                                />
                            </div>
                            <Visualizer
                                volume={volume}
                                takeScreenshot={takeScreenshot}
                                playPressed={playPressed}
                                uploadedSong={song.url && song.url}
                                blob={song.blob}
                                downloadVisual={isSongEnded && downloadState}
                                currentTime={currentTime}
                            />
                        </div>
                        <div
                            id="visual_panel"
                            className={`${classes.visualPanel}
                             ${isTogglePanel && classes.slideIn}
                             ${isFullSize &&
                                 !isElementsShowed &&
                                 classes.hideVisualPanel}`}
                        >
                            <VisualPanel />
                        </div>
                    </div>
                    <div>
                        <audio
                            id="audio"
                            onEnded={onSongEnd}
                            onLoadedMetadata={e =>
                                setDuration(e.currentTarget.duration)
                            }
                            onPlay={() => setIsPlaying(true)}
                            onTimeUpdate={e =>
                                !isSongEnded &&
                                parseInt(e.target.currentTime) !==
                                    parseInt(currentTime) &&
                                setCurrentTime(e.target.currentTime)
                            }
                        ></audio>
                    </div>
                    <div className={classes.bar}>
                        <PlayerBar
                            currentTime={currentTime}
                            volume={volume}
                            onVolumeChange={e => setVolume(e.target.value)}
                            onPlayPress={() => setPlayPressed(!playPressed)}
                            playPressed={playPressed}
                            isPlaying={isPlaying}
                            uploadedSong={song}
                            duration={duration}
                            isSongEnded={isSongEnded}
                            onCueTimeChange={e =>
                                setCurrentTime(e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>
            <ScreenshotModal screenshotUrl={screenshotUrl} />
            <Success screenshotSuccess={screenshotSuccess} />
            <Error screenshotError={screenshotError} />
            {/* attach when fullSize event listeners to hamburger and visual-panel for show while hover on */}
            {isFullSize && (
                <>
                    <ShowElementsOnFullSize elemID={'hamburger'} />{' '}
                    <ShowElementsOnFullSize elemID={'visual_panel'} />{' '}
                </>
            )}
        </>
    );
}
