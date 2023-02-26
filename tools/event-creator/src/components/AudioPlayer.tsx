import Player from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export const AudioPlayer = (props: any[]) => {
    return (
        <Player
            autoPlay={false}
            onPlay={e => console.log("onPlay")}
            {...props}
            // other props here
        />
    ) 
}