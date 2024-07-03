import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';



const Logo = () => {
    return (
        <div className='ma4 mt0'>
             <Tilt
                className="Tilt flex flex-column justify-center items-center white ba b--black-10 br3"
                style={{ width: '120px', height: '120px', transformStyle: 'preserve-3d' }}
                perspective={500}
                glareEnable={true}
                glareMaxOpacity={0.45}
                scale={1.02}
            >
                <div className="flex flex-column justify-center items-center white i pa3" style={{transform: 'translateZ(60px)' }}>
                    <img alt='logo' src={brain} style={{paddingTop: '5px', width:'80px', height: '80px'}}></img>
                </div>
            </Tilt>
        </div>

    );
}

export default Logo;